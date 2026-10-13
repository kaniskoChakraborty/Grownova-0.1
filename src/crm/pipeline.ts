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

/** The next stage on the happy path (never LOST); undefined once the lead is WON or LOST. */
export const nextStage = (from: LeadStatus) => NEXT_STAGES[from].find((s) => s !== 'LOST');

// Enrichment moves an open NEW/CONTACTED lead straight to QUALIFIED when its score reaches this.
// ponytail: one fixed threshold for every business; make it a business setting when one asks.
export const AUTO_QUALIFY_SCORE = 70;
export const shouldAutoQualify = (status: LeadStatus, score: number) =>
  score >= AUTO_QUALIFY_SCORE && (status === 'NEW' || status === 'CONTACTED');
