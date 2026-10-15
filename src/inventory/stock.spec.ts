import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { daysUntil, fefoSlices } from './stock';

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
