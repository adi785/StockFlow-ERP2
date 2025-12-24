import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/stat-card';
import { StockBadge } from '@/components/ui/stock-badge';
import { useERPStore, computeStockItems, computeProfitLossItems, computeDashboardStats } from '@/store/erpStore';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const products = useERPStore((state) => state.products);
  const purchases = useERPStore((state) => state.purchases);
  const sales = useERPStore((state) => state.sales);

  const stockItems = useMemo(
    () => computeStockItems(products, purchases, sales),
    [products, purchases, sales]
  );

  const profitLossItems = useMemo(
    () => computeProfitLossItems(products, purchases, sales),
    [products, purchases, sales]
  );

  const stats = useMemo(
    () => computeDashboardStats(products, stockItems, profitLossItems),
    [products, stockItems, profitLossItems]
  );

  // Get items that need attention
  const alertItems = useMemo(
    () => stockItems.filter((item) => item.status === 'low-stock' || item.status === 'out-of-stock'),
    [stockItems]
  );

  // Get top products by sales
  const topProducts = useMemo(
    () => [...profitLossItems].sort((a, b) => b.totalSalesValue - a.totalSalesValue).slice(0, 5),
    [profitLossItems]
  );

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your distribution business"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={formatNumber(stats.totalProducts)}
            icon={Package}
            variant="default"
          />
          <StatCard
            title="Total Purchases"
            value={formatCurrency(stats.totalPurchaseValue)}
            icon={ShoppingCart}
            variant="default"
          />
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSalesValue)}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Net Profit"
            value={formatCurrency(stats.totalProfit)}
            icon={IndianRupee}
            variant={stats.totalProfit >= 0 ? 'success' : 'danger'}
          />
        </div>

        {/* Alerts Row */}
        {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.lowStockCount > 0 && (
              <div className="flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {stats.lowStockCount} products with low stock
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Reorder soon to avoid stockouts
                  </p>
                </div>
              </div>
            )}
            {stats.outOfStockCount > 0 && (
              <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    {stats.outOfStockCount} products out of stock
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Immediate reorder required
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stock Alerts */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-semibold">Stock Alerts</h2>
              <Link
                to="/stock"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {alertItems.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  All products are well stocked
                </div>
              ) : (
                alertItems.slice(0, 5).map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.productId} • {item.brand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">
                        {formatNumber(item.currentStock)} units
                      </p>
                      <StockBadge status={item.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-semibold">Top Products by Sales</h2>
              <Link
                to="/profit-loss"
                className="text-sm font-medium text-primary hover:underline"
              >
                View report
              </Link>
            </div>
            <div className="divide-y divide-border">
              {topProducts.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.productId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">
                      {formatCurrency(item.totalSalesValue)}
                    </p>
                    <p
                      className={
                        item.profit >= 0
                          ? 'text-sm text-green-600'
                          : 'text-sm text-red-600'
                      }
                    >
                      {item.profit >= 0 ? '+' : ''}
                      {formatCurrency(item.profit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/products"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/50 hover:shadow-card-hover"
          >
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Product Master</h3>
              <p className="text-sm text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
          </Link>

          <Link
            to="/purchases"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/50 hover:shadow-card-hover"
          >
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">New Purchase</h3>
              <p className="text-sm text-muted-foreground">
                Record stock inward entry
              </p>
            </div>
          </Link>

          <Link
            to="/sales"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/50 hover:shadow-card-hover"
          >
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">New Sale</h3>
              <p className="text-sm text-muted-foreground">
                Create outward invoice
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
