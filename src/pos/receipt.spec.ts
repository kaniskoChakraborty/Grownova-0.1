import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Prisma } from '../../generated/prisma/client';
import { istDateTime, receiptLines, textPdf } from './receipt';

const d = (n: number) => new Prisma.Decimal(n);
const order = {
  number: 'POS/26-27/000001', createdAt: new Date('2026-10-19T08:30:00Z'), status: 'PAID', paymentMethod: 'UPI', total: d(998),
  customerName: 'Sita', location: { name: 'Main Shop' },
  lines: [{ quantity: d(2), unitPrice: d(499), lineTotal: d(998), variant: { sku: 'R', name: '5 kg', product: { name: 'Basmati Rice' } } }],
  upiPayments: [{ utr: '612345678901', result: 'MATCHED' }],
};
const business = { name: 'Demo Store', gstin: '07ABCDE1234F1Z5', address: null, city: 'Delhi', phone: null };

describe('receipt', () => {
  it('lays out lines, total and UPI ref within 42 columns', () => {
    const lines = receiptLines(order, business);
    assert.ok(lines.every((l) => l.length <= 42));
    assert.ok(lines.includes('Basmati Rice 5 kg'));
    assert.ok(lines.some((l) => l.startsWith('TOTAL Rs.') && l.endsWith('998.00')));
    assert.ok(lines.some((l) => l.endsWith('612345678901')));
    assert.ok(lines.includes('19 Oct 2026, 2:00 pm'), 'India time');
  });

  it('formats India time around midnight and noon', () => {
    assert.equal(istDateTime(new Date('2026-10-19T18:30:00Z')), '20 Oct 2026, 12:00 am');
    assert.equal(istDateTime(new Date('2026-12-31T06:35:00Z')), '31 Dec 2026, 12:05 pm');
  });

  it('writes a PDF whose xref points at every object', () => {
    const pdf = textPdf(['Ram (& Sons)', 'back\\slash', '₹ sign']).toString('latin1');
    assert.ok(pdf.startsWith('%PDF-1.4') && pdf.endsWith('%%EOF\n'));
    assert.ok(pdf.includes('(Ram \\(& Sons\\)) Tj') && pdf.includes('(back\\\\slash) Tj') && pdf.includes('(? sign) Tj'));
    const xref = Number(pdf.match(/startxref\n(\d+)/)![1]);
    assert.ok(pdf.slice(xref).startsWith('xref'));
    const offsets = [...pdf.slice(xref).matchAll(/(\d{10}) 00000 n/g)].map((m) => Number(m[1]));
    offsets.forEach((o, i) => assert.ok(pdf.slice(o).startsWith(`${i + 1} 0 obj`)));
  });
});
