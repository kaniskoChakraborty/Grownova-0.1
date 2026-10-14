import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { HSN_CODES, suggestHsn } from './hsn';

describe('suggestHsn', () => {
  it('matches English, Hindi and plurals', () => {
    assert.equal(suggestHsn('Basmati rice 5kg')[0].code, '1006');
    assert.equal(suggestHsn('aashirvaad atta')[0].code, '1101');
    assert.equal(suggestHsn('formal shirts for men')[0].code, '6205');
    assert.equal(suggestHsn('website development')[0].code, '998314');
  });

  it('ranks the item with more matching words first', () => {
    assert.equal(suggestHsn('imitation jewellery')[0].code, '7117');
    assert.equal(suggestHsn('leather shoes')[0].code, '6403');
  });

  it('looks up by code prefix and returns nothing for gibberish', () => {
    assert.deepEqual(suggestHsn('8517').map((s) => s.code), ['8517']);
    assert.ok(suggestHsn('9983').every((s) => s.code.startsWith('9983')));
    assert.deepEqual(suggestHsn('qwxz'), []);
  });

  it('has no duplicate codes', () => {
    assert.equal(new Set(HSN_CODES.map((e) => e.code)).size, HSN_CODES.length);
  });
});
