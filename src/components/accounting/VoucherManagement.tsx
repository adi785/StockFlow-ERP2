import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Eye, Users } from 'lucide-react';
import { useAccountingStore } from '@/store/accountingStore';
import { Voucher, VoucherType, Ledger } from '@/types/accounting';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { VoucherDialog } from './VoucherDialog';
import { VoucherTable } from './VoucherTable';
import { SummaryCards } from './SummaryCards';

interface VoucherManagementProps {
  vouchers: Voucher[];
  filteredVouchers: Voucher[];
  ledgers: Ledger[];
  customers: any[];
  suppliers: any[];
  products: any[];
  sales: any[];
  purchases: any[];
}

export const VoucherManagement: React.FC<VoucherManagementProps> = ({
  vouchers,
  filteredVouchers,
  ledgers,
  customers,
  suppliers,
  products,
  sales,
  purchases,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addVoucher = useAccountingStore((state) => state.addVoucher);

  const handleAddVoucher = (data: {
    voucherType: VoucherType;
    date: string;
    referenceNumber: string;
    narration: string;
    partyName: string;
    ledgerEntries: Array<{
      ledgerId: string;
      ledgerName: string;
      amount: number;
      type: 'Debit' | 'Credit';
    }>;
    totalDebit: number;
    totalCredit: number;
  }) => {
    addVoucher({
      voucherType: data.voucherType,
      date: new Date(data.date),
      referenceNumber: data.referenceNumber,
      narration: data.narration,
      partyName: data.partyName,
      ledgerEntries: data.ledgerEntries,
      totalDebit: data.totalDebit,
      totalCredit: data.totalCredit,
    });
    setIsAddDialogOpen(false);
  };

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Vouchers',
      description: `${vouchers.length} recorded vouchers`,
      value: vouchers.length.toString(),
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Total Debit',
      description: 'All debit transactions',
      value: formatCurrency(vouchers.reduce((sum, v) => sum + v.totalDebit, 0)),
      icon: <Users className="h-5 w-5 text-green-600" />,
    },
    {
      title: 'Total Credit',
      description: 'All credit transactions',
      value: formatCurrency(vouchers.reduce((sum, v) => sum + v.totalCredit, 0)),
      icon: <Users className="h-5 w-5 text-red-600" />,
    },
  ];

  return (
    <>
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} />

      {/* Vouchers Table */}
      <VoucherTable
        vouchers={vouchers}
        filteredVouchers={filteredVouchers}
        searchTerm=""
      />

      {/* Add Voucher Dialog */}
      <VoucherDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddVoucher}
        ledgers={ledgers}
        title="Add New Voucher"
      />
    </>
  );
};