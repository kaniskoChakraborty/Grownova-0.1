import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ForbiddenException, HttpException, UnauthorizedException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function run(exception: unknown) {
  let sent: any;
  const res = { status: () => ({ json: (b: unknown) => (sent = b) }) };
  const host = { switchToHttp: () => ({ getResponse: () => res, getRequest: () => ({ url: '/x' }) }) };
  new HttpExceptionFilter().catch(exception, host as any);
  return sent.error;
}

test('labels match the status code', () => {
  assert.deepEqual(run(new UnauthorizedException()), { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
  assert.equal(run(new ForbiddenException()).error, 'Forbidden');
  assert.equal(run(new HttpException('Too many', 429)).error, 'Too Many Requests');
  assert.equal(run(new Error('boom')).error, 'Internal Server Error');
});
