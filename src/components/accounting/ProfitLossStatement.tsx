import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { ProfitLossStatement } from '@/types/accounting';
import { useAccountingStore } from '@/store/accountingStore';

interface ProfitLossStatementProps {
  sales: any[];
  purchases: any[];
}

export const ProfitLossStatement: React.FC<ProfitLossStatementProps> = ({ sales, purchases }) => {
  const getProfitLossStatement = useAccountingStore((state) => state.getProfitLossStatement);
  
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const endDate = new Date();
  
  const statement = getProfitLossStatement(startDate, endDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <CardDescription>For the current period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Income Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Income
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Direct Incomes</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(statement.directIncomes.reduce((sum, item) => sum + item.balance, 0))}
                  </span>
                </div>
                {statement.directIncomes.map((income) => (
                  <div key={income.ledgerId} className="flex justify-between">
                    <span className="text-muted-foreground">{income.ledgerName}</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(income.balance)}
                    </span>
                  </div>
                ))}
                
                <div className="flex justify-between border-b border-border pb-2 pt-2">
                  <span className="font-semibold">Indirect Incomes</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(statement.indirectIncomes.reduce((sum, item) => sum + item.balance, 0))}
                  </span>
                </div>
                {statement.indirectIncomes.map((income) => (
                  <div key={income.ledgerId} className="flex justify-between">
                    <span className="text-muted-foreground">{income.ledgerName}</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(income.balance)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Income</span>
                    <span className="text-green-600">
                      {formatCurrency(statement.totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Expenses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  Expenses
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Direct Expenses</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(statement.directExpenses.reduce((sum, item) => sum + item.balance, 0))}
                  </span>
                </div>
                {statement.directExpenses.map((expense) => (
                  <div key={expense.ledgerId} className="flex justify-between">
                    <span className="text-muted-foreground">{expense.ledgerName}</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(expense.balance)}
                    </span>
                  </div>
                ))}
                
                <div className="flex justify-between border-b border-border pb-2 pt-2">
                  <span className="font-semibold">Indirect Expenses</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(statement.indirectExpenses.reduce((sum, item) => sum + item.balance, 0))}
                  </span>
                </div>
                {statement.indirectExpenses.map((expense) => (
                  <div key={expense.ledgerId} className="flex justify-between">
                    <span className="text-muted-foreground">{expense.ledgerName}</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(expense.balance)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Expenses</span>
                    <span className="text-red-600">
                      {formatCurrency(statement.totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Gross Profit</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(statement.grossProfit)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Net Profit</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(statement.netProfit)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Profit Margin</div>
                <div className="text-2xl font-bold text-green-600">
                  {statement.totalRevenue > 0 
                    ? `${((statement.netProfit / statement.totalRevenue) * 100).toFixed(2)}%`
                    : '0.00%'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};