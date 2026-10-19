import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { callbackSignature, matchResult, upiLink, validSignature } from './upi';

const cb = { txnRef: 'GNABC', utr: '123456789012', amount: 499, status: 'SUCCESS' as const };
const pending = { status: 'PENDING_PAYMENT' as const, total: new Prisma.Decimal(499) };

describe('upi', () => {
  it('builds an intent link with the payee name encoded', () => {
    assert.equal(
      upiLink({ vpa: 'shop@okicici', payee: 'Ram & Sons', amount: '499.00', txnRef: 'GNABC', note: 'POS/26-27/000001' }),
      'upi://pay?pa=shop@okicici&pn=Ram%20%26%20Sons&am=499.00&cu=INR&tr=GNABC&tn=POS%2F26-27%2F000001',
    );
  });

  it('accepts only an untouched, correctly signed callback', () => {
    const sig = callbackSignature('s', cb);
    assert.ok(validSignature('s', cb, sig));
    assert.ok(!validSignature('other', cb, sig));
    assert.ok(!validSignature('s', { ...cb, amount: 1 }, sig));
    assert.ok(!validSignature('s', cb, undefined));
  });

  it('marks paid only on a full success for a pending order', () => {
    assert.equal(matchResult(pending, cb), 'MATCHED');
    assert.equal(matchResult(pending, { ...cb, amount: 400 }), 'AMOUNT_MISMATCH');
    assert.equal(matchResult(pending, { ...cb, status: 'FAILED' }), 'FAILED');
    assert.equal(matchResult({ ...pending, status: 'CANCELLED' }, cb), 'ORDER_NOT_PENDING');
    assert.equal(matchResult(null, cb), 'UNKNOWN_REF');
  });
});
