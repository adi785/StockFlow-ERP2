import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { StockBadge } from '@/components/ui/stock-badge';
import { useERPStore, computeStockItems } from '@/store/erpStore';
import { formatNumber } from '@/lib/formatters';
import { Search, Warehouse, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const Stock = () => {
  const products = useERPStore((state) => state.products);
  const purchases = useERPStore((state) => state.purchases);
  const sales = useERPStore((state) => state.sales);
  const fetchAllData = useERPStore((state) => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const stockItems = useMemo(
    () => computeStockItems(products, purchases, sales),
    [products, purchases, sales]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter =
        filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [stockItems, searchTerm, filterStatus]);

  const summary = useMemo(() => ({
    total: stockItems.length,
    inStock: stockItems.filter((s) => s.status === 'in-stock').length,
    lowStock: stockItems.filter((s) => s.status === 'low-stock').length,
    outOfStock: stockItems.filter((s) => s.status === 'out-of-stock').length,
  }), [stockItems]);

  return (
    <AppLayout>
      <PageHeader
        title="Stock Management"
        description="Live stock status calculated from Opening + Purchases − Sales"
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
              filterStatus === 'all'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="rounded-lg bg-primary/10 p-3">
              <Warehouse className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">{summary.total}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('in-stock')}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
              filterStatus === 'in-stock'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-border bg-card hover:border-green-500/50'
            }`}
          >
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-green-600">{summary.inStock}</p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('low-stock')}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
              filterStatus === 'low-stock'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-border bg-card hover:border-yellow-500/50'
            }`}
          >
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/50">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-yellow-600">{summary.lowStock}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('out-of-stock')}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
              filterStatus === 'out-of-stock'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-border bg-card hover:border-red-500/50'
            }`}
          >
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-red-600">{summary.outOfStock}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredItems.length} of {stockItems.length} products
          </div>
        </div>

        {/* Stock Grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Product ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Brand</th>
                  <th className="px-4 py-3 text-right font-semibold">Opening</th>
                  <th className="px-4 py-3 text-right font-semibold text-primary">+ Purchased</th>
                  <th className="px-4 py-3 text-right font-semibold text-red-600">− Sold</th>
                  <th className="px-4 py-3 text-right font-semibold">= Current</th>
                  <th className="px-4 py-3 text-right font-semibold">Reorder Level</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr
                    key={item.productId}
                    className={`grid-row transition-colors ${
                      item.status === 'out-of-stock'
                        ? 'bg-red-50/50 dark:bg-red-900/10'
                        : item.status === 'low-stock'
                        ? 'bg-yellow-50/50 dark:bg-yellow-900/10'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {item.productId}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{item.productName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.brand}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {formatNumber(item.openingStock)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium text-primary">
                      +{formatNumber(item.totalPurchased)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium text-red-600">
                      −{formatNumber(item.totalSold)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`tabular-nums text-lg font-bold ${
                          item.currentStock <= 0
                            ? 'text-red-600'
                            : item.currentStock <= item.reorderLevel
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {formatNumber(item.currentStock)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {formatNumber(item.reorderLevel)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <StockBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Formula Info */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="font-semibold mb-2">Stock Calculation Formula</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono bg-background px-2 py-1 rounded border border-border">
              Current Stock = Opening Stock + Total Purchased − Total Sold
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Stock is automatically updated when purchases or sales are recorded. No manual calculation required.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Stock;
