import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { parseLlmEnrichment, ruleBasedEnrichment } from './growai.rules';

describe('ruleBasedEnrichment', () => {
  it('detects a price enquiry with a quantity', () => {
    const r = ruleBasedEnrichment('Hi, my name is Ramesh Kumar. Need rate for 50 boxes.', 'Ramesh Kumar');
    assert.equal(r.intent, 'PRICE_ENQUIRY');
    assert.deepEqual(r.tags, ['price-enquiry', 'has-quantity']);
    assert.match(r.summary, /^Ramesh Kumar \(price enquiry\)/);
  });

  it('puts a Hinglish complaint ahead of the word "order"', () => {
    const r = ruleBasedEnrichment('Mera order abhi tak nahi aaya, maal kharab hai');
    assert.equal(r.intent, 'SUPPORT');
    assert.deepEqual(r.tags, ['support', 'hinglish']);
    assert.match(r.summary, /^Unknown contact/);
  });

  it('falls back to GENERAL', () => {
    assert.equal(ruleBasedEnrichment('Hello').intent, 'GENERAL');
  });
});

describe('parseLlmEnrichment', () => {
  it('accepts fenced JSON in the expected shape', () => {
    assert.deepEqual(
      parseLlmEnrichment('```json\n{"summary":"Wants rates","intent":"PRICE_ENQUIRY","tags":["bulk"]}\n```'),
      { summary: 'Wants rates', intent: 'PRICE_ENQUIRY', tags: ['bulk'] },
    );
  });

  it('rejects unknown intents and non-JSON', () => {
    assert.equal(parseLlmEnrichment('{"summary":"x","intent":"HACKED"}'), null);
    assert.equal(parseLlmEnrichment('not json'), null);
  });
});
