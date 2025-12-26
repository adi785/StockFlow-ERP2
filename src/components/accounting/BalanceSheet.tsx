import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { BalanceSheet } from '@/types/accounting';
import { useAccountingStore } from '@/store/accountingStore';

interface BalanceSheetProps {
  // Balance sheet data would be passed here
}

export const BalanceSheet: React.FC<BalanceSheetProps> = () => {
  const getBalanceSheet = useAccountingStore((state) => state.getBalanceSheet);
  
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const endDate = new Date();
  
  const balanceSheet = getBalanceSheet(startDate, endDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Assets Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Assets
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Assets</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.assets.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fixed Assets</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.assets.fixed)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investments</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.assets.investments)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Assets</span>
                    <span>{formatCurrency(balanceSheet.totalAssets)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Liabilities Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  Liabilities
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Liabilities</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.liabilities.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loans</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.liabilities.loans)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capital</span>
                  <span className="font-semibold">
                    {formatCurrency(balanceSheet.liabilities.capital)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Liabilities</span>
                    <span>{formatCurrency(balanceSheet.totalLiabilities)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Balance Check */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Balance Verification</CardTitle>
            <CardDescription>Assets should equal Liabilities + Net Profit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Total Assets</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(balanceSheet.totalAssets)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Total Liabilities</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(balanceSheet.totalLiabilities)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Net Profit</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(balanceSheet.netProfit)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-700 dark:text-green-300">
                  Balance Sheet is {balanceSheet.totalAssets === balanceSheet.totalLiabilities ? 'balanced' : 'not balanced'}
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(balanceSheet.totalAssets)} = {formatCurrency(balanceSheet.totalLiabilities)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};