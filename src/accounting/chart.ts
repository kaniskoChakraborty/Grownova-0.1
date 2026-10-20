import { AccountType, PaymentMethod } from '../../generated/prisma/client';

const { ASSET, LIABILITY, EQUITY, INCOME, EXPENSE } = AccountType;

/**
 * Standard chart of accounts for an Indian small business, seeded for every business on first use.
 * Codes group by type: 1xxx assets, 2xxx liabilities, 3xxx equity, 4xxx income, 5xxx expenses.
 * Automatic postings (POS, invoices, payments) find their accounts by these codes, so seeded codes never change.
 */
export const CHART: { code: string; name: string; type: AccountType }[] = [
  { code: '1000', name: 'Cash in Hand', type: ASSET },
  { code: '1010', name: 'Bank Account', type: ASSET },
  { code: '1020', name: 'UPI Collections', type: ASSET },
  { code: '1100', name: 'Sundry Debtors', type: ASSET },
  { code: '1200', name: 'Stock in Hand', type: ASSET },
  { code: '1300', name: 'GST Input Credit', type: ASSET },
  { code: '1400', name: 'TDS Receivable', type: ASSET },
  { code: '1500', name: 'Fixed Assets', type: ASSET },
  { code: '2000', name: 'Sundry Creditors', type: LIABILITY },
  { code: '2100', name: 'GST Output Payable', type: LIABILITY },
  { code: '2200', name: 'TDS Payable', type: LIABILITY },
  { code: '2300', name: 'Salaries Payable', type: LIABILITY },
  { code: '2400', name: 'Loans', type: LIABILITY },
  { code: '3000', name: "Owner's Capital", type: EQUITY },
  { code: '3100', name: 'Drawings', type: EQUITY },
  { code: '3200', name: 'Retained Earnings', type: EQUITY },
  { code: '3900', name: 'Opening Balance Adjustment', type: EQUITY },
  { code: '4000', name: 'Sales', type: INCOME },
  { code: '4100', name: 'Service Income', type: INCOME },
  { code: '4200', name: 'Other Income', type: INCOME },
  { code: '5000', name: 'Cost of Goods Sold', type: EXPENSE },
  { code: '5100', name: 'Purchases', type: EXPENSE },
  { code: '5200', name: 'Salaries and Wages', type: EXPENSE },
  { code: '5300', name: 'Rent', type: EXPENSE },
  { code: '5400', name: 'Electricity', type: EXPENSE },
  { code: '5500', name: 'Transport and Freight', type: EXPENSE },
  { code: '5600', name: 'Bank Charges', type: EXPENSE },
  { code: '5700', name: 'Discount Allowed', type: EXPENSE },
  { code: '5800', name: 'Stock Shrinkage', type: EXPENSE },
  { code: '5900', name: 'Miscellaneous Expenses', type: EXPENSE },
];

/** Codes the automatic journals post to. */
export const SALES = '4000';
export const DEBTORS = '1100';
/** Where money received by each payment method lands. */
export const MONEY: Record<PaymentMethod, string> = { CASH: '1000', UPI: '1020', BANK: '1010', CARD: '1010' };
