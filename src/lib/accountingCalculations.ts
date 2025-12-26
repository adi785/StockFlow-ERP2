import { 
  Ledger, 
  Voucher, 
  LedgerEntry, 
  AccountStatement, 
  AccountTransaction, 
  TrialBalance, 
  BalanceSheet, 
  ProfitLossStatement, 
  LedgerSummary, 
  DayBook, 
  GSTReport, 
  GSTSummary,
  LedgerGroup,
  VoucherType
} from '@/types/accounting';
import { Product, Purchase, Sale } from '@/types/erp';

// Ledger group classifications
export const LEDGER_GROUPS: Record<LedgerGroup, string> = {
  'Capital Account': 'Capital and Reserves',
  'Current Assets': 'Current Assets',
  'Current Liabilities': 'Current Liabilities',
  'Direct Expenses': 'Expenses',
  'Direct Incomes': 'Incomes',
  'Fixed Assets': 'Fixed Assets',
  'Indirect Expenses': 'Expenses',
  'Indirect Incomes': 'Incomes',
  'Investments': 'Investments',
  'Loans (Liability)': 'Liabilities',
  'Bank Accounts': 'Bank Accounts',
  'Cash-in-Hand': 'Cash Accounts',
  'Sundry Debtors': 'Debtors',
  'Sundry Creditors': 'Creditors',
  'Duties & Taxes': 'Taxes',
  'Provisions': 'Provisions',
};

// Create default ledgers for a new business
export const createDefaultLedgers = (businessName: string): Omit<Ledger, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    // Capital Account
    { name: `${businessName} Capital A/c`, group: 'Capital Account', openingBalance: 0, currentBalance: 0 },
    
    // Current Assets
    { name: 'Cash-in-Hand', group: 'Cash-in-Hand', openingBalance: 0, currentBalance: 0 },
    { name: 'Bank Account', group: 'Bank Accounts', openingBalance: 0, currentBalance: 0 },
    { name: 'Stock-in-Hand', group: 'Current Assets', openingBalance: 0, currentBalance: 0 },
    
    // Sundry Debtors (Customers will be created dynamically)
    { name: 'Sundry Debtors', group: 'Sundry Debtors', openingBalance: 0, currentBalance: 0 },
    
    // Sundry Creditors (Suppliers will be created dynamically)
    { name: 'Sundry Creditors', group: 'Sundry Creditors', openingBalance: 0, currentBalance: 0 },
    
    // Duties & Taxes
    { name: 'GST Payable', group: 'Duties & Taxes', openingBalance: 0, currentBalance: 0 },
    { name: 'GST Input Credit', group: 'Duties & Taxes', openingBalance: 0, currentBalance: 0 },
    { name: 'CGST Payable', group: 'Duties & Taxes', openingBalance: 0, currentBalance: 0 },
    { name: 'SGST Payable', group: 'Duties & Taxes', openingBalance: 0, currentBalance: 0 },
    { name: 'IGST Payable', group: 'Duties & Taxes', openingBalance: 0, currentBalance: 0 },
    
    // Direct Incomes
    { name: 'Sales A/c', group: 'Direct Incomes', openingBalance: 0, currentBalance: 0 },
    { name: 'Sales Discount Allowed', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    
    // Direct Expenses
    { name: 'Purchases A/c', group: 'Direct Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Purchase Discount Received', group: 'Indirect Incomes', openingBalance: 0, currentBalance: 0 },
    
    // Indirect Incomes
    { name: 'Interest Received', group: 'Indirect Incomes', openingBalance: 0, currentBalance: 0 },
    { name: 'Commission Received', group: 'Indirect Incomes', openingBalance: 0, currentBalance: 0 },
    
    // Indirect Expenses
    { name: 'Rent Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Salary Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Electricity Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Telephone Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Advertising Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Travelling Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Office Expense', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
    { name: 'Bank Charges', group: 'Indirect Expenses', openingBalance: 0, currentBalance: 0 },
  ];
};

// Generate voucher number
export const generateVoucherNumber = (voucherType: VoucherType, vouchers: Voucher[]): string => {
  const typePrefix = {
    'Payment': 'PYT',
    'Receipt': 'RCT',
    'Contra': 'CON',
    'Journal': 'JNL',
    'Sales': 'SLS',
    'Purchase': 'PUR',
    'Debit Note': 'DBN',
    'Credit Note': 'CRN',
  };

  const prefix = typePrefix[voucherType];
  const count = vouchers.filter(v => v.voucherType === voucherType).length + 1;
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  
  return `${prefix}-${year}${month}-${count.toString().padStart(4, '0')}`;
};

