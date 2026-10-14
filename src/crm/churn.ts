// ponytail: churn stub. A won customer is "at risk" purely on days since we last billed or touched them.
// Swap for a GrowAI score (order frequency, ticket history) once there's enough data.
export const CHURN_MEDIUM_DAYS = 90;
export const CHURN_HIGH_DAYS = 180;

export type ChurnRisk = 'HIGH' | 'MEDIUM';

export function churnRisk(daysQuiet: number): ChurnRisk | null {
  if (daysQuiet >= CHURN_HIGH_DAYS) return 'HIGH';
  if (daysQuiet >= CHURN_MEDIUM_DAYS) return 'MEDIUM';
  return null;
}
