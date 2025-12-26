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

const Accounting = () => {
  const [activeTab, setActiveTab] = useState('ledgers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);

  // Ledger form state
  const [newLedger, setNewLedger] = useState({
    name: '',
    group: 'Current Assets' as LedgerGroup,
    openingBalance: 0,
  });

  // Voucher form state
  const [newVoucher, setNewVoucher] = useState({
    voucherType: 'Sales' as VoucherType,
    date: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    narration: '',
    partyName: '',
    ledgerEntries: [] as Array<{
      ledgerId: string;
      ledgerName: string;
      amount: number;
      type: 'Debit' | 'Credit';
    }>,
    totalDebit: 0,
    totalCredit: 0,
  });

  const ledgers = useAccountingStore((state) => state.ledgers);
  const vouchers = useAccountingStore((state) => state.vouchers);
  const fetchAllAccountingData = useAccountingStore((state) => state.fetchAllAccountingData);
  const addLedger = useAccountingStore((state) => state.addLedger);
  const updateLedger = useAccountingStore((state) => state.updateLedger);
  const deleteLedger = useAccountingStore((state) => state.deleteLedger);
  const addVoucher = useAccountingStore((state) => state.addVoucher);

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

  // Handle ledger operations
  const handleAddLedger = () => {
    if (!newLedger.name) {
      toast.error('Please enter ledger name');
      return;
    }

    addLedger({
      name: newLedger.name,
      group: newLedger.group,
      openingBalance: newLedger.openingBalance,
      currentBalance: newLedger.openingBalance,
    });

    setNewLedger({ name: '', group: 'Current Assets', openingBalance: 0 });
    setIsLedgerDialogOpen(false);
  };

  const handleEditLedger = (ledger: Ledger) => {
    setSelectedLedger(ledger);
    setNewLedger({
      name: ledger.name,
      group: ledger.group,
      openingBalance: ledger.openingBalance,
    });
    setIsLedgerDialogOpen(true);
  };

  const handleUpdateLedger = () => {
    if (!selectedLedger) return;

    updateLedger(selectedLedger.id, {
      name: newLedger.name,
      group: newLedger.group,
      openingBalance: newLedger.openingBalance,
      currentBalance: newLedger.openingBalance,
    });

    setNewLedger({ name: '', group: 'Current Assets', openingBalance: 0 });
    setSelectedLedger(null);
    setIsLedgerDialogOpen(false);
    toast.success('Ledger updated successfully');
  };

  const handleDeleteLedger = (ledger: Ledger) => {
    if (confirm(`Are you sure you want to delete "${ledger.name}"?`)) {
      deleteLedger(ledger.id);
    }
  };

  // Handle voucher operations
  const handleAddVoucher = () => {
    if (newVoucher.totalDebit !== newVoucher.totalCredit) {
      toast.error('Debit and Credit amounts must be equal');
      return;
    }

    if (newVoucher.ledgerEntries.length === 0) {
      toast.error('Please add at least one ledger entry');
      return;
    }

    addVoucher({
      voucherType: newVoucher.voucherType,
      date: new Date(newVoucher.date),
      referenceNumber: newVoucher.referenceNumber,
      narration: newVoucher.narration,
      partyName: newVoucher.partyName,
      ledgerEntries: newVoucher.ledgerEntries,
      totalDebit: newVoucher.totalDebit,
      totalCredit: newVoucher.totalCredit,
    });

    setNewVoucher({
      voucherType: 'Sales',
      date: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      narration: '',
      partyName: '',
      ledgerEntries: [],
      totalDebit: 0,
      totalCredit: 0,
    });
    setIsVoucherDialogOpen(false);
  };

  const addLedgerEntry = () => {
    setNewVoucher({
      ...newVoucher,
      ledgerEntries: [
        ...newVoucher.ledgerEntries,
        { ledgerId: '', ledgerName: '', amount: 0, type: 'Debit' }
      ]
    });
  };

  const updateLedgerEntry = (index: number, field: string, value: any) => {
    const updatedEntries = [...newVoucher.ledgerEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    // Update ledger name when ID changes
    if (field === 'ledgerId') {
      const ledger = ledgers.find(l => l.id === value);
      updatedEntries[index].ledgerName = ledger ? ledger.name : '';
    }
    
    setNewVoucher({ ...newVoucher, ledgerEntries: updatedEntries });
    
    // Recalculate totals
    calculateTotals(updatedEntries);
  };

  const removeLedgerEntry = (index: number) => {
    const updatedEntries = newVoucher.ledgerEntries.filter((_, i) => i !== index);
    setNewVoucher({ ...newVoucher, ledgerEntries: updatedEntries });
    calculateTotals(updatedEntries);
  };

  const calculateTotals = (entries: typeof newVoucher.ledgerEntries) => {
    const totalDebit = entries
      .filter(e => e.type === 'Debit')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalCredit = entries
      .filter(e => e.type === 'Credit')
      .reduce((sum, e) => sum + e.amount, 0);
    
    setNewVoucher({
      ...newVoucher,
      ledgerEntries: entries,
      totalDebit,
      totalCredit,
    });
  };

  const addSalesVoucher = () => {
    // Auto-create sales voucher entries
    // This would be enhanced based on actual sales data
    toast.info('Sales voucher creation will be enhanced with actual sales data');
  };

  const addPurchaseVoucher = () => {
    // Auto-create purchase voucher entries
    // This would be enhanced based on actual purchase data
    toast.info('Purchase voucher creation will be enhanced with actual purchase data');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Accounting"
        description="Complete accounting system with ledgers, vouchers, and financial reports"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsLedgerDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Ledger
            </Button>
            <Button onClick={() => setIsVoucherDialogOpen(true)} variant="outline">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Total Ledgers</CardTitle>
                  <CardDescription>{ledgers.length} active ledgers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ledgers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Active Accounts</CardTitle>
                  <CardDescription>Accounts with transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {ledgers.filter(l => l.currentBalance !== 0).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Account Groups</CardTitle>
                  <CardDescription>Classification of accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Set(ledgers.map(l => l.group)).size}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ledgers Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Ledgers</CardTitle>
                <CardDescription>Complete list of all ledger accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-4 py-3 text-left font-semibold">Ledger Name</th>
                          <th className="px-4 py-3 text-left font-semibold">Group</th>
                          <th className="px-4 py-3 text-right font-semibold">Opening Balance</th>
                          <th className="px-4 py-3 text-right font-semibold">Current Balance</th>
                          <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredLedgers.map((ledger) => (
                          <tr key={ledger.id} className="grid-row hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2.5">
                              <div className="font-medium">{ledger.name}</div>
                              <div className="text-xs text-muted-foreground">{ledger.id}</div>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">{ledger.group}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums">
                              {formatCurrency(ledger.openingBalance)}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                              {formatCurrency(ledger.currentBalance)}
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleEditLedger(ledger)}
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteLedger(ledger)}
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Total Vouchers</CardTitle>
                  <CardDescription>{vouchers.length} recorded vouchers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vouchers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Total Debit</CardTitle>
                  <CardDescription>All debit transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(vouchers.reduce((sum, v) => sum + v.totalDebit, 0))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-col space-y-1.5">
                  <CardTitle>Total Credit</CardTitle>
                  <CardDescription>All credit transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(vouchers.reduce((sum, v) => sum + v.totalCredit, 0))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vouchers Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Vouchers</CardTitle>
                <CardDescription>Complete list of all recorded vouchers</CardDescription>
              </CardHeader>
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
                          <th className="px-4 py-3 text-center font-semibold">Narration</th>
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
                            <td className="px-4 py-2.5 text-sm text-muted-foreground max-w-xs truncate">
                              {voucher.narration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trial Balance Tab */}
          <TabsContent value="trial-balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trial Balance</CardTitle>
                <CardDescription>As of {formatDate(new Date())}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-4 py-3 text-left font-semibold">Ledger</th>
                          <th className="px-4 py-3 text-left font-semibold">Group</th>
                          <th className="px-4 py-3 text-right font-semibold">Debit</th>
                          <th className="px-4 py-3 text-right font-semibold">Credit</th>
                          <th className="px-4 py-3 text-right font-semibold">Balance</th>
                          <th className="px-4 py-3 text-center font-semibold">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {ledgers.map((ledger) => {
                          const totalDebit = ledger.openingBalance >= 0 ? ledger.openingBalance : 0;
                          const totalCredit = ledger.openingBalance < 0 ? Math.abs(ledger.openingBalance) : 0;
                          const balance = Math.abs(ledger.currentBalance);
                          const type = ledger.currentBalance > 0 ? 'Debit' : ledger.currentBalance < 0 ? 'Credit' : 'Zero';
                          
                          return (
                            <tr key={ledger.id} className="grid-row hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-2.5 font-medium">{ledger.name}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{ledger.group}</td>
                              <td className="px-4 py-2.5 text-right tabular-nums">
                                {formatCurrency(totalDebit)}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums">
                                {formatCurrency(totalCredit)}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                                {formatCurrency(balance)}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  type === 'Debit' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : type === 'Credit'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                }`}>
                                  {type}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-border bg-muted/30">
                          <td colSpan={2} className="px-4 py-3 text-right font-semibold">Totals:</td>
                          <td className="px-4 py-3 text-right tabular-nums font-semibold">
                            {formatCurrency(ledgers.reduce((sum, l) => sum + (l.openingBalance >= 0 ? l.openingBalance : 0), 0))}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-semibold">
                            {formatCurrency(ledgers.reduce((sum, l) => sum + (l.openingBalance < 0 ? Math.abs(l.openingBalance) : 0), 0))}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profit & Loss Tab */}
          <TabsContent value="profit-loss" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>For the current period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sales</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(sales.reduce((sum, s) => sum + s.totalValue, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Other Income</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Income</span>
                            <span className="text-green-600">
                              {formatCurrency(sales.reduce((sum, s) => sum + s.totalValue, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Purchases</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(purchases.reduce((sum, p) => sum + p.totalValue, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Other Expenses</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Expenses</span>
                            <span className="text-red-600">
                              {formatCurrency(purchases.reduce((sum, p) => sum + p.totalValue, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="text-sm text-muted-foreground">Gross Profit</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(
                            sales.reduce((sum, s) => sum + s.totalValue, 0) - 
                            purchases.reduce((sum, p) => sum + p.totalValue, 0)
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="text-sm text-muted-foreground">Net Profit</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(
                            sales.reduce((sum, s) => sum + s.totalValue, 0) - 
                            purchases.reduce((sum, p) => sum + p.totalValue, 0)
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="text-sm text-muted-foreground">Profit Margin</div>
                        <div className="text-2xl font-bold text-green-600">
                          {sales.reduce((sum, s) => sum + s.totalValue, 0) > 0 
                            ? `${(
                                (sales.reduce((sum, s) => sum + s.totalValue, 0) - 
                                purchases.reduce((sum, p) => sum + p.totalValue, 0)) / 
                                sales.reduce((sum, s) => sum + s.totalValue, 0) * 100
                              ).toFixed(2)}%`
                            : '0.00%'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance-sheet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of {formatDate(new Date())}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Assets</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fixed Assets</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investments</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Assets</span>
                            <span>{formatCurrency(0)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Liabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Liabilities</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loans</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capital</span>
                          <span className="font-semibold">
                            {formatCurrency(0)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Liabilities</span>
                            <span>{formatCurrency(0)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Generate and export various accounting reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Day Book
                      </CardTitle>
                      <CardDescription>Daily transaction summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Cash Book
                      </CardTitle>
                      <CardDescription>Cash transactions report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Bank Book
                      </CardTitle>
                      <CardDescription>Bank transaction report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        GST Report
                      </CardTitle>
                      <CardDescription>GST input/output summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Ageing Report
                      </CardTitle>
                      <CardDescription>Debtors and creditors ageing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Inventory Report
                      </CardTitle>
                      <CardDescription>Stock and inventory summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Ledger Dialog */}
      <Dialog open={isLedgerDialogOpen} onOpenChange={setIsLedgerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedLedger ? 'Edit Ledger' : 'Add New Ledger'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                value={newLedger.name}
                onChange={(e) => setNewLedger({ ...newLedger, name: e.target.value })}
                placeholder="Enter ledger name"
              />
            </div>
            <div className="space-y-2">
              <Label>Account Group</Label>
              <Select
                value={newLedger.group}
                onValueChange={(value) => setNewLedger({ ...newLedger, group: value as LedgerGroup })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'Capital Account',
                    'Current Assets',
                    'Current Liabilities',
                    'Direct Expenses',
                    'Direct Incomes',
                    'Fixed Assets',
                    'Indirect Expenses',
                    'Indirect Incomes',
                    'Investments',
                    'Loans (Liability)',
                    'Bank Accounts',
                    'Cash-in-Hand',
                    'Sundry Debtors',
                    'Sundry Creditors',
                    'Duties & Taxes',
                    'Provisions'
                  ].map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Opening Balance</Label>
              <Input
                type="number"
                value={newLedger.openingBalance}
                onChange={(e) => setNewLedger({ ...newLedger, openingBalance: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsLedgerDialogOpen(false);
              setSelectedLedger(null);
              setNewLedger({ name: '', group: 'Current Assets', openingBalance: 0 });
            }}>
              Cancel
            </Button>
            <Button onClick={selectedLedger ? handleUpdateLedger : handleAddLedger}>
              {selectedLedger ? 'Update Ledger' : 'Add Ledger'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Voucher Dialog */}
      <Dialog open={isVoucherDialogOpen} onOpenChange={setIsVoucherDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Voucher Type</Label>
                <Select
                  value={newVoucher.voucherType}
                  onValueChange={(value) => setNewVoucher({ ...newVoucher, voucherType: value as VoucherType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Payment', 'Receipt', 'Contra', 'Journal', 'Sales', 'Purchase', 'Debit Note', 'Credit Note'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newVoucher.date}
                  onChange={(e) => setNewVoucher({ ...newVoucher, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input
                  value={newVoucher.referenceNumber}
                  onChange={(e) => setNewVoucher({ ...newVoucher, referenceNumber: e.target.value })}
                  placeholder="Optional reference"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Party Name</Label>
              <Input
                value={newVoucher.partyName}
                onChange={(e) => setNewVoucher({ ...newVoucher, partyName: e.target.value })}
                placeholder="Customer/Supplier name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Narration</Label>
              <Textarea
                value={newVoucher.narration}
                onChange={(e) => setNewVoucher({ ...newVoucher, narration: e.target.value })}
                placeholder="Enter voucher narration"
                rows={3}
              />
            </div>
            
            {/* Ledger Entries */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ledger Entries</Label>
                <Button variant="outline" onClick={addLedgerEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>
              
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold">Ledger</th>
                        <th className="px-4 py-3 text-left font-semibold">Type</th>
                        <th className="px-4 py-3 text-right font-semibold">Amount</th>
                        <th className="px-4 py-3 text-center font-semibold w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {newVoucher.ledgerEntries.map((entry, index) => (
                        <tr key={index} className="grid-row hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5">
                            <Select
                              value={entry.ledgerId}
                              onValueChange={(value) => updateLedgerEntry(index, 'ledgerId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ledger" />
                              </SelectTrigger>
                              <SelectContent>
                                {ledgers.map((l) => (
                                  <SelectItem key={l.id} value={l.id}>
                                    {l.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2.5">
                            <Select
                              value={entry.type}
                              onValueChange={(value) => updateLedgerEntry(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Debit">Debit</SelectItem>
                                <SelectItem value="Credit">Credit</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2.5">
                            <Input
                              type="number"
                              value={entry.amount}
                              onChange={(e) => updateLedgerEntry(index, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeLedgerEntry(index)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-muted/30">
                        <td colSpan={2} className="px-4 py-3 text-right font-semibold">Totals:</td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">
                          Debit: {formatCurrency(newVoucher.totalDebit)} | Credit: {formatCurrency(newVoucher.totalCredit)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsVoucherDialogOpen(false);
              setNewVoucher({
                voucherType: 'Sales',
                date: new Date().toISOString().split('T')[0],
                referenceNumber: '',
                narration: '',
                partyName: '',
                ledgerEntries: [],
                totalDebit: 0,
                totalCredit: 0,
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddVoucher} disabled={newVoucher.totalDebit !== newVoucher.totalCredit}>
              Add Voucher
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Accounting;