import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lead, FollowUp } from '../types';

interface LeadsState {
  leads: Lead[];
}

const initialState: LeadsState = {
  leads: [],
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads(state, action: PayloadAction<Lead[]>) {
      state.leads = action.payload;
    },
    addLead(state, action: PayloadAction<Lead>) {
      state.leads.unshift(action.payload);
    },
    upsertLead(state, action: PayloadAction<Lead>) {
      const index = state.leads.findIndex((lead) => lead.id === action.payload.id);

      if (index === -1) {
        state.leads.unshift(action.payload);
        return;
      }

      state.leads[index] = action.payload;
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

export const { setLeads, addLead, upsertLead, dropLead, addFollowUp } = leadsSlice.actions;
export default leadsSlice.reducer;
