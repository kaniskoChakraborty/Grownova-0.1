const WIDTH = 42; // characters per line: Courier 8pt on 80 mm thermal paper

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "19 Oct 2026, 8:12 pm" in India time. Built by hand because Intl date styles differ between Node/ICU versions.
export function istDateTime(date: Date) {
  const t = new Date(date.getTime() + 330 * 60_000);
  const h = t.getUTCHours();
  const mm = String(t.getUTCMinutes()).padStart(2, '0');
  return `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}, ${h % 12 || 12}:${mm} ${h < 12 ? 'am' : 'pm'}`;
}

type ReceiptOrder = {
  number: string; createdAt: Date; status: string; paymentMethod: string; total: { toFixed(dp: number): string };
  customerName: string | null; location: { name: string };
  lines: { quantity: { toString(): string }; unitPrice: { toFixed(dp: number): string }; lineTotal: { toFixed(dp: number): string }; variant: { sku: string; name: string | null; product: { name: string } } }[];
  upiPayments?: { utr: string; result: string }[];
};
type ReceiptBusiness = { name: string; gstin: string | null; address: string | null; city: string | null; phone: string | null };

const pair = (left: string, right: string) => `${left.slice(0, WIDTH - right.length - 1).padEnd(WIDTH - right.length)}${right}`;
const center = (text: string) => text.slice(0, WIDTH).padStart(Math.floor((WIDTH + Math.min(text.length, WIDTH)) / 2));

// The receipt as plain monospaced lines. Amounts are GST-inclusive, so there is no tax split yet.
// ponytail: Rs. instead of ₹ because the built-in PDF font has no rupee sign; embed a font when receipts go vernacular.
export function receiptLines(order: ReceiptOrder, business: ReceiptBusiness) {
  const rule = '-'.repeat(WIDTH);
  const out = [center(business.name), ...[...new Set([business.address, business.city])].filter((x): x is string => !!x).map(center)];
  if (business.phone) out.push(center(`Ph ${business.phone}`));
  if (business.gstin) out.push(center(`GSTIN ${business.gstin}`));
  out.push(rule, pair(order.number, order.location.name), istDateTime(order.createdAt));
  if (order.customerName) out.push(`Customer: ${order.customerName}`);
  out.push(rule);
  for (const l of order.lines) {
    out.push(`${l.variant.product.name}${l.variant.name ? ` ${l.variant.name}` : ''}`.slice(0, WIDTH));
    out.push(pair(`  ${l.quantity.toString()} x ${l.unitPrice.toFixed(2)}`, l.lineTotal.toFixed(2)));
  }
  out.push(rule, pair('TOTAL Rs.', order.total.toFixed(2)), pair('Paid by', order.paymentMethod));
  const utr = order.upiPayments?.find((p) => p.result === 'MATCHED')?.utr;
  if (utr) out.push(pair('UPI ref', utr));
  if (order.status !== 'PAID') out.push(center(`*** ${order.status.replace('_', ' ')} ***`));
  out.push(rule, center('Prices include GST'), center('Thank you, visit again!'));
  return out;
}

// A one-page PDF of monospaced text, written by hand: five objects and an xref table, no library.
export function textPdf(lines: string[]) {
  const esc = (s: string) => s.replace(/[^\x20-\x7e]/g, '?').replace(/[\\()]/g, '\\$&');
  const lead = 10;
  const height = 24 + lines.length * lead;
  const stream = `BT /F1 8 Tf ${lead} TL 12 ${height - 18} Td\n${lines.map((l) => `(${esc(l)}) Tj T*`).join('\n')}\nET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 226 ${height}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = objects.map((body, i) => {
    const at = Buffer.byteLength(pdf);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    return at;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}
