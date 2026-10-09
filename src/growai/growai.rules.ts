// Pure functions (no Nest imports) so they can be tested standalone.
export const LEAD_INTENTS = ['PRICE_ENQUIRY', 'ORDER', 'SUPPORT', 'GENERAL'] as const;
export type LeadIntent = (typeof LEAD_INTENTS)[number];

export type LeadEnrichment = {
  summary: string;
  intent: LeadIntent;
  tags: string[];
  provider: 'llm' | 'rules';
  enrichedAt: string;
};

type Draft = Omit<LeadEnrichment, 'provider' | 'enrichedAt'>;

// First match wins, so SUPPORT beats ORDER for "my order is damaged".
const INTENT_RULES: [LeadIntent, RegExp][] = [
  ['SUPPORT', /\b(complaint|issue|problem|refund|return|damaged|broken|kharab|not working)\b/i],
  ['PRICE_ENQUIRY', /\b(price|prices|rate|rates|cost|quote|quotation|kitna|kitne|daam|bhav)\b/i],
  ['ORDER', /\b(order|buy|purchase|book|need|want|chahiye|bhejo|send)\b/i],
];

export function ruleBasedEnrichment(text: string, name?: string | null): Draft {
  const intent = INTENT_RULES.find(([, re]) => re.test(text))?.[0] ?? 'GENERAL';
  const tags = [intent.toLowerCase().replace('_', '-')];
  if (/\b\d+\s*(pcs|pieces|boxes|box|kg|units|nos|packets|cartons)\b/i.test(text)) tags.push('has-quantity');
  if (/\b(hai|kitna|kitne|chahiye|mera|bhai|ji|bhejo)\b/i.test(text)) tags.push('hinglish');
  const snippet = text.length > 120 ? `${text.slice(0, 117)}...` : text;
  return { summary: `${name || 'Unknown contact'} (${intent.replace('_', ' ').toLowerCase()}): ${snippet}`, intent, tags };
}

/** Parses the LLM reply; returns null unless it is exactly the JSON shape we asked for. */
export function parseLlmEnrichment(reply: string): Draft | null {
  try {
    const obj = JSON.parse(reply.replace(/```(?:json)?/g, '').trim());
    if (typeof obj?.summary !== 'string' || !LEAD_INTENTS.includes(obj.intent)) return null;
    const tags = Array.isArray(obj.tags) ? obj.tags.filter((t: unknown) => typeof t === 'string').slice(0, 5) : [];
    return { summary: obj.summary.slice(0, 300), intent: obj.intent, tags };
  } catch {
    return null;
  }
}
