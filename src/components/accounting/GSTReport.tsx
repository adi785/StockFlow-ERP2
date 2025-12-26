import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { GSTReport } from '@/types/accounting';

interface GSTReportProps {
  report: GSTReport;
}

export const GSTReportComponent: React.FC<GSTReportProps> = ({ report }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GST Report</CardTitle>
        <CardDescription>GST Input/Output Summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Outward Taxable Supplies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Outward Supplies
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Intra-State Supplies */}
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Intra-State Supplies</span>
                  <span className="font-semibold">
                    {formatCurrency(report.outwardTaxable.intraState.reduce((sum, item) => sum + item.totalAmount, 0))}
                  </span>
                </div>
                {report.outwardTaxable.intraState.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST @ {item.gstRate}%</span>
                      <span className="font-medium">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>CGST: {formatCurrency(item.cgstAmount)}</div>
                      <div>SGST: {formatCurrency(item.sgstAmount)}</div>
                      <div>Total: {formatCurrency(item.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Inter-State Supplies */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Inter-State Supplies</span>
                  <span className="font-semibold">
                    {formatCurrency(report.outwardTaxable.interState.reduce((sum, item) => sum + item.totalAmount, 0))}
                  </span>
                </div>
                {report.outwardTaxable.interState.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IGST @ {item.gstRate}%</span>
                      <span className="font-medium">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>IGST: {formatCurrency(item.igstAmount)}</div>
                      <div>Total: {formatCurrency(item.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Inward Taxable Supplies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Inward Supplies
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Intra-State Supplies */}
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Intra-State Supplies</span>
                  <span className="font-semibold">
                    {formatCurrency(report.inwardTaxable.intraState.reduce((sum, item) => sum + item.totalAmount, 0))}
                  </span>
                </div>
                {report.inwardTaxable.intraState.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST @ {item.gstRate}%</span>
                      <span className="font-medium">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>CGST: {formatCurrency(item.cgstAmount)}</div>
                      <div>SGST: {formatCurrency(item.sgstAmount)}</div>
                      <div>Total: {formatCurrency(item.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Inter-State Supplies */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold">Inter-State Supplies</span>
                  <span className="font-semibold">
                    {formatCurrency(report.inwardTaxable.interState.reduce((sum, item) => sum + item.totalAmount, 0))}
                  </span>
                </div>
                {report.inwardTaxable.interState.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IGST @ {item.gstRate}%</span>
                      <span className="font-medium">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>IGST: {formatCurrency(item.igstAmount)}</div>
                      <div>Total: {formatCurrency(item.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* GST Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>GST Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Total Tax Payable</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(report.totalTaxPayable)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Total Tax Paid</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(report.totalTaxPaid)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Net Tax Liability</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(report.netTaxLiability)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900">
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Note: Net Tax Liability = Total Tax Payable - Total Tax Paid
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};