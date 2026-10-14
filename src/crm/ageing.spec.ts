import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { bucketFor, debtorAgeing } from './ageing';

const { Decimal } = Prisma;

const now = new Date('2026-10-14T12:00:00Z');
const inv = (leadId: string, total: string, paid: string, due: string) => ({
  leadId, total: new Decimal(total), amountPaid: new Decimal(paid), dueDate: new Date(due), lead: { name: leadId.toUpperCase() },
});

describe('bucketFor', () => {
  it('uses 30-day bands past the due date', () => {
    assert.equal(bucketFor(-5), 'notDue');
    assert.equal(bucketFor(0), 'notDue');
    assert.equal(bucketFor(1), 'd1_30');
    assert.equal(bucketFor(30), 'd1_30');
    assert.equal(bucketFor(31), 'd31_60');
    assert.equal(bucketFor(90), 'd61_90');
    assert.equal(bucketFor(91), 'd90Plus');
  });
});

describe('debtorAgeing', () => {
  it('sums what is still owed per bucket and per customer, most overdue first', () => {
    const r = debtorAgeing([
      inv('a', '1000', '0', '2026-11-01T00:00:00Z'), // not due
      inv('a', '500.50', '100', '2026-09-01T00:00:00Z'), // 43 days late, 400.50 owed
      inv('b', '200', '50', '2026-06-01T00:00:00Z'), // 135 days late
    ], now);
    assert.equal(r.totalOutstanding, '1550.5');
    assert.deepEqual(r.buckets, { notDue: '1000', d1_30: '0', d31_60: '400.5', d61_90: '0', d90Plus: '150' });
    assert.deepEqual(r.debtors.map((d) => [d.leadId, d.outstanding, d.invoices, d.maxDaysOverdue]), [['b', '150', 1, 135], ['a', '1400.5', 2, 43]]);
  });

  it('reports 0 days overdue for customers with nothing late', () => {
    assert.equal(debtorAgeing([inv('a', '10', '0', '2026-12-01T00:00:00Z')], now).debtors[0].maxDaysOverdue, 0);
  });
});
