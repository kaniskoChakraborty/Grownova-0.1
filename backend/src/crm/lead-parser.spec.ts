import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { normalizePhone, parseLeadMessage } from './lead-parser';

describe('parseLeadMessage', () => {
  it('reads name, phone and email from an English message', () => {
    assert.deepEqual(
      parseLeadMessage('Hi, my name is ramesh kumar. Call me on 98765 43210 or ramesh@traders.in.'),
      { name: 'Ramesh Kumar', phone: '+919876543210', email: 'ramesh@traders.in' },
    );
  });

  it('reads a Hinglish name and prefers the WhatsApp sender number', () => {
    assert.deepEqual(
      parseLeadMessage('Mera naam Priya hai, rate kitna hai? 9811111111', '919812345678'),
      { name: 'Priya', phone: '+919812345678', email: undefined },
    );
  });

  it('does not treat "this is urgent" as a name', () => {
    assert.equal(parseLeadMessage('this is urgent, need 50 boxes').name, undefined);
  });

  it('normalises phone numbers', () => {
    assert.equal(normalizePhone('+91 98765-43210'), '+919876543210');
    assert.equal(normalizePhone('09876543210'), '+919876543210');
    assert.equal(normalizePhone('12345'), undefined);
  });
});
