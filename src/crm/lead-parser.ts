// Rules-based extraction from an inbound message (English + Hinglish).
// ponytail: regex rules only; GrowAI enrichment (step 5) fills what these miss.
export interface ParsedLead {
  name?: string;
  phone?: string;
  email?: string;
}

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
const PHONE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/;
const END = String.raw`(?=\s+(?:from|here|and)\b|[,.!?\n]|$)`;
const NAME_PATTERNS = [
  new RegExp(String.raw`\bmy name is\s+([A-Za-z][A-Za-z.' ]{1,40}?)` + END, 'i'),
  /\b[Tt]his is\s+([A-Z][a-zA-Z.']+(?:\s[A-Z][a-zA-Z.']+){0,2})/, // capitalised only, so "this is urgent" is ignored
  /\bmera naam\s+([A-Za-z][A-Za-z.' ]{1,40}?)\s+hai\b/i,
];

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/** Indian mobiles become +91XXXXXXXXXX; other 10-15 digit numbers keep their digits with a +. */
export function normalizePhone(raw?: string): string | undefined {
  const digits = (raw ?? '').replace(/\D/g, '');
  const local =
    digits.length === 11 && digits.startsWith('0') ? digits.slice(1)
    : digits.length === 12 && digits.startsWith('91') ? digits.slice(2)
    : digits;
  if (/^[6-9]\d{9}$/.test(local)) return `+91${local}`;
  return /^\d{10,15}$/.test(digits) ? `+${digits}` : undefined;
}

/** senderPhone is the WhatsApp "from" number and wins over a number typed in the text. */
export function parseLeadMessage(text: string, senderPhone?: string): ParsedLead {
  const name = NAME_PATTERNS.map((r) => r.exec(text)?.[1]).find(Boolean)?.trim();
  return {
    name: name ? titleCase(name) : undefined,
    phone: normalizePhone(senderPhone) ?? normalizePhone(PHONE.exec(text)?.[0]),
    email: EMAIL.exec(text)?.[0].toLowerCase(),
  };
}
