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

const DAY = 86_400_000;
const IST_OFFSET = 330 * 60_000;

/** A report period of whole IST days, from the 1st of this month to today unless given. `lt` is exclusive. */
export function istPeriod(from?: string, to?: string, now = new Date()) {
  const today = new Date(now.getTime() + IST_OFFSET).toISOString().slice(0, 10);
  const start = from ?? `${today.slice(0, 8)}01`;
  const end = to ?? today;
  const midnight = (day: string) => new Date(`${day}T00:00:00+05:30`);
  return { from: start, to: end, gte: midnight(start), lt: new Date(midnight(end).getTime() + DAY) };
}

/**
 * Rules-based demand forecast v1: average daily sales over the last `days` days, carried forward `horizon` days.
 * reorder covers that demand plus the low-stock threshold, rounded up to whole units.
 */
// ponytail: flat moving average, no seasonality or trend; swap in a real model once there is a year of sales.
export function forecastLine(sold: Prisma.Decimal, days: number, stock: Prisma.Decimal, horizon: number, threshold: number | null) {
  const perDay = sold.div(days);
  const demand = perDay.times(horizon);
  return {
    perDay: perDay.toDecimalPlaces(3),
    demand: demand.toDecimalPlaces(3),
    daysOfCover: perDay.gt(0) ? stock.div(perDay).toDecimalPlaces(1).toNumber() : null,
    reorder: Prisma.Decimal.max(0, demand.plus(threshold ?? 0).minus(stock)).toDecimalPlaces(0, Prisma.Decimal.ROUND_UP),
  };
}
