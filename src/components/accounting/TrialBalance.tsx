import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { TrialBalance } from '@/types/accounting';

interface TrialBalanceProps {
  trialBalance: TrialBalance[];
}

export const TrialBalanceComponent: React.FC<TrialBalanceProps> = ({ trialBalance }) => {
  const totalDebit = trialBalance.reduce((sum, item) => sum + item.debitTotal, 0);
  const totalCredit = trialBalance.reduce((sum, item) => sum + item.creditTotal, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trial Balance</CardTitle>
        <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Ledger</th>
                  <th className="px-4 py-3 text-left font-semibold">Group</th>
                  <th className="px-4 py-3 text-right font-semibold">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold">Credit</th>
                  <th className="px-4 py-3 text-right font-semibold">Balance</th>
                  <th className="px-4 py-3 text-center font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trialBalance.map((item) => (
                  <tr key={item.ledgerId} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium">{item.ledgerName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.group}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatCurrency(item.debitTotal)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatCurrency(item.creditTotal)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                      {formatCurrency(item.balance)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.type === 'Debit' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : item.type === 'Credit'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={2} className="px-4 py-3 text-right font-semibold">Totals:</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};