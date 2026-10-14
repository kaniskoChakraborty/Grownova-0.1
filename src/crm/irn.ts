import { createHash } from 'crypto';

const IST_OFFSET_MS = 330 * 60_000;

/** Indian financial year (April to March, IST) for a date, e.g. 2026-10-14 -> "2026-27". */
export function financialYear(date: Date): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const start = ist.getUTCMonth() >= 3 ? ist.getUTCFullYear() : ist.getUTCFullYear() - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/**
 * IRN the way the GST portal builds it: SHA-256 of seller GSTIN + financial year + document type + number.
 * ponytail: mock IRP. AckNo is derived from the hash instead of issued by the portal, and nothing is signed.
 * Swap for a call to the NIC IRP through a GSP once credentials exist.
 */
export function mockIrn(gstin: string, invoiceNumber: string, invoiceDate: Date) {
  const irn = createHash('sha256').update(`${gstin}${financialYear(invoiceDate)}INV${invoiceNumber}`).digest('hex');
  const ackNo = (BigInt(`0x${irn.slice(0, 16)}`) % 10n ** 15n).toString().padStart(15, '0');
  return { irn, ackNo };
}
