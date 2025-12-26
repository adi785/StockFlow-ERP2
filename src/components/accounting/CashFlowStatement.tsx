import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface CashFlowStatementProps {
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

export const CashFlowStatement: React.FC<CashFlowStatementProps> = ({
  operatingActivities,
  investingActivities,
  financingActivities,
  netChange,
  openingBalance,
  closingBalance,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cash Flow Statement
        </CardTitle>
        <CardDescription>Cash flow analysis for the period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Operating Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Operating Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Inflows</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(operatingActivities.cashInflows)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Outflows</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(operatingActivities.cashOutflows)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Net Cash Flow from Operations</span>
                    <span className={operatingActivities.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(operatingActivities.netCashFlow)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investing Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                Investing Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Inflows</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(investingActivities.cashInflows)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Outflows</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(investingActivities.cashOutflows)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Net Cash Flow from Investing</span>
                    <span className={investingActivities.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(investingActivities.netCashFlow)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financing Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Financing Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Inflows</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(financingActivities.cashInflows)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Outflows</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(financingActivities.cashOutflows)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Net Cash Flow from Financing</span>
                    <span className={financingActivities.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(financingActivities.netCashFlow)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-sm text-muted-foreground">Net Change in Cash</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(netChange)}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-sm text-muted-foreground">Opening Balance</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(openingBalance)}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-sm text-muted-foreground">Closing Balance</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(closingBalance)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
                <div className="text-sm text-green-700 dark:text-green-300">
                  Cash Flow Statement is {netChange >= 0 ? 'positive' : 'negative'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};