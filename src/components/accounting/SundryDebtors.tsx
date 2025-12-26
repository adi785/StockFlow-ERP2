import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Eye, Users } from 'lucide-react';
import { Customer } from '@/integrations/supabase/partnerApi';

interface SundryDebtorsProps {
  customers: Customer[];
  sales: Array<{
    customer: string;
    date: Date;
    grandTotal: number;
    invoiceNo: string;
  }>;
  purchases: Array<{
    supplier: string;
    date: Date;
    grandTotal: number;
    invoiceNo: string;
  }>;
}

export const SundryDebtors: React.FC<SundryDebtorsProps> = ({ customers, sales, purchases }) => {
  // Calculate outstanding amounts for each customer
  const debtorSummary = customers.map(customer => {
    const totalSales = sales
      .filter(s => s.customer === customer.name)
      .reduce((sum, s) => sum + s.grandTotal, 0);
    
    const totalPurchases = purchases
      .filter(p => p.supplier === customer.name)
      .reduce((sum, p) => sum + p.grandTotal, 0);
    
    const outstanding = totalSales - totalPurchases;
    
    return {
      ...customer,
      totalSales,
      totalPurchases,
      outstanding,
      status: outstanding > 0 ? 'Debtor' : outstanding < 0 ? 'Creditor' : 'Settled'
    };
  }).filter(d => d.outstanding !== 0);

  const totalDebtors = debtorSummary.filter(d => d.status === 'Debtor');
  const totalCreditors = debtorSummary.filter(d => d.status === 'Creditor');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sundry Debtors & Creditors
        </CardTitle>
        <CardDescription>Customer outstanding analysis</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Debtors</div>
                <div className="text-2xl font-bold">{totalDebtors.length}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(totalDebtors.reduce((sum, d) => sum + d.outstanding, 0))}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">Total Creditors</div>
                <div className="text-2xl font-bold">{totalCreditors.length}</div>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
                <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(Math.abs(totalCreditors.reduce((sum, d) => sum + d.outstanding, 0)))}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Net Position</div>
                <div className="text-2xl font-bold">
                  {totalDebtors.length - totalCreditors.length}
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold">
              {formatCurrency(
                totalDebtors.reduce((sum, d) => sum + d.outstanding, 0) -
                Math.abs(totalCreditors.reduce((sum, d) => sum + d.outstanding, 0))
              )}
            </div>
          </div>
        </div>

        {/* Debtors Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debtors (Money to Receive)</CardTitle>
            <CardDescription>Customers who owe you money</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold">Contact</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Sales</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Purchases</th>
                      <th className="px-4 py-3 text-right font-semibold">Outstanding</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {totalDebtors.map((debtor) => (
                      <tr key={debtor.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{debtor.name}</div>
                          <div className="text-xs text-muted-foreground">{debtor.id}</div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {debtor.phone || debtor.email || '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                          {formatCurrency(debtor.totalSales)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-red-600">
                          {formatCurrency(debtor.totalPurchases)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-green-600">
                          {formatCurrency(debtor.outstanding)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                              title="View Statement"
                            >
                              <Eye className="h-4 w-4" />
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
                      <td colSpan={4} className="px-4 py-3 text-right font-semibold">Total Outstanding:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-green-600">
                        {formatCurrency(totalDebtors.reduce((sum, d) => sum + d.outstanding, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creditors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Creditors (Money to Pay)</CardTitle>
            <CardDescription>Suppliers you owe money to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                      <th className="px-4 py-3 text-left font-semibold">Contact</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Sales</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Purchases</th>
                      <th className="px-4 py-3 text-right font-semibold">Outstanding</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {totalCreditors.map((creditor) => (
                      <tr key={creditor.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{creditor.name}</div>
                          <div className="text-xs text-muted-foreground">{creditor.id}</div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {creditor.phone || creditor.email || '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                          {formatCurrency(creditor.totalSales)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-red-600">
                          {formatCurrency(creditor.totalPurchases)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-red-600">
                          {formatCurrency(Math.abs(creditor.outstanding))}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                              title="View Statement"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-100"
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
                      <td colSpan={4} className="px-4 py-3 text-right font-semibold">Total Outstanding:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-red-600">
                        {formatCurrency(Math.abs(totalCreditors.reduce((sum, d) => sum + d.outstanding, 0)))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};