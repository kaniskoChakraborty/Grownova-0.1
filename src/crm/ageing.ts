import { Prisma } from '../../generated/prisma/client';

const { Decimal } = Prisma;
type Decimal = Prisma.Decimal;

export const AGEING_BUCKETS = ['notDue', 'd1_30', 'd31_60', 'd61_90', 'd90Plus'] as const;
export type AgeingBucket = (typeof AGEING_BUCKETS)[number];

type OpenInvoice = { leadId: string; total: Decimal; amountPaid: Decimal; dueDate: Date; lead: { name: string | null } };

const DAY_MS = 86_400_000;

export function bucketFor(daysOverdue: number): AgeingBucket {
  if (daysOverdue <= 0) return 'notDue';
  if (daysOverdue <= 30) return 'd1_30';
  if (daysOverdue <= 60) return 'd31_60';
  if (daysOverdue <= 90) return 'd61_90';
  return 'd90Plus';
}

/** Money still owed, split by how many days past the due date, and per customer (most overdue first). */
export function debtorAgeing(invoices: OpenInvoice[], now = new Date()) {
  const zero = () => Object.fromEntries(AGEING_BUCKETS.map((b) => [b, new Decimal(0)])) as Record<AgeingBucket, Decimal>;
  const buckets = zero();
  const debtors = new Map<string, { leadId: string; name: string | null; invoices: number; maxDaysOverdue: number; buckets: Record<AgeingBucket, Decimal> }>();
  for (const inv of invoices) {
    const owed = inv.total.minus(inv.amountPaid);
    const days = Math.floor((now.getTime() - inv.dueDate.getTime()) / DAY_MS);
    const bucket = bucketFor(days);
    buckets[bucket] = buckets[bucket].plus(owed);
    const d = debtors.get(inv.leadId) ?? { leadId: inv.leadId, name: inv.lead.name, invoices: 0, maxDaysOverdue: days, buckets: zero() };
    d.invoices += 1;
    d.maxDaysOverdue = Math.max(d.maxDaysOverdue, days);
    d.buckets[bucket] = d.buckets[bucket].plus(owed);
    debtors.set(inv.leadId, d);
  }
  const total = (b: Record<AgeingBucket, Decimal>) => AGEING_BUCKETS.reduce((s, k) => s.plus(b[k]), new Decimal(0));
  const strings = (b: Record<AgeingBucket, Decimal>) => Object.fromEntries(AGEING_BUCKETS.map((k) => [k, b[k].toString()]));
  return {
    asOf: now.toISOString(),
    totalOutstanding: total(buckets).toString(),
    buckets: strings(buckets),
    debtors: [...debtors.values()]
      .sort((a, b) => b.maxDaysOverdue - a.maxDaysOverdue)
      .map((d) => ({ ...d, maxDaysOverdue: Math.max(0, d.maxDaysOverdue), outstanding: total(d.buckets).toString(), buckets: strings(d.buckets) })),
  };
}
