import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'crypto';
import { PosOrderStatus, Prisma, UpiCallbackResult } from '../../generated/prisma/client';

export type UpiCallback = { txnRef: string; utr: string; amount: number; status: 'SUCCESS' | 'FAILED' };

// The reference the customer's UPI app sends back to us (tr=). Random, so it can't be guessed from an order number.
export const newTxnRef = () => `GN${randomBytes(8).toString('hex').toUpperCase()}`;

// ponytail: mock bank reference; a real provider sends its own 12-digit UTR.
export const mockUtr = () => String(randomInt(1e11, 1e12));

// The intent link a QR code encodes (NPCI's upi://pay format). Any UPI app can open it.
export function upiLink({ vpa, payee, amount, txnRef, note }: { vpa: string; payee: string; amount: string; txnRef: string; note: string }) {
  const e = encodeURIComponent;
  return `upi://pay?pa=${vpa}&pn=${e(payee)}&am=${amount}&cu=INR&tr=${txnRef}&tn=${e(note)}`;
}

// HMAC-SHA256 over the fields that matter, so a forged or edited callback can't mark an order paid.
export function callbackSignature(secret: string, cb: UpiCallback) {
  return createHmac('sha256', secret).update(`${cb.txnRef}|${cb.utr}|${cb.amount.toFixed(2)}|${cb.status}`).digest('hex');
}

export function validSignature(secret: string, cb: UpiCallback, signature?: string) {
  const want = Buffer.from(callbackSignature(secret, cb));
  const got = Buffer.from(signature ?? '');
  return want.length === got.length && timingSafeEqual(want, got);
}

// What a callback means for its order. Only MATCHED marks the order paid.
export function matchResult(order: { status: PosOrderStatus; total: Prisma.Decimal } | null, cb: Pick<UpiCallback, 'amount' | 'status'>) {
  if (!order) return UpiCallbackResult.UNKNOWN_REF;
  if (cb.status === 'FAILED') return UpiCallbackResult.FAILED;
  if (order.status !== PosOrderStatus.PENDING_PAYMENT) return UpiCallbackResult.ORDER_NOT_PENDING;
  if (!order.total.equals(cb.amount)) return UpiCallbackResult.AMOUNT_MISMATCH;
  return UpiCallbackResult.MATCHED;
}
