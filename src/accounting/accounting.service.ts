import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JournalSource, Prisma } from '../../generated/prisma/client';
import { financialYear } from '../crm/irn';
import { istPeriod } from '../inventory/stock';
import { PrismaService } from '../prisma/prisma.service';
import { CHART } from './chart';
import { CreateAccountDto, CreateJournalDto, LedgerQuery, ListAccountsQuery, ListJournalsQuery, ReverseJournalDto, TrialBalanceQuery, UpdateAccountDto } from './dto/accounting.dto';
import { DraftLine, debitNormal, linesProblem, reversedLines, trialBalance, withRunningBalance } from './journal';

const DETAIL = {
  lines: { include: { account: { select: { code: true, name: true } } } },
  reversedBy: { select: { id: true, number: true } },
};

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  // Every business gets the standard chart on first use; skipDuplicates makes racing first calls harmless.
  async ensureChart(businessId: string) {
    if (await this.prisma.account.count({ where: { businessId, isSystem: true } })) return;
    await this.prisma.account.createMany({ data: CHART.map((a) => ({ ...a, businessId, isSystem: true })), skipDuplicates: true });
  }

  async findAccounts(businessId: string, { type }: ListAccountsQuery) {
    await this.ensureChart(businessId);
    return this.prisma.account.findMany({ where: { businessId, type }, orderBy: { code: 'asc' } });
  }

  async createAccount(businessId: string, dto: CreateAccountDto) {
    await this.ensureChart(businessId);
    try {
      return await this.prisma.account.create({ data: { ...dto, businessId } });
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') throw new ConflictException('An account with that code or name already exists');
      throw e;
    }
  }

  async updateAccount(businessId: string, id: string, dto: UpdateAccountDto) {
    const account = await this.prisma.account.findFirst({ where: { id, businessId } });
    if (!account) throw new NotFoundException('Account not found');
    if (dto.isActive === false && account.isSystem) throw new BadRequestException(`${account.name} is a standard account and cannot be archived`);
    try {
      return await this.prisma.account.update({ where: { id }, data: dto });
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') throw new ConflictException('An account with that name already exists');
      throw e;
    }
  }

  // Posts a balanced journal. Lines are checked here for a clear error; the database checks the balance again on commit.
  async createJournal(businessId: string, dto: CreateJournalDto, actorId: string) {
    const problem = linesProblem(dto.lines);
    if (problem) throw new BadRequestException(problem);
    await this.ensureChart(businessId);
    const ids = [...new Set(dto.lines.map((l) => l.accountId))];
    const found = await this.prisma.account.count({ where: { id: { in: ids }, businessId, isActive: true } });
    if (found !== ids.length) throw new BadRequestException('Every line needs an active account of this business');
    const date = this.day(dto.date);
    const journal = await this.prisma.$transaction((tx) => this.post(tx, businessId, date, dto.narration, dto.lines, actorId, JournalSource.MANUAL));
    return this.findJournal(businessId, journal.id);
  }

  // A reversal is a new journal with every side swapped; the original stays as it was. One reversal per journal.
  async reverseJournal(businessId: string, id: string, dto: ReverseJournalDto, actorId: string) {
    const original = await this.findJournal(businessId, id);
    if (original.reversedBy) throw new BadRequestException(`${original.number} is already reversed by ${original.reversedBy.number}`);
    if (original.reversalOfId) throw new BadRequestException(`${original.number} is itself a reversal; post a fresh journal instead`);
    if (original.source !== JournalSource.MANUAL) throw new BadRequestException(`${original.number} was posted automatically; cancel the sale or invoice it came from instead`);
    const date = this.day(dto.date);
    if (date < original.date) throw new BadRequestException('A reversal cannot be dated before the journal it reverses');
    const lines = reversedLines(original.lines).map((l) => ({ accountId: l.accountId, debit: l.debit.toNumber(), credit: l.credit.toNumber() }));
    try {
      const journal = await this.prisma.$transaction((tx) => this.post(tx, businessId, date, `Reversal of ${original.number}: ${dto.reason}`, lines, actorId, JournalSource.REVERSAL, { reversalOfId: id }));
      return this.findJournal(businessId, journal.id);
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') throw new BadRequestException(`${original.number} is already reversed`);
      throw e;
    }
  }

  async findJournals(businessId: string, { from, to, accountId }: ListJournalsQuery) {
    return this.prisma.journal.findMany({
      where: {
        businessId,
        date: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined },
        lines: accountId ? { some: { accountId } } : undefined,
      },
      include: DETAIL,
      orderBy: [{ date: 'desc' }, { number: 'desc' }],
      take: 100, // ponytail: fixed cap; the ledger (Step 2) is the paged view per account
    });
  }

  async findJournal(businessId: string, id: string) {
    const journal = await this.prisma.journal.findFirst({ where: { id, businessId }, include: DETAIL });
    if (!journal) throw new NotFoundException('Journal not found');
    return journal;
  }

  // One account's postings in a date range, with the balance carried in from before `from` and a running balance after each line.
  // ponytail: no paging; the range defaults to one financial year. Page by date once a ledger outgrows a response.
  async ledger(businessId: string, accountId: string, query: LedgerQuery) {
    const account = await this.prisma.account.findFirst({ where: { id: accountId, businessId }, select: { id: true, code: true, name: true, type: true } });
    if (!account) throw new NotFoundException('Account not found');
    const to = query.to ?? istPeriod().to;
    const from = query.from ?? `${financialYear(new Date(`${to}T00:00:00+05:30`)).slice(0, 4)}-04-01`;
    if (from > to) throw new BadRequestException('from must be on or before to');
    const before = await this.prisma.journalLine.aggregate({ where: { accountId, journal: { date: { lt: new Date(from) } } }, _sum: { debit: true, credit: true } });
    const zero = new Prisma.Decimal(0);
    const [opening] = withRunningBalance(zero, [{ debit: before._sum.debit ?? zero, credit: before._sum.credit ?? zero }], account.type);
    const lines = await this.prisma.journalLine.findMany({
      where: { accountId, journal: { date: { gte: new Date(from), lte: new Date(to) } } },
      select: { debit: true, credit: true, note: true, journal: { select: { id: true, number: true, date: true, narration: true } } },
      orderBy: [{ journal: { date: 'asc' } }, { journal: { createdAt: 'asc' } }],
    });
    const rows = withRunningBalance(opening.balance, lines, account.type);
    return {
      account, from, to, side: debitNormal(account.type) ? 'DEBIT' : 'CREDIT',
      opening: opening.balance, closing: rows.at(-1)?.balance ?? opening.balance,
      totalDebit: lines.reduce((s, l) => s.plus(l.debit), zero), totalCredit: lines.reduce((s, l) => s.plus(l.credit), zero),
      lines: rows.map(({ journal: { id: journalId, ...j }, ...l }) => ({ journalId, ...j, ...l })),
    };
  }

  // Every account's net balance at the end of `asOf`, in a debit or credit column; the two totals must agree.
  async trialBalance(businessId: string, { asOf }: TrialBalanceQuery) {
    const day = asOf ?? istPeriod().to;
    const [sums, accounts] = await Promise.all([
      this.prisma.journalLine.groupBy({ by: ['accountId'], where: { journal: { businessId, date: { lte: new Date(day) } } }, _sum: { debit: true, credit: true } }),
      this.prisma.account.findMany({ where: { businessId }, select: { id: true, code: true, name: true, type: true }, orderBy: { code: 'asc' } }),
    ]);
    const byId = new Map(sums.map((s) => [s.accountId, s._sum]));
    const zero = new Prisma.Decimal(0);
    const rows = accounts.filter((a) => byId.has(a.id)).map((a) => ({ ...a, debit: byId.get(a.id)!.debit ?? zero, credit: byId.get(a.id)!.credit ?? zero }));
    return { asOf: day, ...trialBalance(rows) };
  }

  // Books a sale, invoice or payment inside the caller's transaction, so the journal commits with the event or not at all.
  // Lines name accounts by chart code; `at` is when it happened, and its India date becomes the journal date.
  async postEvent(tx: Prisma.TransactionClient, businessId: string, e: { at: Date; narration: string; source: JournalSource; sourceId: string; actorId?: string | null; lines: { code: string; debit?: Prisma.Decimal; credit?: Prisma.Decimal }[] }) {
    await this.ensureChart(businessId);
    const accounts = await tx.account.findMany({ where: { businessId, code: { in: e.lines.map((l) => l.code) } }, select: { id: true, code: true } });
    const id = new Map(accounts.map((a) => [a.code, a.id]));
    const lines = e.lines.map((l) => ({ accountId: id.get(l.code)!, debit: l.debit?.toNumber(), credit: l.credit?.toNumber() }));
    return this.post(tx, businessId, new Date(istPeriod(undefined, undefined, e.at).to), e.narration, lines, e.actorId ?? null, e.source, { sourceId: e.sourceId });
  }

  // Undoes the automatic journal of a cancelled sale or invoice by posting its mirror image. Events booked before
  // auto-posting existed have no journal, so there is nothing to undo.
  async reverseEvent(tx: Prisma.TransactionClient, businessId: string, source: JournalSource, sourceId: string, reason: string, actorId?: string | null) {
    const original = await tx.journal.findUnique({ where: { businessId_source_sourceId: { businessId, source, sourceId } }, include: { lines: true } });
    if (!original) return null;
    const lines = reversedLines(original.lines).map((l) => ({ accountId: l.accountId, debit: l.debit.toNumber(), credit: l.credit.toNumber() }));
    const date = new Date(Math.max(original.date.getTime(), new Date(istPeriod().to).getTime()));
    return this.post(tx, businessId, date, `Reversal of ${original.number}: ${reason}`, lines, actorId ?? null, JournalSource.REVERSAL, { reversalOfId: original.id, sourceId });
  }

  // Numbers are gapless per financial year of the journal's date: JV/26-27/000001.
  private async post(tx: Prisma.TransactionClient, businessId: string, date: Date, narration: string, lines: DraftLine[], actorId: string | null, source: JournalSource, link: { reversalOfId?: string; sourceId?: string } = {}) {
    const fy = financialYear(new Date(`${date.toISOString().slice(0, 10)}T00:00:00+05:30`));
    const total = lines.reduce((sum, l) => sum.plus(l.debit ?? 0), new Prisma.Decimal(0));
    const { last } = await tx.invoiceCounter.upsert({
      where: { businessId_series_fy: { businessId, series: 'JV', fy } },
      create: { businessId, series: 'JV', fy, last: 1 },
      update: { last: { increment: 1 } },
    });
    return tx.journal.create({
      data: {
        businessId, number: `JV/${fy.slice(2)}/${String(last).padStart(6, '0')}`, date, narration, total, source, ...link, createdById: actorId,
        lines: { create: lines.map((l) => ({ accountId: l.accountId, debit: l.debit ?? 0, credit: l.credit ?? 0, note: l.note })) },
      },
    });
  }

  // A YYYY-MM-DD accounting date (today in India by default) as the UTC-midnight Date that a @db.Date column stores.
  private day(date?: string) {
    const today = istPeriod().to;
    if (date && date > today) throw new BadRequestException('date cannot be in the future');
    return new Date(date ?? today);
  }
}
