import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Download, FileText, Users, Building2, Calculator, FileSpreadsheet } from 'lucide-react';
import { useAccountingStore } from '@/store/accountingStore';
import { useERPStore } from '@/store/erpStore';
import { Ledger, Voucher, VoucherType, LedgerGroup } from '@/types/accounting';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

// Import modular components
import { LedgerManagement } from '@/components/accounting/LedgerManagement';
import { VoucherManagement } from '@/components/accounting/VoucherManagement';
import { TrialBalance } from '@/components/accounting/TrialBalance';
import { ProfitLossStatement } from '@/components/accounting/ProfitLossStatement';
import { BalanceSheet } from '@/components/accounting/BalanceSheet';
import { Reports } from '@/components/accounting/Reports';

const Accounting = () => {
  const [activeTab, setActiveTab] = useState('ledgers');
  const [searchTerm, setSearchTerm] = useState('');

  const ledgers = useAccountingStore((state) => state.ledgers);
  const vouchers = useAccountingStore((state) => state.vouchers);
  const fetchAllAccountingData = useAccountingStore((state) => state.fetchAllAccountingData);

  const customers = useERPStore((state) => state.customers);
  const suppliers = useERPStore((state) => state.suppliers);
  const products = useERPStore((state) => state.products);
  const sales = useERPStore((state) => state.sales);
  const purchases = useERPStore((state) => state.purchases);

  useEffect(() => {
    fetchAllAccountingData();
  }, [fetchAllAccountingData]);

  // Filtered data based on search
  const filteredLedgers = ledgers.filter(
    (ledger) =>
      ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ledger.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.partyName && voucher.partyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppLayout>
      <PageHeader
        title="Accounting"
        description="Complete accounting system with ledgers, vouchers, and financial reports"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setActiveTab('ledgers')}>
              <Plus className="mr-2 h-4 w-4" /> Add Ledger
            </Button>
            <Button onClick={() => setActiveTab('vouchers')} variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Add Voucher
            </Button>
          </div>
        }
      />
      
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ledgers, vouchers, or parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {activeTab === 'ledgers' 
              ? `${filteredLedgers.length} ledgers` 
              : `${filteredVouchers.length} vouchers`}
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ledgers">
              <Building2 className="mr-2 h-4 w-4" />
              Ledgers
            </TabsTrigger>
            <TabsTrigger value="vouchers">
              <FileText className="mr-2 h-4 w-4" />
              Vouchers
            </TabsTrigger>
            <TabsTrigger value="trial-balance">
              <Calculator className="mr-2 h-4 w-4" />
              Trial Balance
            </TabsTrigger>
            <TabsTrigger value="profit-loss">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger value="balance-sheet">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Download className="mr-2 h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Ledgers Tab */}
          <TabsContent value="ledgers" className="space-y-4">
            <LedgerManagement
              ledgers={ledgers}
              filteredLedgers={filteredLedgers}
              searchTerm={searchTerm}
            />
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="space-y-4">
            <VoucherManagement
              vouchers={vouchers}
              filteredVouchers={filteredVouchers}
              ledgers={ledgers}
              customers={customers}
              suppliers={suppliers}
              products={products}
              sales={sales}
              purchases={purchases}
            />
          </TabsContent>

          {/* Trial Balance Tab */}
          <TabsContent value="trial-balance" className="space-y-4">
            <TrialBalance ledgers={ledgers} />
          </TabsContent>

          {/* Profit & Loss Tab */}
          <TabsContent value="profit-loss" className="space-y-4">
            <ProfitLossStatement
              sales={sales}
              purchases={purchases}
            />
          </TabsContent>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance-sheet" className="space-y-4">
            <BalanceSheet />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Accounting;