import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Product } from '@/types/erp';

interface InventoryReportProps {
  products: Product[];
  sales: Array<{
    productId: string;
    date: Date;
    quantity: number;
    totalValue: number;
  }>;
  purchases: Array<{
    productId: string;
    date: Date;
    quantity: number;
    totalValue: number;
  }>;
}

export const InventoryReport: React.FC<InventoryReportProps> = ({ products, sales, purchases }) => {
  // Calculate inventory metrics for each product
  const inventoryData = products.map(product => {
    const totalPurchased = purchases
      .filter(p => p.productId === product.productId)
      .reduce((sum, p) => sum + p.quantity, 0);
    
    const totalSold = sales
      .filter(s => s.productId === product.productId)
      .reduce((sum, s) => sum + s.quantity, 0);
    
    const currentStock = product.openingStock + totalPurchased - totalSold;
    
    const totalSalesValue = sales
      .filter(s => s.productId === product.productId)
      .reduce((sum, s) => sum + s.totalValue, 0);
    
    const totalPurchaseValue = purchases
      .filter(p => p.productId === product.productId)
      .reduce((sum, p) => sum + p.totalValue, 0);
    
    const profit = totalSalesValue - totalPurchaseValue;
    const turnoverRatio = totalPurchased > 0 ? totalSold / totalPurchased : 0;
    
    let status: 'in-stock' | 'low-stock' | 'out-of-stock';
    if (currentStock <= 0) {
      status = 'out-of-stock';
    } else if (currentStock <= product.reorderLevel) {
      status = 'low-stock';
    } else {
      status = 'in-stock';
    }
    
    return {
      ...product,
      totalPurchased,
      totalSold,
      currentStock,
      totalSalesValue,
      totalPurchaseValue,
      profit,
      turnoverRatio,
      status,
    };
  });

  const totalInventoryValue = inventoryData.reduce((sum, item) => {
    return sum + (item.currentStock * item.sellingRate);
  }, 0);

  const totalStockValue = inventoryData.reduce((sum, item) => {
    return sum + (item.openingStock * item.purchaseRate);
  }, 0);

  const avgTurnoverRatio = inventoryData.length > 0 
    ? inventoryData.reduce((sum, item) => sum + item.turnoverRatio, 0) / inventoryData.length 
    : 0;

  const stockStatusSummary = {
    inStock: inventoryData.filter(item => item.status === 'in-stock').length,
    lowStock: inventoryData.filter(item => item.status === 'low-stock').length,
    outOfStock: inventoryData.filter(item => item.status === 'out-of-stock').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Report
        </CardTitle>
        <CardDescription>Stock levels, turnover, and valuation analysis</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-green-50/50 dark:bg-green-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Inventory Value</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalInventoryValue)}</div>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-blue-50/50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Average Turnover Ratio</div>
                <div className="text-2xl font-bold">{avgTurnoverRatio.toFixed(2)}</div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-yellow-50/50 dark:bg-yellow-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Low Stock Items</div>
                <div className="text-2xl font-bold">{stockStatusSummary.lowStock}</div>
              </div>
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/50">
                <TrendingDown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-red-50/50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">Out of Stock Items</div>
                <div className="text-2xl font-bold">{stockStatusSummary.outOfStock}</div>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/50">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Details Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Product</th>
                  <th className="px-4 py-3 text-left font-semibold">Brand</th>
                  <th className="px-4 py-3 text-right font-semibold">Opening Stock</th>
                  <th className="px-4 py-3 text-right font-semibold">Purchased</th>
                  <th className="px-4 py-3 text-right font-semibold">Sold</th>
                  <th className="px-4 py-3 text-right font-semibold">Current Stock</th>
                  <th className="px-4 py-3 text-right font-semibold">Reorder Level</th>
                  <th className="px-4 py-3 text-right font-semibold">Stock Value</th>
                  <th className="px-4 py-3 text-right font-semibold">Turnover Ratio</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inventoryData.map((item) => (
                  <tr key={item.id} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.productId}</div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.brand}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{item.openingStock}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{item.totalPurchased}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{item.totalSold}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                      <span className={
                        item.currentStock <= 0
                          ? 'text-red-600'
                          : item.currentStock <= item.reorderLevel
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{item.reorderLevel}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-green-600">
                      {formatCurrency(item.currentStock * item.sellingRate)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {item.turnoverRatio.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'in-stock'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : item.status === 'low-stock'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                          title="View Details"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                          title="Download Report"
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
                  <td colSpan={7} className="px-4 py-3 text-right font-semibold">Total Inventory Value:</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-green-600">
                    {formatCurrency(totalInventoryValue)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Low Stock Items */}
              <div>
                <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Low Stock Items</h4>
                <div className="grid grid-cols-1 gap-2">
                  {inventoryData
                    .filter(item => item.status === 'low-stock')
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">({item.productId})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Stock: <span className="font-semibold">{item.currentStock}</span></span>
                          <span>Reorder: <span className="font-semibold">{item.reorderLevel}</span></span>
                          <span className="font-semibold text-yellow-600">Reorder Needed</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Out of Stock Items */}
              <div>
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Out of Stock Items</h4>
                <div className="grid grid-cols-1 gap-2">
                  {inventoryData
                    .filter(item => item.status === 'out-of-stock')
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">({item.productId})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Stock: <span className="font-semibold text-red-600">0</span></span>
                          <span className="font-semibold text-red-600">Urgent: Out of Stock</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};