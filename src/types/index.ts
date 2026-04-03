export type LeadType = 'Hot' | 'Warm' | 'Cold';

export interface FollowUp {
  id: string;
  comment: string;
  timestamp: string; // ISO string
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: LeadType;
  category: string;
  feedback: string;
  followUpDate: string; // YYYY-MM-DD
  followUps: FollowUp[];
  dropped: boolean;
  createdAt: string; // ISO string
}

export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
}
