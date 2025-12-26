import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import { Voucher } from '@/types/accounting';

interface BankBookProps {
  vouchers: Voucher[];
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
}

export const BankBook: React.FC<BankBookProps> = ({ vouchers, startDate, endDate, onDateRangeChange }) => {
  // Filter bank-related vouchers (Bank Accounts ledger entries)
  const bankVouchers = vouchers.filter(voucher => 
    voucher.ledgerEntries.some(entry => 
      entry.ledgerName.toLowerCase().includes('bank') || 
      entry.ledgerName.toLowerCase().includes('bank account')
    ) &&
    voucher.date >= startDate && 
    voucher.date <= endDate
  );

  // Calculate bank transactions
  const bankTransactions = bankVouchers.flatMap(voucher => 
    voucher.ledgerEntries
      .filter(entry => 
        entry.ledgerName.toLowerCase().includes('bank') || 
        entry.ledgerName.toLowerCase().includes('bank account')
      )
      .map(entry => ({
        date: voucher.date,
        voucherType: voucher.voucherType,
        voucherNumber: voucher.voucherNumber,
        partyName: voucher.partyName,
        narration: voucher.narration,
        debit: entry.type === 'Debit' ? entry.amount : 0,
        credit: entry.type === 'Credit' ? entry.amount : 0,
        balance: 0, // Will be calculated
      }))
  );

  // Calculate running balance
  let runningBalance = 0;
  const transactionsWithBalance = bankTransactions
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(transaction => {
      runningBalance += transaction.debit - transaction.credit;
      return {
        ...transaction,
        balance: runningBalance,
      };
    });

  const totalDebit = transactionsWithBalance.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactionsWithBalance.reduce((sum, t) => sum + t.credit, 0);
  const closingBalance = totalDebit - totalCredit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Bank Book
        </CardTitle>
        <CardDescription>Bank transactions from {formatDate(startDate)} to {formatDate(endDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Bank Inflow</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDebit)}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">Total Bank Outflow</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCredit)}</div>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Net Bank Flow</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(Math.abs(closingBalance))}
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                <Banknote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              {closingBalance >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Transaction Count</div>
                <div className="text-2xl font-bold">{transactionsWithBalance.length}</div>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
                <Banknote className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Book Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Voucher Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Voucher No</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-left font-semibold">Narration</th>
                  <th className="px-4 py-3 text-right font-semibold">Bank In</th>
                  <th className="px-4 py-3 text-right font-semibold">Bank Out</th>
                  <th className="px-4 py-3 text-right font-semibold">Balance</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactionsWithBalance.map((transaction, index) => (
                  <tr key={index} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {transaction.voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {transaction.voucherNumber}
                    </td>
                    <td className="px-4 py-2.5">{transaction.partyName || '-'}</td>
                    <td className="px-4 py-2.5 text-sm max-w-xs truncate">
                      {transaction.narration}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                      {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-red-600">
                      {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                      <span className={transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(Math.abs(transaction.balance))}
                        {transaction.balance < 0 && <span className="text-xs text-muted-foreground"> (Dr)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                          title="View Details"
                        >
                          <Banknote className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                          title="Download Statement"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={5} className="px-4 py-3 text-right font-semibold">Totals:</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-green-600">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-red-600">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">
                    <span className={closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(Math.abs(closingBalance))}
                      {closingBalance < 0 && <span className="text-xs text-muted-foreground"> (Dr)</span>}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bank Flow Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bank Flow Summary</CardTitle>
            <CardDescription>Analysis of bank movements during the period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
                <div className="text-sm text-green-600 dark:text-green-400">Average Daily Inflow</div>
                <div className="text-2xl font-bold text-green-600">
                  {transactionsWithBalance.length > 0 
                    ? formatCurrency(totalDebit / transactionsWithBalance.length)
                    : formatCurrency(0)
                  }
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-600 dark:text-red-400">Average Daily Outflow</div>
                <div className="text-2xl font-bold text-red-600">
                  {transactionsWithBalance.length > 0 
                    ? formatCurrency(totalCredit / transactionsWithBalance.length)
                    : formatCurrency(0)
                  }
                </div>
              </div>
              
              <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
                <div className="text-sm text-blue-600 dark:text-blue-400">Bank Turnover Ratio</div>
                <div className="text-2xl font-bold">
                  {totalDebit > 0 ? (totalCredit / totalDebit).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
              <div className="text-sm text-green-700 dark:text-green-300">
                Bank Book is {closingBalance >= 0 ? 'in surplus' : 'in deficit'} by {formatCurrency(Math.abs(closingBalance))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};