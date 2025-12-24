import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Warehouse, Database, Shield, Zap } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Configure your ERP system preferences"
      />

      <div className="p-6 space-y-6">
        {/* About Section */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Warehouse className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">StockFlow ERP</h2>
              <p className="text-muted-foreground">
                Distribution Management System v1.0.0
              </p>
            </div>
          </div>

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
        </div>

        {/* Features */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4">System Features</h3>
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
        </div>

        {/* Info */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="font-semibold text-primary mb-2">
            Ready for Database Integration
          </h4>
          <p className="text-sm text-muted-foreground">
            This ERP system is designed to connect to Lovable Cloud for persistent
            data storage, user authentication, and multi-user access. Currently
            running with in-memory data store for demonstration.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
