import type { Lead, LeadType, FollowUp } from '../types';
import { supabase } from './supabase/supabase';

type DbLeadType = 'hot' | 'warm' | 'cold' | 'other';
type DbLeadStatus = 'active' | 'dropped';

interface LeadFollowupRow {
  id: string;
  note: string;
  created_at: string;
}

interface LeadRow {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  type: DbLeadType;
  category: string | null;
  status: DbLeadStatus;
  follow_up_date: string;
  created_at: string;
  updated_at: string;
  lead_followups?: LeadFollowupRow[] | null;
}

interface CreateLeadInput {
  name: string;
  phone: string;
  type: LeadType;
  category: string;
  feedback: string;
  followUpDate: string;
}

interface AuthUserContext {
  id: string;
  email: string;
}

const leadSelect = `
  id,
  user_id,
  name,
  phone,
  type,
  category,
  status,
  follow_up_date,
  created_at,
  updated_at,
  lead_followups (
    id,
    note,
    created_at
  )
`;

function mapLeadTypeFromDb(type: DbLeadType): LeadType {
  if (type === 'hot') return 'Hot';
  if (type === 'warm') return 'Warm';
  return 'Cold';
}

function mapLeadTypeToDb(type: LeadType): DbLeadType {
  if (type === 'Hot') return 'hot';
  if (type === 'Warm') return 'warm';
  return 'cold';
}

function mapFollowUps(rows: LeadFollowupRow[] = []): FollowUp[] {
  return [...rows]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((row) => ({
      id: row.id,
      comment: row.note,
      timestamp: row.created_at,
    }));
}

function mapLead(row: LeadRow): Lead {
  const followUps = mapFollowUps(row.lead_followups ?? []);

  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    type: mapLeadTypeFromDb(row.type),
    category: row.category ?? '',
    feedback: followUps[0]?.comment ?? '',
    followUpDate: row.follow_up_date,
    followUps,
    dropped: row.status === 'dropped',
    createdAt: row.created_at,
  };
}

async function requireUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('You must be signed in to manage leads.');
  }

  return user.id;
}

async function requireAuthUser(): Promise<AuthUserContext> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('You must be signed in to manage leads.');
  }

  if (!user.email) {
    throw new Error('Signed-in user is missing an email address.');
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export async function ensureCurrentUserProfile(): Promise<string> {
  const user = await requireAuthUser();

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email,
      },
      { onConflict: 'id' },
    );

  if (error) {
    throw error;
  }

  return user.id;
}

export async function fetchLeads(): Promise<Lead[]> {
  await requireUserId();

  const { data, error } = await supabase
    .from('leads')
    .select(leadSelect)
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: true, referencedTable: 'lead_followups' });

  if (error) {
    throw error;
  }

  return (data as LeadRow[]).map(mapLead);
}

export async function fetchLeadById(id: string): Promise<Lead | null> {
  await requireUserId();

  const { data, error } = await supabase
    .from('leads')
    .select(leadSelect)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapLead(data as LeadRow) : null;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const userId = await ensureCurrentUserProfile();

  const { data: createdLead, error: leadError } = await supabase
    .from('leads')
    .insert({
      user_id: userId,
      name: input.name,
      phone: input.phone,
      type: mapLeadTypeToDb(input.type),
      category: input.category,
      status: 'active',
      follow_up_date: input.followUpDate,
    })
    .select(leadSelect)
    .single();

  if (leadError) {
    throw leadError;
  }

  if (input.feedback.trim()) {
    const { error: followupError } = await supabase.from('lead_followups').insert({
      lead_id: createdLead.id,
      note: input.feedback.trim(),
    });

    if (followupError) {
      throw followupError;
    }
  }

  const lead = await fetchLeadById(createdLead.id);

  if (!lead) {
    throw new Error('Lead was created but could not be reloaded.');
  }

  return lead;
}

export async function createLeadFollowUp(leadId: string, note: string): Promise<FollowUp> {
  await requireUserId();

  const { data, error } = await supabase
    .from('lead_followups')
    .insert({
      lead_id: leadId,
      note,
    })
    .select('id, note, created_at')
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    comment: data.note,
    timestamp: data.created_at,
  };
}

export async function dropLeadById(leadId: string): Promise<void> {
  await requireUserId();

  const { error } = await supabase
    .from('leads')
    .update({ status: 'dropped' })
    .eq('id', leadId);

  if (error) {
    throw error;
  }
}