// Create ledger entries for sales voucher
export const createSalesVoucherEntries = (
  customerName: string,
  productName: string,
  quantity: number,
  rate: number,
  gstPercent: number,
  salesAccountName: string = 'Sales A/c'
): LedgerEntry[] => {
  const totalValue = quantity * rate;
  const gstAmount = (totalValue * gstPercent) / 100;
  const grandTotal = totalValue + gstAmount;

  const entries: LedgerEntry[] = [];

  // Debit Customer (Sundry Debtor)
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: customerName,
    ledgerName: customerName,
    amount: grandTotal,
    type: 'Debit',
    description: `Sale of ${quantity} units of ${productName}`
  });

  // Credit Sales Account
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: salesAccountName,
    ledgerName: salesAccountName,
    amount: totalValue,
    type: 'Credit',
    description: `Sales of ${quantity} units of ${productName}`
  });

  // Credit GST Payable (Output Tax)
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: 'GST Payable',
    ledgerName: 'GST Payable',
    amount: gstAmount,
    type: 'Credit',
    description: `GST @${gstPercent}% on sales`
  });

  return entries;
};

// Create ledger entries for purchase voucher
export const createPurchaseVoucherEntries = (
  supplierName: string,
  productName: string,
  quantity: number,
  rate: number,
  gstPercent: number,
  purchasesAccountName: string = 'Purchases A/c'
): LedgerEntry[] => {
  const totalValue = quantity * rate;
  const gstAmount = (totalValue * gstPercent) / 100;
  const grandTotal = totalValue + gstAmount;

  const entries: LedgerEntry[] = [];

  // Debit Purchases Account
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: purchasesAccountName,
    ledgerName: purchasesAccountName,
    amount: totalValue,
    type: 'Debit',
    description: `Purchase of ${quantity} units of ${productName}`
  });

  // Debit GST Input Credit
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: 'GST Input Credit',
    ledgerName: 'GST Input Credit',
    amount: gstAmount,
    type: 'Debit',
    description: `GST @${gstPercent}% on purchase`
  });

  // Credit Supplier (Sundry Creditor)
  entries.push({
    id: crypto.randomUUID(),
    ledgerId: supplierName,
    ledgerName: supplierName,
    amount: grandTotal,
    type: 'Credit',
    description: `Purchase from ${supplierName}`
  });

  return entries;
};

