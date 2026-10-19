import { Prisma } from '../../generated/prisma/client';

export type Shortfall = { variantId: string; sku: string; sold: Prisma.Decimal; deducted: Prisma.Decimal; short: Prisma.Decimal };

const MAX_AGE_DAYS = 30;
const CLOCK_SKEW_MS = 5 * 60_000;

// Why an offline sale's timestamp can't be trusted, or null if it's fine. A till's clock may drift a little,
// but a sale from the future or from over a month ago is bad data, not a late upload.
export function soldAtProblem(soldAt: Date, now = new Date()) {
  if (soldAt.getTime() > now.getTime() + CLOCK_SKEW_MS) return 'soldAt is in the future; check the till clock';
  if (now.getTime() - soldAt.getTime() > MAX_AGE_DAYS * 86_400_000) return `soldAt is more than ${MAX_AGE_DAYS} days old`;
  return null;
}

// Lines sold offline at a price other than today's sale price. The offline price stands; this is the log of it.
export function priceChanges(
  lines: { variantId: string; unitPrice: Prisma.Decimal; variant: { sku: string } }[],
  current: { id: string; salePrice: Prisma.Decimal }[],
) {
  return lines.flatMap((l) => {
    const now = current.find((c) => c.id === l.variantId)?.salePrice;
    return now && !now.equals(l.unitPrice) ? [{ variantId: l.variantId, sku: l.variant.sku, soldFor: l.unitPrice.toString(), priceNow: now.toString() }] : [];
  });
}
