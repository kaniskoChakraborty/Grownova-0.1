import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { daysUntil, fefoSlices, forecastLine, istPeriod } from './stock';

const d = (n: number | string) => new Prisma.Decimal(n);
const show = (slices: ReturnType<typeof fefoSlices>) => slices.map((s) => [s.batchId, s.quantity.toString()]);

describe('fefoSlices', () => {
  const batches = [{ batchId: 'early', quantity: d(3) }, { batchId: 'late', quantity: d(5) }];

  it('takes from the soonest-expiring batch first', () => {
    assert.deepEqual(show(fefoSlices(batches, d(2))), [['early', '2']]);
    assert.deepEqual(show(fefoSlices(batches, d(6))), [['early', '3'], ['late', '3']]);
  });
  it('takes what batches cannot cover from stock without a batch', () => {
    assert.deepEqual(show(fefoSlices(batches, d('9.5'))), [['early', '3'], ['late', '5'], [null, '1.5']]);
    assert.deepEqual(show(fefoSlices([], d(4))), [[null, '4']]);
  });
});

describe('daysUntil', () => {
  const now = new Date('2026-10-15T10:00:00Z');
  it('counts whole days, negative once expired', () => {
    assert.equal(daysUntil(new Date('2026-10-15'), now), 0);
    assert.equal(daysUntil(new Date('2026-11-14'), now), 30);
    assert.equal(daysUntil(new Date('2026-10-10'), now), -5);
  });
});

describe('istPeriod', () => {
  const now = new Date('2026-10-15T20:00:00Z'); // already 16 Oct in India
  it('defaults to the 1st of this month up to today, in IST days', () => {
    const p = istPeriod(undefined, undefined, now);
    assert.deepEqual([p.from, p.to, p.gte.toISOString(), p.lt.toISOString()], ['2026-10-01', '2026-10-16', '2026-09-30T18:30:00.000Z', '2026-10-16T18:30:00.000Z']);
  });
  it('includes the whole of the last day', () => {
    assert.equal(istPeriod('2026-10-05', '2026-10-05', now).lt.toISOString(), '2026-10-05T18:30:00.000Z');
  });
});

describe('forecastLine', () => {
  const view = (l: ReturnType<typeof forecastLine>) => [l.perDay.toString(), l.demand.toString(), l.daysOfCover, l.reorder.toString()];
  it('carries average daily sales forward and reorders up to demand plus threshold', () => {
    assert.deepEqual(view(forecastLine(d(30), 30, d(10), 14, 5)), ['1', '14', 10, '9']);
  });
  it('rounds the reorder up to whole units and never goes below 0', () => {
    assert.deepEqual(view(forecastLine(d(10), 30, d(0), 14, null)), ['0.333', '4.667', 0, '5']);
    assert.deepEqual(view(forecastLine(d(0), 30, d(10), 14, 5)), ['0', '0', null, '0']);
  });
});
