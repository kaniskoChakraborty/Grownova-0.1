import { LeadStatus } from '../../generated/prisma/client';

// Allowed stage moves. Forward one step, or drop to LOST from any open stage; WON and LOST are final.
// ponytail: no backward moves or reopen; add them here if sales asks for it.
export const NEXT_STAGES: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['WON', 'LOST'],
  WON: [],
  LOST: [],
};

export const canMove = (from: LeadStatus, to: LeadStatus) => NEXT_STAGES[from].includes(to);
