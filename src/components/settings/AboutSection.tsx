import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Zap, Shield, Warehouse } from 'lucide-react';

export const AboutSection = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            StockFlow ERP
          </CardTitle>
          <CardDescription>
            Distribution Management System v1.0.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Product Master</h3>
                <p className="text-sm text-muted-foreground">
                  Central source of truth for all product data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Auto Stock Calculation</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time stock updates from purchases & sales
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Business Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Prevents negative stock & enforces data integrity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Excel-like interface with inline editing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Automatic GST calculation on purchases & sales
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Real-time stock status with color indicators
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Product-wise profit & loss reporting
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Negative stock prevention on sales
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Low stock alerts with reorder level tracking
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};