import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Users, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { Customer } from '@/integrations/supabase/partnerApi';

interface AgeingReportProps {
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

export const AgeingReport: React.FC<AgeingReportProps> = ({ customers, sales, purchases }) => {
  const calculateAgeing = (transactions: Array<{ date: Date; grandTotal: number }>) => {
    const today = new Date();
    const ageing = {
      current: 0,
      days1_30: 0,
      days31_60: 0,
      days61_90: 0,
      days90Plus: 0,
    };

    transactions.forEach(transaction => {
      const days = Math.floor((today.getTime() - transaction.date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 0) {
        ageing.current += transaction.grandTotal;
      } else if (days <= 30) {
        ageing.days1_30 += transaction.grandTotal;
      } else if (days <= 60) {
        ageing.days31_60 += transaction.grandTotal;
      } else if (days <= 90) {
        ageing.days61_90 += transaction.grandTotal;
      } else {
        ageing.days90Plus += transaction.grandTotal;
      }
    });

    return ageing;
  };

  // Debtors Ageing (Money customers owe us)
  const debtorsAgeing = customers.map(customer => {
    const customerSales = sales.filter(s => s.customer === customer.name);
    const customerPurchases = purchases.filter(p => p.supplier === customer.name);
    
    const totalSales = customerSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const totalPurchases = customerPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
    const outstanding = totalSales - totalPurchases;

    if (outstanding <= 0) return null;

    const ageing = calculateAgeing(customerSales);
    
    return {
      ...customer,
      outstanding,
      ageing,
    };
  }).filter(item => item !== null);

  // Creditors Ageing (Money we owe to suppliers)
  const creditorsAgeing = customers.map(customer => {
    const customerSales = sales.filter(s => s.customer === customer.name);
    const customerPurchases = purchases.filter(p => p.supplier === customer.name);
    
    const totalSales = customerSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const totalPurchases = customerPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
    const outstanding = totalPurchases - totalSales;

    if (outstanding <= 0) return null;

    const ageing = calculateAgeing(customerPurchases);
    
    return {
      ...customer,
      outstanding,
      ageing,
    };
  }).filter(item => item !== null);

  const totalDebtorsOutstanding = debtorsAgeing.reduce((sum, item) => sum + item.outstanding, 0);
  const totalCreditorsOutstanding = creditorsAgeing.reduce((sum, item) => sum + item.outstanding, 0);

  const getAgeingColor = (days: number) => {
    if (days <= 30) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (days <= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (days <= 90) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const renderAgeingRow = (ageing: any) => (
    <div className="flex gap-2 text-xs">
      <span className={`px-2 py-1 rounded ${getAgeingColor(0)}`}>Current: {formatCurrency(ageing.current)}</span>
      <span className={`px-2 py-1 rounded ${getAgeingColor(15)}`}>1-30: {formatCurrency(ageing.days1_30)}</span>
      <span className={`px-2 py-1 rounded ${getAgeingColor(45)}`}>31-60: {formatCurrency(ageing.days31_60)}</span>
      <span className={`px-2 py-1 rounded ${getAgeingColor(75)}`}>61-90: {formatCurrency(ageing.days61_90)}</span>
      <span className={`px-2 py-1 rounded ${getAgeingColor(120)}`}>90+: {formatCurrency(ageing.days90Plus)}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Ageing Report
        </CardTitle>
        <CardDescription>Analysis of outstanding receivables and payables by age</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Debtors Outstanding</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDebtorsOutstanding)}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">Total Creditors Outstanding</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCreditorsOutstanding)}</div>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
                <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Debtors Ageing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Debtors Ageing (Money to Receive)
            </CardTitle>
            <CardDescription>Customers who owe you money, categorized by age</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold">Contact</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Outstanding</th>
                      <th className="px-4 py-3 text-left font-semibold">Ageing Breakdown</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {debtorsAgeing.map((customer) => (
                      <tr key={customer.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.id}</div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {customer.phone || customer.email || '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-green-600">
                          {formatCurrency(customer.outstanding)}
                        </td>
                        <td className="px-4 py-2.5">
                          {renderAgeingRow(customer.ageing)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Debtor
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total Outstanding:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-green-600">
                        {formatCurrency(totalDebtorsOutstanding)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creditors Ageing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Creditors Ageing (Money to Pay)
            </CardTitle>
            <CardDescription>Suppliers you owe money to, categorized by age</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                      <th className="px-4 py-3 text-left font-semibold">Contact</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Outstanding</th>
                      <th className="px-4 py-3 text-left font-semibold">Ageing Breakdown</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {creditorsAgeing.map((supplier) => (
                      <tr key={supplier.id} className="grid-row hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-xs text-muted-foreground">{supplier.id}</div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {supplier.phone || supplier.email || '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-red-600">
                          {formatCurrency(supplier.outstanding)}
                        </td>
                        <td className="px-4 py-2.5">
                          {renderAgeingRow(supplier.ageing)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Creditor
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total Outstanding:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-red-600">
                        {formatCurrency(totalCreditorsOutstanding)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ageing Analysis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ageing Analysis</CardTitle>
            <CardDescription>Summary of receivables and payables by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Debtors Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold">Debtors Analysis</h4>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-green-50 p-3 dark:bg-green-900/20">
                    <div className="font-semibold text-green-600">Current</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(debtorsAgeing.reduce((sum, d) => sum + d.ageing.current, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <div className="font-semibold text-yellow-600">1-30 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(debtorsAgeing.reduce((sum, d) => sum + d.ageing.days1_30, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-orange-50 p-3 dark:bg-orange-900/20">
                    <div className="font-semibold text-orange-600">31-60 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(debtorsAgeing.reduce((sum, d) => sum + d.ageing.days31_60, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-red-50 p-3 dark:bg-red-900/20">
                    <div className="font-semibold text-red-600">61-90 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(debtorsAgeing.reduce((sum, d) => sum + d.ageing.days61_90, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-red-100 p-3 dark:bg-red-900/30">
                    <div className="font-semibold text-red-800">90+ Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(debtorsAgeing.reduce((sum, d) => sum + d.ageing.days90Plus, 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Creditors Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold">Creditors Analysis</h4>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-green-50 p-3 dark:bg-green-900/20">
                    <div className="font-semibold text-green-600">Current</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(creditorsAgeing.reduce((sum, c) => sum + c.ageing.current, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <div className="font-semibold text-yellow-600">1-30 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(creditorsAgeing.reduce((sum, c) => sum + c.ageing.days1_30, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-orange-50 p-3 dark:bg-orange-900/20">
                    <div className="font-semibold text-orange-600">31-60 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(creditorsAgeing.reduce((sum, c) => sum + c.ageing.days31_60, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-red-50 p-3 dark:bg-red-900/20">
                    <div className="font-semibold text-red-600">61-90 Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(creditorsAgeing.reduce((sum, c) => sum + c.ageing.days61_90, 0))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-red-100 p-3 dark:bg-red-900/30">
                    <div className="font-semibold text-red-800">90+ Days</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(creditorsAgeing.reduce((sum, c) => sum + c.ageing.days90Plus, 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};