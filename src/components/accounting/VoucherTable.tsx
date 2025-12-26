import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Download, Eye } from 'lucide-react';
import { Voucher } from '@/types/accounting';

interface VoucherTableProps {
  vouchers: Voucher[];
  filteredVouchers: Voucher[];
  searchTerm: string;
}

export const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  filteredVouchers,
  searchTerm,
}) => {
  return (
    <Card>
      <CardContent>
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Voucher No</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-right font-semibold">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold">Credit</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="grid-row hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">{formatDate(voucher.date)}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {voucher.voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{voucher.partyName || '-'}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                      {formatCurrency(voucher.totalDebit)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-red-600">
                      {formatCurrency(voucher.totalCredit)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                          title="Download"
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
                  <td colSpan={4} className="px-4 py-3 text-right font-semibold">Totals:</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-green-600">
                    {formatCurrency(vouchers.reduce((sum, v) => sum + v.totalDebit, 0))}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-red-600">
                    {formatCurrency(vouchers.reduce((sum, v) => sum + v.totalCredit, 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};