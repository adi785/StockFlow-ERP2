import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Banknote } from 'lucide-react';
import { format } from 'date-fns';

interface BankReconciliationProps {
  bankAccountId: string;
  bankStatementDate: Date;
  bankBalance: number;
  bookBalance: number;
  unreconciledTransactions: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: 'Debit' | 'Credit';
    reconciled: boolean;
  }>;
  reconciledBalance: number;
  onReconcile: (transactionId: string) => void;
  onDateChange: (date: Date) => void;
}

export const BankReconciliation: React.FC<BankReconciliationProps> = ({
  bankStatementDate,
  bankBalance,
  bookBalance,
  unreconciledTransactions,
  reconciledBalance,
  onReconcile,
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(bankStatementDate);

  React.useEffect(() => {
    setSelectedDate(bankStatementDate);
  }, [bankStatementDate]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateChange(date);
    }
  };

  const unreconciledDebit = unreconciledTransactions
    .filter(t => t.type === 'Debit' && !t.reconciled)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const unreconciledCredit = unreconciledTransactions
    .filter(t => t.type === 'Credit' && !t.reconciled)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Bank Reconciliation
        </CardTitle>
        <CardDescription>Reconcile bank statement with book records</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Date Selection */}
        <div className="space-y-2 mb-6">
          <Label>Bank Statement Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reconciliation Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">Bank Statement Balance</div>
            <div className="text-2xl font-bold">{formatCurrency(bankBalance)}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="text-sm text-green-600 dark:text-green-400">Book Balance</div>
            <div className="text-2xl font-bold">{formatCurrency(bookBalance)}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-yellow-50/50 dark:bg-yellow-900/20 p-4">
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Unreconciled Debits</div>
            <div className="text-2xl font-bold">{formatCurrency(unreconciledDebit)}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-purple-50/50 dark:bg-purple-900/20 p-4">
            <div className="text-sm text-purple-600 dark:text-purple-400">Unreconciled Credits</div>
            <div className="text-2xl font-bold">{formatCurrency(unreconciledCredit)}</div>
          </div>
        </div>

        {/* Reconciled Balance */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Reconciled Balance</div>
              <div className="text-3xl font-bold">{formatCurrency(reconciledBalance)}</div>
            </div>
            <div className={`text-sm font-semibold ${
              Math.abs(reconciledBalance - bankBalance) < 1 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {Math.abs(reconciledBalance - bankBalance) < 1 
                ? 'Balanced ✓' 
                : `Difference: ${formatCurrency(Math.abs(reconciledBalance - bankBalance))}`}
            </div>
          </div>
        </div>

        {/* Unreconciled Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Unreconciled Transactions</CardTitle>
            <CardDescription>Transactions not yet reconciled with bank statement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      <th className="px-4 py-3 text-center font-semibold">Type</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {unreconciledTransactions.map((transaction) => (
                      <tr key={transaction.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {format(transaction.date, 'PPP')}
                        </td>
                        <td className="px-4 py-2.5">{transaction.description}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {transaction.type === 'Debit' ? '-' : '+'} {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'Debit'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.reconciled
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {transaction.reconciled ? 'Reconciled' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center">
                            {!transaction.reconciled && (
                              <Button
                                size="sm"
                                onClick={() => onReconcile(transaction.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Reconcile
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};