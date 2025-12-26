// Accounting Type Definitions

export interface Ledger {
  id: string;
  name: string;
  group: LedgerGroup;
  openingBalance: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LedgerGroup = 
  | 'Capital Account'
  | 'Current Assets'
  | 'Current Liabilities'
  | 'Direct Expenses'
  | 'Direct Incomes'
  | 'Fixed Assets'
  | 'Indirect Expenses'
  | 'Indirect Incomes'
  | 'Investments'
  | 'Loans (Liability)'
  | 'Bank Accounts'
  | 'Cash-in-Hand'
  | 'Sundry Debtors'
  | 'Sundry Creditors'
  | 'Duties & Taxes'
  | 'Provisions';

export interface Voucher {
  id: string;
  voucherType: VoucherType;
  voucherNumber: string;
  date: Date;
  referenceNumber?: string;
  narration: string;
  partyName?: string;
  ledgerEntries: LedgerEntry[];
  totalDebit: number;
  totalCredit: number;
  createdAt: Date;
  updatedAt: Date;
}

export type VoucherType = 
  | 'Payment'
  | 'Receipt'
  | 'Contra'
  | 'Journal'
  | 'Sales'
  | 'Purchase'
  | 'Debit Note'
  | 'Credit Note';

export interface LedgerEntry {
  id: string;
  ledgerId: string;
  ledgerName: string;
  amount: number;
  type: 'Debit' | 'Credit';
  description?: string;
}

export interface AccountStatement {
  ledgerId: string;
  ledgerName: string;
  openingBalance: number;
  transactions: AccountTransaction[];
  closingBalance: number;
}

export interface AccountTransaction {
  date: Date;
  voucherType: VoucherType;
  voucherNumber: string;
  referenceNumber?: string;
  narration: string;
  debit?: number;
  credit?: number;
  balance: number;
}

export interface TrialBalance {
  ledgerId: string;
  ledgerName: string;
  group: LedgerGroup;
  debitTotal: number;
  creditTotal: number;
  balance: number;
  type: 'Debit' | 'Credit' | 'Zero';
}

export interface BalanceSheet {
  assets: {
    current: number;
    fixed: number;
    investments: number;
  };
  liabilities: {
    current: number;
    loans: number;
    capital: number;
  };
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface ProfitLossStatement {
  directIncomes: LedgerSummary[];
  directExpenses: LedgerSummary[];
  indirectIncomes: LedgerSummary[];
  indirectExpenses: LedgerSummary[];
  grossProfit: number;
  netProfit: number;
  totalRevenue: number;
  totalExpenses: number;
}

export interface LedgerSummary {
  ledgerId: string;
  ledgerName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface DayBook {
  date: Date;
  transactions: {
    voucherType: VoucherType;
    voucherNumber: string;
    partyName?: string;
    narration: string;
    debitTotal: number;
    creditTotal: number;
  }[];
  totalDebit: number;
  totalCredit: number;
}

export interface CashFlowStatement {
  operatingActivities: {
    cashInflows: number;
    cashOutflows: number;
    netCashFlow: number;
  };
  investingActivities: {
    cashInflows: number;
    cashOutflows: number;
    netCashFlow: number;
  };
  financingActivities: {
    cashInflows: number;
    cashOutflows: number;
    netCashFlow: number;
  };
  netChange: number;
  openingBalance: number;
  closingBalance: number;
}

export interface GSTReport {
  outwardTaxable: {
    interState: GSTSummary[];
    intraState: GSTSummary[];
  };
  inwardTaxable: {
    interState: GSTSummary[];
    intraState: GSTSummary[];
  };
  totalTaxPayable: number;
  totalTaxPaid: number;
  netTaxLiability: number;
}

export interface GSTSummary {
  gstRate: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
}

export interface BankReconciliation {
  bankAccountId: string;
  bankStatementDate: Date;
  bankBalance: number;
  bookBalance: number;
  unreconciledTransactions: UnreconciledTransaction[];
  reconciledBalance: number;
}

export interface UnreconciledTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'Debit' | 'Credit';
  reconciled: boolean;
  reconciledDate?: Date;
}

export interface Budget {
  id: string;
  name: string;
  financialYear: string;
  startDate: Date;
  endDate: Date;
  items: BudgetItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetItem {
  ledgerId: string;
  ledgerName: string;
  group: LedgerGroup;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
}

export interface RatioAnalysis {
  liquidityRatios: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  profitabilityRatios: {
    grossProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
  };
  efficiencyRatios: {
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
  };
  solvencyRatios: {
    debtToEquity: number;
    interestCoverage: number;
    debtToAssets: number;
  };
}

export interface MultiCurrency {
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  lastUpdated: Date;
}

export interface CostCenter {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostCategory {
  id: string;
  name: string;
  costCenterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostTracking {
  id: string;
  date: Date;
  costCenterId: string;
  costCategoryId: string;
  amount: number;
  description: string;
  reference: string;
  createdAt: Date;
}