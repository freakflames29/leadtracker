import { Lead, LeadType, LeadStatus, LeadFollowup } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory mock storage
export let MOCK_LEADS: Lead[] = [
  {
    id: uuidv4(),
    userId: 'mock-user-id',
    name: 'Acme Corp',
    phone: '555-0101',
    type: LeadType.HOT,
    category: 'Enterprise',
    status: LeadStatus.ACTIVE,
    followUpDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    userId: 'mock-user-id',
    name: 'Jane Doe',
    phone: '555-0102',
    type: LeadType.WARM,
    category: 'Real Estate',
    status: LeadStatus.ACTIVE,
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export let MOCK_FOLLOWUPS: LeadFollowup[] = [];

/**
 * MOCKED LEADS SERVICE
 * Replace with actual Supabase client.
 */

export const fetchLeads = async (): Promise<Lead[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_LEADS]), 500));
};

export const fetchLeadById = async (id: string): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const lead = MOCK_LEADS.find(l => l.id === id);
      if (lead) resolve(lead);
      else reject(new Error("Lead not found"));
    }, 300);
  });
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Lead> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLead: Lead = {
        ...leadData,
        id: uuidv4(),
        userId: 'temp-user-id', // Ideally get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_LEADS.push(newLead);
      resolve(newLead);
    }, 600);
  });
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leadIndex = MOCK_LEADS.findIndex(l => l.id === id);
      if (leadIndex > -1) {
        MOCK_LEADS[leadIndex].status = status;
        MOCK_LEADS[leadIndex].updatedAt = new Date().toISOString();
        resolve(MOCK_LEADS[leadIndex]);
        MOCK_LEADS = [...MOCK_LEADS]; // Reassign for clear ref change
      } else {
        reject(new Error("Lead not found"));
      }
    }, 400);
  });
};

export const fetchLeadFollowups = async (leadId: string): Promise<LeadFollowup[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FOLLOWUPS.filter(f => f.leadId === leadId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, 300);
  });
};

export const addLeadFollowup = async (leadId: string, note: string): Promise<LeadFollowup> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFollowup: LeadFollowup = {
        id: uuidv4(),
        leadId,
        note,
        createdAt: new Date().toISOString(),
      };
      MOCK_FOLLOWUPS.push(newFollowup);
      MOCK_FOLLOWUPS = [...MOCK_FOLLOWUPS]; // Trigger spread ref
      resolve(newFollowup);
    }, 400);
  });
};
