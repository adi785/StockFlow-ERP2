import React from 'react';
import { Sale, Product } from '@/types/erp';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { getProductById } from '@/lib/erpCalculations';

interface SalesTableProps {
  filteredGroupedSales: Sale[][];
  products: Product[];
  handleDownloadPdf: (invoiceNo: string) => void;
  handleDelete: (id: string, invoiceNo: string) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  filteredGroupedSales,
  products,
  handleDownloadPdf,
  handleDelete,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Invoice No</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Items</th>
              <th className="px-4 py-3 text-right font-semibold">Total Qty</th>
              <th className="px-4 py-3 text-right font-semibold">Total Value</th>
              <th className="px-4 py-3 text-right font-semibold">Total GST</th>
              <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
              <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredGroupedSales.map((invoiceGroup) => {
              const firstSale = invoiceGroup[0];
              const totalQuantity = invoiceGroup.reduce((sum, s) => sum + s.quantity, 0);
              const totalValue = invoiceGroup.reduce((sum, s) => sum + s.totalValue, 0);
              const totalGstAmount = invoiceGroup.reduce((sum, s) => sum + s.gstAmount, 0);
              const grandTotal = invoiceGroup.reduce((sum, s) => sum + s.grandTotal, 0);

              return (
                <tr
                  key={firstSale.invoiceNo}
                  className="grid-row hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {formatDate(firstSale.date)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs font-medium text-green-600">
                    {firstSale.invoiceNo}
                  </td>
                  <td className="px-4 py-2.5">{firstSale.customer}</td>
                  <td className="px-4 py-2.5">
                    {invoiceGroup.map((item) => {
                      const product = getProductById(products, item.productId);
                      return (
                        <div key={item.id} className="text-xs">
                          {product?.name || 'Unknown'} ({item.quantity} units)
                        </div>
                      );
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                    {totalQuantity}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatCurrency(totalValue)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(totalGstAmount)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-green-600">
                    {formatCurrency(grandTotal)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleDownloadPdf(firstSale.invoiceNo)}
                        title="Download Invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(firstSale.id, firstSale.invoiceNo)}
                        title="Delete Sale"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td colSpan={4} className="px-4 py-3 text-right font-semibold">
                Grand Total:
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold">
                {filteredGroupedSales.reduce((sum, group) => sum + group.reduce((s, item) => s + item.quantity, 0), 0)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold">
                {formatCurrency(
                  filteredGroupedSales.reduce((sum, group) => sum + group.reduce((s, item) => s + item.totalValue, 0), 0)
                )}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold">
                {formatCurrency(
                  filteredGroupedSales.reduce((sum, group) => sum + group.reduce((s, item) => s + item.gstAmount, 0), 0)
                )}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-bold text-green-600">
                {formatCurrency(
                  filteredGroupedSales.reduce((sum, group) => sum + group.reduce((s, item) => s + item.grandTotal, 0), 0)
                )}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};