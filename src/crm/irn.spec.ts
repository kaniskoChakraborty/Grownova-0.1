import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { financialYear, mockIrn } from './irn';

describe('financialYear', () => {
  it('runs April to March in IST', () => {
    assert.equal(financialYear(new Date('2026-10-14T10:00:00Z')), '2026-27');
    assert.equal(financialYear(new Date('2027-03-31T18:00:00Z')), '2026-27'); // 23:30 IST, still March
    assert.equal(financialYear(new Date('2027-03-31T18:30:00Z')), '2027-28'); // midnight IST, April 1
    assert.equal(financialYear(new Date('2099-06-01T00:00:00Z')), '2099-00');
  });
});

describe('mockIrn', () => {
  it('gives a stable 64-char IRN and 15-digit ack number', () => {
    const a = mockIrn('07ABCDE1234F1Z5', 'INV-0001', new Date('2026-10-14T10:00:00Z'));
    assert.match(a.irn, /^[0-9a-f]{64}$/);
    assert.match(a.ackNo, /^\d{15}$/);
    assert.deepEqual(a, mockIrn('07ABCDE1234F1Z5', 'INV-0001', new Date('2026-12-01T10:00:00Z')));
    assert.notEqual(a.irn, mockIrn('07ABCDE1234F1Z5', 'INV-0002', new Date('2026-10-14T10:00:00Z')).irn);
  });
});
