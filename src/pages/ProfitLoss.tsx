import { useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useERPStore, computeProfitLossItems } from '@/store/erpStore';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { TrendingUp, TrendingDown, IndianRupee, BarChart3 } from 'lucide-react';

const ProfitLoss = () => {
  const products = useERPStore((state) => state.products);
  const purchases = useERPStore((state) => state.purchases);
  const sales = useERPStore((state) => state.sales);
  const fetchAllData = useERPStore((state) => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const profitLossItems = useMemo(
    () => computeProfitLossItems(products, purchases, sales),
    [products, purchases, sales]
  );

  // Sort by profit (highest first)
  const sortedItems = useMemo(
    () => [...profitLossItems].sort((a, b) => b.profit - a.profit),
    [profitLossItems]
  );

  // Calculate totals
  const totals = useMemo(() => {
    const purchasesTotal = profitLossItems.reduce((sum, p) => sum + p.totalPurchaseValue, 0);
    const salesTotal = profitLossItems.reduce((sum, p) => sum + p.totalSalesValue, 0);
    const profit = salesTotal - purchasesTotal;
    const margin = salesTotal > 0 ? (profit / salesTotal) * 100 : 0;
    
    return {
      purchases: purchasesTotal,
      sales: salesTotal,
      profit,
      margin,
    };
  }, [profitLossItems]);

  // Profitable vs loss-making products
  const profitableCount = profitLossItems.filter((p) => p.profit > 0).length;
  const lossCount = profitLossItems.filter((p) => p.profit < 0).length;
  const noTransactionCount = profitLossItems.filter(
    (p) => p.totalPurchaseValue === 0 && p.totalSalesValue === 0
  ).length;

  return (
    <AppLayout>
      <PageHeader
        title="Profit & Loss Report"
        description="Product-wise and overall profitability analysis"
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Purchases
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums">
                  {formatCurrency(totals.purchases)}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-green-600">
                  {formatCurrency(totals.sales)}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net Profit/Loss
                </p>
                <p
                  className={`mt-2 text-2xl font-bold tabular-nums ${
                    totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {totals.profit >= 0 ? '+' : ''}
                  {formatCurrency(totals.profit)}
                </p>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  totals.profit >= 0
                    ? 'bg-green-100 dark:bg-green-900/50'
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}
              >
                <IndianRupee
                  className={`h-5 w-5 ${
                    totals.profit >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Profit Margin
                </p>
                <p
                  className={`mt-2 text-2xl font-bold tabular-nums ${
                    totals.margin >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercent(totals.margin)}
                </p>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  totals.margin >= 0
                    ? 'bg-green-100 dark:bg-green-900/50'
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}
              >
                {totals.margin >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Performance Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600 dark:bg-green-900/50">
              {profitableCount}
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                Profitable Products
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Generating positive returns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600 dark:bg-red-900/50">
              {lossCount}
            </div>
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">
                Loss-Making Products
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Need attention or repricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
              {noTransactionCount}
            </div>
            <div>
              <p className="font-semibold">No Transactions</p>
              <p className="text-sm text-muted-foreground">
                Products with no purchase/sales
              </p>
            </div>
          </div>
        </div>

        {/* Product-wise P&L Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Product-wise Profit & Loss</h2>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Product ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Purchase Value
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Sales Value</th>
                  <th className="px-4 py-3 text-right font-semibold">Profit/Loss</th>
                  <th className="px-4 py-3 text-right font-semibold">Margin %</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedItems.map((item) => (
                  <tr
                    key={item.productId}
                    className={`grid-row transition-colors ${
                      item.profit < 0
                        ? 'bg-red-50/50 dark:bg-red-900/10'
                        : item.profit > 0
                        ? 'hover:bg-green-50/50 dark:hover:bg-green-900/10'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {item.productId}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{item.productName}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatCurrency(item.totalPurchaseValue)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                      {formatCurrency(item.totalSalesValue)}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right tabular-nums font-semibold ${
                        item.profit > 0
                          ? 'text-green-600'
                          : item.profit < 0
                          ? 'text-red-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.profit > 0 ? '+' : ''}
                      {formatCurrency(item.profit)}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right tabular-nums ${
                        item.profitMargin > 0
                          ? 'text-green-600'
                          : item.profitMargin < 0
                          ? 'text-red-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatPercent(item.profitMargin)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {item.profit > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <TrendingUp className="h-3 w-3" />
                          Profit
                        </span>
                      ) : item.profit < 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <TrendingDown className="h-3 w-3" />
                          Loss
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          No Activity
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={2} className="px-4 py-3 font-semibold">
                    Grand Total
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(totals.purchases)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-green-600">
                    {formatCurrency(totals.sales)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-bold text-lg ${
                      totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {totals.profit >= 0 ? '+' : ''}
                    {formatCurrency(totals.profit)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-semibold ${
                      totals.margin >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatPercent(totals.margin)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Formula Info */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="font-semibold mb-2">Profit Calculation Formula</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-mono bg-background px-2 py-1 rounded border border-border">
                Profit = Total Sales Value − Total Purchase Value
              </span>
            </p>
            <p>
              <span className="font-mono bg-background px-2 py-1 rounded border border-border">
                Profit Margin % = (Profit / Total Sales Value) × 100
              </span>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfitLoss;