// Calculate account statement
export const calculateAccountStatement = (
  ledgerId: string,
  vouchers: Voucher[],
  startDate: Date,
  endDate: Date
): AccountStatement => {
  const transactions: AccountTransaction[] = [];
  let balance = 0;

  // Get all relevant vouchers
  const relevantVouchers = vouchers
    .filter(v => v.date >= startDate && v.date <= endDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  relevantVouchers.forEach(voucher => {
    voucher.ledgerEntries.forEach(entry => {
      if (entry.ledgerId === ledgerId) {
        const transaction: AccountTransaction = {
          date: voucher.date,
          voucherType: voucher.voucherType,
          voucherNumber: voucher.voucherNumber,
          referenceNumber: voucher.referenceNumber,
          narration: voucher.narration,
          debit: entry.type === 'Debit' ? entry.amount : undefined,
          credit: entry.type === 'Credit' ? entry.amount : undefined,
          balance: 0 // Will be calculated
        };

        // Update running balance
        if (entry.type === 'Debit') {
          balance += entry.amount;
        } else {
          balance -= entry.amount;
        }

        transaction.balance = balance;
        transactions.push(transaction);
      }
    });
  });

  return {
    ledgerId,
    ledgerName: ledgerId, // This would come from ledger lookup
    openingBalance: 0, // Would be calculated based on pre-start date transactions
    transactions,
    closingBalance: balance
  };
};

// Calculate trial balance
export const calculateTrialBalance = (ledgers: Ledger[], vouchers: Voucher[]): TrialBalance[] => {
  const trialBalance: TrialBalance[] = [];

  ledgers.forEach(ledger => {
    let debitTotal = 0;
    let creditTotal = 0;

    // Calculate from ledger opening balance
    if (ledger.openingBalance >= 0) {
      debitTotal += ledger.openingBalance;
    } else {
      creditTotal += Math.abs(ledger.openingBalance);
    }

    // Calculate from voucher entries
    vouchers.forEach(voucher => {
      voucher.ledgerEntries.forEach(entry => {
        if (entry.ledgerId === ledger.id) {
          if (entry.type === 'Debit') {
            debitTotal += entry.amount;
          } else {
            creditTotal += entry.amount;
          }
        }
      });
    });

    const balance = debitTotal - creditTotal;
    const type = balance > 0 ? 'Debit' : balance < 0 ? 'Credit' : 'Zero';

    trialBalance.push({
      ledgerId: ledger.id,
      ledgerName: ledger.name,
      group: ledger.group,
      debitTotal,
      creditTotal,
      balance: Math.abs(balance),
      type
    });
  });

  return trialBalance;
};

// Calculate profit and loss statement
export const calculateProfitLossStatement = (
  ledgers: Ledger[],
  vouchers: Voucher[],
  startDate: Date,
  endDate: Date
): ProfitLossStatement => {
  const directIncomes: LedgerSummary[] = [];
  const directExpenses: LedgerSummary[] = [];
  const indirectIncomes: LedgerSummary[] = [];
  const indirectExpenses: LedgerSummary[] = [];

  const processLedger = (ledger: Ledger) => {
    let totalDebit = 0;
    let totalCredit = 0;

    // From opening balance
    if (ledger.openingBalance >= 0) {
      totalDebit += ledger.openingBalance;
    } else {
      totalCredit += Math.abs(ledger.openingBalance);
    }

    // From vouchers
    vouchers.forEach(voucher => {
      if (voucher.date >= startDate && voucher.date <= endDate) {
        voucher.ledgerEntries.forEach(entry => {
          if (entry.ledgerId === ledger.id) {
            if (entry.type === 'Debit') {
              totalDebit += entry.amount;
            } else {
              totalCredit += entry.amount;
            }
          }
        });
      }
    });

    const balance = totalCredit - totalDebit;

    const summary: LedgerSummary = {
      ledgerId: ledger.id,
      ledgerName: ledger.name,
      totalDebit,
      totalCredit,
      balance: Math.abs(balance)
    };

    switch (ledger.group) {
      case 'Direct Incomes':
        if (balance !== 0) directIncomes.push(summary);
        break;
      case 'Direct Expenses':
        if (balance !== 0) directExpenses.push(summary);
        break;
      case 'Indirect Incomes':
        if (balance !== 0) indirectIncomes.push(summary);
        break;
      case 'Indirect Expenses':
        if (balance !== 0) indirectExpenses.push(summary);
        break;
    }
  };

  ledgers.forEach(processLedger);

  const totalRevenue = directIncomes.reduce((sum, l) => sum + l.balance, 0);
  const totalExpenses = directExpenses.reduce((sum, l) => sum + l.balance, 0);
  const grossProfit = totalRevenue - totalExpenses;

  const indirectRevenue = indirectIncomes.reduce((sum, l) => sum + l.balance, 0);
  const indirectExpenseTotal = indirectExpenses.reduce((sum, l) => sum + l.balance, 0);
  const netProfit = grossProfit + indirectRevenue - indirectExpenseTotal;

  return {
    directIncomes,
    directExpenses,
    indirectIncomes,
    indirectExpenses,
    grossProfit,
    netProfit,
    totalRevenue,
    totalExpenses
  };
};

// Calculate balance sheet
export const calculateBalanceSheet = (
  ledgers: Ledger[],
  vouchers: Voucher[],
  startDate: Date,
  endDate: Date
): BalanceSheet => {
  let currentAssets = 0;
  let fixedAssets = 0;
  let investments = 0;
  let currentLiabilities = 0;
  let loans = 0;
  let capital = 0;

  const processLedger = (ledger: Ledger) => {
    let balance = 0;

    // From opening balance
    if (ledger.openingBalance >= 0) {
      balance += ledger.openingBalance;
    } else {
      balance -= Math.abs(ledger.openingBalance);
    }

    // From vouchers
    vouchers.forEach(voucher => {
      if (voucher.date >= startDate && voucher.date <= endDate) {
        voucher.ledgerEntries.forEach(entry => {
          if (entry.ledgerId === ledger.id) {
            if (entry.type === 'Debit') {
              balance += entry.amount;
            } else {
              balance -= entry.amount;
            }
          }
        });
      }
    });

    // Categorize based on ledger group
    switch (ledger.group) {
      case 'Current Assets':
        currentAssets += balance;
        break;
      case 'Fixed Assets':
        fixedAssets += balance;
        break;
      case 'Investments':
        investments += balance;
        break;
      case 'Current Liabilities':
        currentLiabilities += Math.abs(balance);
        break;
      case 'Loans (Liability)':
        loans += Math.abs(balance);
        break;
      case 'Capital Account':
        capital += balance;
        break;
      case 'Sundry Debtors':
        currentAssets += balance;
        break;
      case 'Sundry Creditors':
        currentLiabilities += Math.abs(balance);
        break;
    }
  };

  ledgers.forEach(processLedger);

  const totalAssets = currentAssets + fixedAssets + investments;
  const totalLiabilities = currentLiabilities + loans + capital;

  return {
    assets: { current: currentAssets, fixed: fixedAssets, investments },
    liabilities: { current: currentLiabilities, loans, capital },
    netProfit: 0, // Would be calculated from P&L
    totalAssets,
    totalLiabilities
  };
};

// Calculate day book
export const calculateDayBook = (vouchers: Voucher[], date: Date): DayBook => {
  const dayVouchers = vouchers.filter(v => 
    v.date.toDateString() === date.toDateString()
  );

  const transactions = dayVouchers.map(v => ({
    voucherType: v.voucherType,
    voucherNumber: v.voucherNumber,
    partyName: v.partyName,
    narration: v.narration,
    debitTotal: v.totalDebit,
    creditTotal: v.totalCredit
  }));

  const totalDebit = dayVouchers.reduce((sum, v) => sum + v.totalDebit, 0);
  const totalCredit = dayVouchers.reduce((sum, v) => sum + v.totalCredit, 0);

  return {
    date,
    transactions,
    totalDebit,
    totalCredit
  };
};

// Calculate GST report
export const calculateGSTReport = (
  sales: Sale[],
  purchases: Purchase[],
  startDate: Date,
  endDate: Date
): GSTReport => {
  const outwardTaxable: { interState: GSTSummary[]; intraState: GSTSummary[] } = {
    interState: [],
    intraState: []
  };

  const inwardTaxable: { interState: GSTSummary[]; intraState: GSTSummary[] } = {
    interState: [],
    intraState: []
  };

  // Process sales (outward supplies)
  const filteredSales = sales.filter(s => s.date >= startDate && s.date <= endDate);
  
  filteredSales.forEach(sale => {
    const gstRate = sale.sellingRate > 0 ? (sale.gstAmount / (sale.totalValue || 1)) * 100 : 0;
    
    // For simplicity, assuming all sales are intra-state
    // In real implementation, you'd check customer state vs business state
    const existing = outwardTaxable.intraState.find(g => g.gstRate === gstRate);
    
    if (existing) {
      existing.taxableValue += sale.totalValue;
      existing.cgstAmount += sale.gstAmount / 2;
      existing.sgstAmount += sale.gstAmount / 2;
      existing.totalAmount += sale.grandTotal;
    } else {
      outwardTaxable.intraState.push({
        gstRate,
        taxableValue: sale.totalValue,
        igstAmount: 0,
        cgstAmount: sale.gstAmount / 2,
        sgstAmount: sale.gstAmount / 2,
        totalAmount: sale.grandTotal
      });
    }
  });

  // Process purchases (inward supplies)
  const filteredPurchases = purchases.filter(p => p.date >= startDate && p.date <= endDate);
  
  filteredPurchases.forEach(purchase => {
    const gstRate = purchase.purchaseRate > 0 ? (purchase.gstAmount / (purchase.totalValue || 1)) * 100 : 0;
    
    // For simplicity, assuming all purchases are intra-state
    const existing = inwardTaxable.intraState.find(g => g.gstRate === gstRate);
    
    if (existing) {
      existing.taxableValue += purchase.totalValue;
      existing.igstAmount += 0;
      existing.cgstAmount += purchase.gstAmount / 2;
      existing.sgstAmount += purchase.gstAmount / 2;
      existing.totalAmount += purchase.grandTotal;
    } else {
      inwardTaxable.intraState.push({
        gstRate,
        taxableValue: purchase.totalValue,
        igstAmount: 0,
        cgstAmount: purchase.gstAmount / 2,
        sgstAmount: purchase.gstAmount / 2,
        totalAmount: purchase.grandTotal
      });
    }
  });

  const totalTaxPayable = outwardTaxable.intraState.reduce((sum, g) => sum + g.cgstAmount + g.sgstAmount, 0);
  const totalTaxPaid = inwardTaxable.intraState.reduce((sum, g) => sum + g.cgstAmount + g.sgstAmount, 0);
  const netTaxLiability = totalTaxPayable - totalTaxPaid;

  return {
    outwardTaxable,
    inwardTaxable,
    totalTaxPayable,
    totalTaxPaid,
    netTaxLiability
  };
};