import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { AccountTransaction } from '@/types/accounting';

interface AccountStatementProps {
  ledgerName: string;
  openingBalance: number;
  transactions: AccountTransaction[];
  closingBalance: number;
}

export const AccountStatement: React.FC<AccountStatementProps> = ({
  ledgerName,
  openingBalance,
  transactions,
  closingBalance,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statement</CardTitle>
        <CardDescription>{ledgerName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Opening Balance */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm text-muted-foreground">Opening Balance</div>
              <div className="text-2xl font-bold">
                {formatCurrency(Math.abs(openingBalance))}
                {openingBalance < 0 && <span className="text-sm text-muted-foreground"> (Cr)</span>}
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm text-muted-foreground">Total Debit</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions.reduce((sum, t) => sum + (t.debit || 0), 0)
                )}
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm text-muted-foreground">Total Credit</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  transactions.reduce((sum, t) => sum + (t.credit || 0), 0)
                )}
              </div>
            </div>
          </div>

          {/* Closing Balance */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm text-muted-foreground">Closing Balance</div>
              <div className="text-3xl font-bold">
                {formatCurrency(Math.abs(closingBalance))}
                {closingBalance < 0 && <span className="text-sm text-muted-foreground"> (Cr)</span>}
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm text-muted-foreground">Account Status</div>
              <div className="text-2xl font-bold">
                {closingBalance >= 0 ? (
                  <span className="text-green-600">Debtor</span>
                ) : (
                  <span className="text-red-600">Creditor</span>
                )}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Voucher Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Voucher No</th>
                    <th className="px-4 py-3 text-left font-semibold">Narration</th>
                    <th className="px-4 py-3 text-right font-semibold">Debit</th>
                    <th className="px-4 py-3 text-right font-semibold">Credit</th>
                    <th className="px-4 py-3 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((transaction, index) => (
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
                      <td className="px-4 py-2.5 text-sm max-w-xs truncate">
                        {transaction.narration}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {transaction.debit ? formatCurrency(transaction.debit) : '-'}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {transaction.credit ? formatCurrency(transaction.credit) : '-'}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                        {formatCurrency(transaction.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};