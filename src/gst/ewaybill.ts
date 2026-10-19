import { createHash } from 'crypto';

const IST_OFFSET_MS = 330 * 60_000;
const DAY_MS = 86_400_000;

/** Goods worth more than this need an e-way bill to move (most states). Below it one is optional. */
export const EWB_THRESHOLD = 50_000;

/**
 * Rule 138(10): normal cargo gets 1 day per 200 km or part of it, and a "day" runs to midnight after the
 * generation date. So a 150 km bill made at 10am on the 19th is valid until 23:59:59 IST on the 20th.
 * ponytail: normal cargo only; over-dimensional cargo (20 km/day) and Part-B extensions aren't modelled.
 */
export function ewbValidUntil(generatedAt: Date, distanceKm: number) {
  const days = Math.max(1, Math.ceil(distanceKm / 200));
  const ist = generatedAt.getTime() + IST_OFFSET_MS;
  const istDayStart = ist - (ist % DAY_MS);
  return new Date(istDayStart + (days + 1) * DAY_MS - 1000 - IST_OFFSET_MS);
}

/** Vehicle number the way the portal wants it (DL01AB1234), or null if it isn't one. */
export function vehicleNo(raw: string) {
  const v = raw.replace(/[\s-]/g, '').toUpperCase();
  return /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(v) ? v : null;
}

/**
 * 12-digit e-way bill number. ponytail: mock portal, derived from GSTIN + document number so one document
 * always gets the same number. Swap for the NIC e-way bill API through a GSP once credentials exist.
 */
export function mockEwbNo(gstin: string, docNo: string) {
  const hex = createHash('sha256').update(`EWB${gstin}${docNo}`).digest('hex');
  return (BigInt(`0x${hex.slice(0, 16)}`) % 900_000_000_000n + 100_000_000_000n).toString();
}
