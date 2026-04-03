import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lead, FollowUp } from '../types';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Arjun Mehta',
    phone: '+91 98765 43210',
    type: 'Hot',
    category: 'Real Estate',
    feedback: 'Very interested, follow up next week to close the deal.',
    followUpDate: '2026-04-10',
    followUps: [
      { id: 'f1', comment: 'Called and discussed project details.', timestamp: '2026-04-01T10:30:00Z' },
      { id: 'f2', comment: 'Sent proposal via email.', timestamp: '2026-04-02T14:00:00Z' },
    ],
    dropped: false,
    createdAt: '2026-03-28T09:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 91234 56789',
    type: 'Warm',
    category: 'SaaS',
    feedback: 'Interested but wants to compare options first.',
    followUpDate: '2026-04-15',
    followUps: [
      { id: 'f3', comment: 'Had intro call, sent brochure.', timestamp: '2026-03-30T11:00:00Z' },
    ],
    dropped: false,
    createdAt: '2026-03-29T10:00:00Z',
  },
  {
    id: '3',
    name: 'Rahul Gupta',
    phone: '+91 87654 32109',
    type: 'Cold',
    category: 'Insurance',
    feedback: 'Not responsive. Try again in a month.',
    followUpDate: '2026-05-01',
    followUps: [],
    dropped: false,
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: '4',
    name: 'Sneha Kapoor',
    phone: '+91 99887 76655',
    type: 'Hot',
    category: 'Consulting',
    feedback: 'Ready to sign. Finalizing terms.',
    followUpDate: '2026-04-05',
    followUps: [
      { id: 'f4', comment: 'Contract review in progress.', timestamp: '2026-04-01T16:00:00Z' },
    ],
    dropped: false,
    createdAt: '2026-03-30T07:00:00Z',
  },
  {
    id: '5',
    name: 'Vikram Nair',
    phone: '+91 70000 11223',
    type: 'Cold',
    category: 'E-commerce',
    feedback: 'No budget right now.',
    followUpDate: '2026-06-01',
    followUps: [],
    dropped: true,
    createdAt: '2026-03-20T09:00:00Z',
  },
];

interface LeadsState {
  leads: Lead[];
}

const initialState: LeadsState = {
  leads: MOCK_LEADS,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead(state, action: PayloadAction<Lead>) {
      state.leads.unshift(action.payload);
    },
    dropLead(state, action: PayloadAction<string>) {
      const lead = state.leads.find((l) => l.id === action.payload);
      if (lead) lead.dropped = true;
    },
    addFollowUp(state, action: PayloadAction<{ leadId: string; followUp: FollowUp }>) {
      const lead = state.leads.find((l) => l.id === action.payload.leadId);
      if (lead) lead.followUps.push(action.payload.followUp);
    },
  },
});

export const { addLead, dropLead, addFollowUp } = leadsSlice.actions;
export default leadsSlice.reducer;
