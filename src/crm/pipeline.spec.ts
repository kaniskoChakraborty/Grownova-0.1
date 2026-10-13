import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { canMove, nextStage, shouldAutoQualify } from './pipeline';

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

describe('nextStage', () => {
  it('walks the happy path and stops at the end', () => {
    assert.equal(nextStage('NEW'), 'CONTACTED');
    assert.equal(nextStage('QUALIFIED'), 'WON');
    assert.equal(nextStage('WON'), undefined);
    assert.equal(nextStage('LOST'), undefined);
  });
});

describe('shouldAutoQualify', () => {
  it('only promotes open early-stage leads at score 70+', () => {
    assert.ok(shouldAutoQualify('NEW', 70));
    assert.ok(shouldAutoQualify('CONTACTED', 95));
    assert.ok(!shouldAutoQualify('NEW', 69));
    assert.ok(!shouldAutoQualify('WON', 95));
    assert.ok(!shouldAutoQualify('LOST', 95));
  });
});
