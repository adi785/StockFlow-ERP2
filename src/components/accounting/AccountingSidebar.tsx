import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Calculator, 
  FileSpreadsheet, 
  Users, 
  DollarSign, 
  Globe, 
  TrendingUp, 
  Package, 
  Clock 
} from 'lucide-react';

const navigation = [
  { name: 'Ledgers', href: '/accounting/ledgers', icon: Building2 },
  { name: 'Vouchers', href: '/accounting/vouchers', icon: FileText },
  { name: 'Trial Balance', href: '/accounting/trial-balance', icon: Calculator },
  { name: 'Profit & Loss', href: '/accounting/profit-loss', icon: FileSpreadsheet },
  { name: 'Balance Sheet', href: '/accounting/balance-sheet', icon: FileSpreadsheet },
  { name: 'Reports', href: '/accounting/reports', icon: Download },
];

export const AccountingSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">StockFlow</h1>
          <p className="text-xs text-sidebar-foreground/60">Accounting</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          to="/settings"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <div className="mt-3 px-3 text-xs text-sidebar-foreground/40"> v1.0.0 • Accounting Module </div>
      </div>
    </aside>
  );
};