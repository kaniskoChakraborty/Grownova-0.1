import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { ewbValidUntil, mockEwbNo, vehicleNo } from './ewaybill';

describe('e-way bill', () => {
  it('gives 1 day per 200 km, ending at midnight IST after the generation date', () => {
    const at = new Date('2026-10-19T04:30:00Z'); // 10:00 IST
    assert.equal(ewbValidUntil(at, 150).toISOString(), '2026-10-20T18:29:59.000Z'); // 20 Oct 23:59:59 IST
    assert.equal(ewbValidUntil(at, 200).toISOString(), '2026-10-20T18:29:59.000Z');
    assert.equal(ewbValidUntil(at, 201).toISOString(), '2026-10-21T18:29:59.000Z');
    assert.equal(ewbValidUntil(new Date('2026-10-19T19:00:00Z'), 10).toISOString(), '2026-10-21T18:29:59.000Z'); // 00:30 IST on the 20th
  });

  it('normalises vehicle numbers and refuses junk', () => {
    assert.equal(vehicleNo('dl 01 ab-1234'), 'DL01AB1234');
    assert.equal(vehicleNo('MH12A1234'), 'MH12A1234');
    assert.equal(vehicleNo('1234'), null);
  });

  it('makes a stable 12-digit number per document', () => {
    const n = mockEwbNo('07ABCDE1234F1Z5', 'POS/26-27/000002');
    assert.match(n, /^[1-9]\d{11}$/);
    assert.equal(n, mockEwbNo('07ABCDE1234F1Z5', 'POS/26-27/000002'));
    assert.notEqual(n, mockEwbNo('07ABCDE1234F1Z5', 'POS/26-27/000003'));
  });
});
