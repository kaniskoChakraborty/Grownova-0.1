import { AccountType, Prisma } from '../../generated/prisma/client';

export type DraftLine = { accountId: string; debit?: number; credit?: number; note?: string };

/**
 * Why a set of journal lines can't be posted, or null if it's a valid double entry: at least two lines, each a
 * debit or a credit (not both), no account on both sides, and debits equal to credits to the paisa.
 * The database checks the balance again when the journal commits.
 */
export function linesProblem(lines: DraftLine[]) {
  if (lines.length < 2) return 'A journal needs at least two lines';
  const debited = new Set<string>();
  const credited = new Set<string>();
  let debit = new Prisma.Decimal(0);
  let credit = new Prisma.Decimal(0);
  for (const [i, l] of lines.entries()) {
    const d = l.debit ?? 0;
    const c = l.credit ?? 0;
    if ((d > 0) === (c > 0)) return `Line ${i + 1} must have either a debit or a credit`;
    (d > 0 ? debited : credited).add(l.accountId);
    debit = debit.plus(d);
    credit = credit.plus(c);
  }
  if ([...debited].some((a) => credited.has(a))) return 'An account cannot be both debited and credited in one journal';
  if (!debit.equals(credit)) return `Debits (${debit.toFixed(2)}) must equal credits (${credit.toFixed(2)})`;
  return null;
}

/** The lines that cancel a journal out: every debit becomes a credit and vice versa. */
export function reversedLines(lines: { accountId: string; debit: Prisma.Decimal; credit: Prisma.Decimal }[]) {
  return lines.map((l) => ({ accountId: l.accountId, debit: l.credit, credit: l.debit }));
}

type Sides = { debit: Prisma.Decimal; credit: Prisma.Decimal };

/** Assets and expenses grow with debits; liabilities, equity and income grow with credits. */
export const debitNormal = (type: AccountType) => type === AccountType.ASSET || type === AccountType.EXPENSE;

/** Each line with the account's balance after it, starting from `opening`; balances are positive on the account's normal side. */
export function withRunningBalance<T extends Sides>(opening: Prisma.Decimal, lines: T[], type: AccountType) {
  let balance = opening;
  return lines.map((l) => {
    balance = balance.plus(debitNormal(type) ? l.debit.minus(l.credit) : l.credit.minus(l.debit));
    return { ...l, balance };
  });
}

/** Net debit or credit per account (zero balances dropped) and the column totals, which must match. */
export function trialBalance<T extends Sides>(rows: T[]) {
  const zero = new Prisma.Decimal(0);
  let debit = zero;
  let credit = zero;
  const accounts = rows.flatMap(({ debit: d, credit: c, ...rest }) => {
    const net = d.minus(c);
    if (net.isZero()) return [];
    debit = debit.plus(net.gt(0) ? net : zero);
    credit = credit.plus(net.lt(0) ? net.neg() : zero);
    return [{ ...rest, debit: net.gt(0) ? net : zero, credit: net.lt(0) ? net.neg() : zero }];
  });
  return { accounts, totalDebit: debit, totalCredit: credit, balanced: debit.equals(credit) };
}
