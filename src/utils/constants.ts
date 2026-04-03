import { LeadType } from '../types';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lead_tracker_auth_token',
  USER_INFO: 'lead_tracker_user_info',
};

export const LEAD_TYPE_COLORS: Record<LeadType, { accent: string, bg: string, label: string }> = {
  [LeadType.HOT]: { accent: 'bg-lead-hot-accent border-lead-hot-accent', bg: 'bg-lead-hot-bg', label: 'text-lead-hot-badge' },
  [LeadType.WARM]: { accent: 'bg-lead-warm-accent border-lead-warm-accent', bg: 'bg-lead-warm-bg', label: 'text-lead-warm-badge' },
  [LeadType.COLD]: { accent: 'bg-lead-cold-accent border-lead-cold-accent', bg: 'bg-lead-cold-bg', label: 'text-lead-cold-badge' },
  [LeadType.OTHER]: { accent: 'bg-lead-other-accent border-lead-other-accent', bg: 'bg-lead-other-bg', label: 'text-lead-other-badge' },
};

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  [LeadType.HOT]: 'Hot',
  [LeadType.WARM]: 'Warm',
  [LeadType.COLD]: 'Cold',
  [LeadType.OTHER]: 'Other',
};
