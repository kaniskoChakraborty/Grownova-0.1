import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { priceChanges, soldAtProblem } from './sync';

const d = (n: number) => new Prisma.Decimal(n);
const now = new Date('2026-10-19T12:00:00Z');

describe('offline sync rules', () => {
  it('accepts recent sales and small clock drift, refuses future or month-old ones', () => {
    assert.equal(soldAtProblem(new Date('2026-10-18T09:00:00Z'), now), null);
    assert.equal(soldAtProblem(new Date('2026-10-19T12:04:00Z'), now), null);
    assert.match(soldAtProblem(new Date('2026-10-19T13:00:00Z'), now)!, /future/);
    assert.match(soldAtProblem(new Date('2026-09-01T00:00:00Z'), now)!, /30 days/);
  });

  it('logs only lines sold at a price other than today', () => {
    const lines = [
      { variantId: 'a', unitPrice: d(499), variant: { sku: 'A' } },
      { variantId: 'b', unitPrice: d(20), variant: { sku: 'B' } },
    ];
    assert.deepEqual(priceChanges(lines, [{ id: 'a', salePrice: d(520) }, { id: 'b', salePrice: d(20) }]), [{ variantId: 'a', sku: 'A', soldFor: '499', priceNow: '520' }]);
  });
});
