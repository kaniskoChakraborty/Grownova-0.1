import { Prisma } from '../../generated/prisma/client';

export type Slice = { batchId: string | null; quantity: Prisma.Decimal };

/**
 * Splits an outgoing quantity across batches, first expiry first out. `batches` must already be sorted soonest
 * expiry first; whatever they can't cover comes from stock that has no batch (batchId null).
 */
export function fefoSlices(batches: { batchId: string; quantity: Prisma.Decimal }[], amount: Prisma.Decimal): Slice[] {
  const slices: Slice[] = [];
  let left = amount;
  for (const b of batches) {
    if (left.lte(0)) break;
    const take = Prisma.Decimal.min(left, b.quantity);
    if (take.gt(0)) slices.push({ batchId: b.batchId, quantity: take });
    left = left.minus(take);
  }
  if (left.gt(0)) slices.push({ batchId: null, quantity: left });
  return slices;
}

/** Whole days from today to a date-only value, negative once it has passed. */
// ponytail: "today" is the UTC date, so between midnight and 05:30 IST it lags by a day.
export function daysUntil(date: Date, now = new Date()): number {
  return Math.round((date.getTime() - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86_400_000);
}
