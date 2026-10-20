import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { AccountType, Prisma as P } from '../../generated/prisma/client';
import { linesProblem, reversedLines, trialBalance, withRunningBalance } from './journal';

describe('double entry', () => {
  it('accepts a balanced journal, to the paisa', () => {
    assert.equal(linesProblem([{ accountId: 'cash', debit: 0.1 }, { accountId: 'cash2', debit: 0.2 }, { accountId: 'sales', credit: 0.3 }]), null);
  });

  it('refuses unbalanced, one-sided, empty and same-account journals', () => {
    assert.match(linesProblem([{ accountId: 'cash', debit: 100 }, { accountId: 'sales', credit: 99.99 }])!, /must equal/);
    assert.match(linesProblem([{ accountId: 'cash', debit: 100 }])!, /two lines/);
    assert.match(linesProblem([{ accountId: 'cash', debit: 100, credit: 100 }, { accountId: 'sales', credit: 0 }])!, /Line 1/);
    assert.match(linesProblem([{ accountId: 'cash', debit: 100 }, { accountId: 'cash', credit: 100 }])!, /both debited and credited/);
  });

  it('reverses by swapping sides', () => {
    const d = (n: number) => new P.Decimal(n);
    assert.deepEqual(reversedLines([{ accountId: 'cash', debit: d(5), credit: d(0) }]), [{ accountId: 'cash', debit: d(0), credit: d(5) }]);
  });

  it('runs balances on the normal side of the account', () => {
    const d = (n: number) => new P.Decimal(n);
    const lines = [{ debit: d(100), credit: d(0) }, { debit: d(0), credit: d(30) }];
    assert.deepEqual(withRunningBalance(d(10), lines, AccountType.ASSET).map((l) => l.balance.toNumber()), [110, 80]);
    assert.deepEqual(withRunningBalance(d(10), lines, AccountType.INCOME).map((l) => l.balance.toNumber()), [-90, -60]);
  });

  it('nets each account into one column and checks the totals', () => {
    const d = (n: number) => new P.Decimal(n);
    const tb = trialBalance([
      { code: '1000', debit: d(500), credit: d(200) },
      { code: '4000', debit: d(50), credit: d(350) },
      { code: '5300', debit: d(40), credit: d(40) },
    ]);
    assert.deepEqual(tb.accounts.map((a) => [a.code, a.debit.toNumber(), a.credit.toNumber()]), [['1000', 300, 0], ['4000', 0, 300]]);
    assert.equal(tb.balanced, true);
    assert.equal(trialBalance([{ debit: d(1), credit: d(0) }]).balanced, false);
  });
});
