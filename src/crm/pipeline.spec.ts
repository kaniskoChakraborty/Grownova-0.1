import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { canMove } from './pipeline';

describe('canMove', () => {
  it('allows one step forward and dropping to LOST', () => {
    assert.ok(canMove('NEW', 'CONTACTED'));
    assert.ok(canMove('QUALIFIED', 'WON'));
    assert.ok(canMove('CONTACTED', 'LOST'));
  });

  it('blocks skipping, going back, staying put and leaving WON/LOST', () => {
    assert.ok(!canMove('NEW', 'WON'));
    assert.ok(!canMove('QUALIFIED', 'CONTACTED'));
    assert.ok(!canMove('NEW', 'NEW'));
    assert.ok(!canMove('WON', 'LOST'));
    assert.ok(!canMove('LOST', 'NEW'));
  });
});
