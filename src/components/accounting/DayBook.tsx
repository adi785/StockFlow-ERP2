import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { Voucher } from '@/types/accounting';

interface DayBookProps {
  vouchers: Voucher[];
  date: Date;
}

export const DayBook: React.FC<DayBookProps> = ({ vouchers, date }) => {
  const dayVouchers = vouchers.filter(v => 
    v.date.toDateString() === date.toDateString()
  );

  const totalDebit = dayVouchers.reduce((sum, v) => sum + v.totalDebit, 0);
  const totalCredit = dayVouchers.reduce((sum, v) => sum + v.totalCredit, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Day Book
        </CardTitle>
        <CardDescription>Transactions for {formatDate(date)}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Debit</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDebit)}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">Total Credit</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCredit)}</div>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
                <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Balance</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              {totalDebit > totalCredit ? 'Debit Balance' : totalCredit > totalDebit ? 'Credit Balance' : 'Balanced'}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Time</th>
                  <th className="px-4 py-3 text-left font-semibold">Voucher Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Voucher No</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-left font-semibold">Narration</th>
                  <th className="px-4 py-3 text-right font-semibold">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold">Credit</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dayVouchers.map((voucher) => (
                  <tr key={voucher.id} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {new Date(voucher.date).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {voucher.voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-4 py-2.5">{voucher.partyName || '-'}</td>
                    <td className="px-4 py-2.5 text-sm max-w-xs truncate">
                      {voucher.narration}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                      {formatCurrency(voucher.totalDebit)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-red-600">
                      {formatCurrency(voucher.totalCredit)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                          title="View Details"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                          title="Download"
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
                  <td colSpan={5} className="px-4 py-3 text-right font-semibold">Daily Totals:</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-green-600">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-red-600">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};