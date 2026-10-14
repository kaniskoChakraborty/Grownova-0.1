import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { churnRisk } from './churn';

describe('churnRisk', () => {
  it('flags customers quiet for 90+ days, and 180+ as high', () => {
    assert.equal(churnRisk(0), null);
    assert.equal(churnRisk(89), null);
    assert.equal(churnRisk(90), 'MEDIUM');
    assert.equal(churnRisk(179), 'MEDIUM');
    assert.equal(churnRisk(180), 'HIGH');
  });
});
