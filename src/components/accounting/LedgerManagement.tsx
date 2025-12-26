import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAccountingStore } from '@/store/accountingStore';
import { Ledger, LedgerGroup } from '@/types/accounting';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';
import { LedgerDialog } from './Dialog';
import { LedgerTable } from './LedgerTable';
import { SummaryCards } from './SummaryCards';

interface LedgerManagementProps {
  ledgers: Ledger[];
  filteredLedgers: Ledger[];
  searchTerm: string;
}

export const LedgerManagement: React.FC<LedgerManagementProps> = ({
  ledgers,
  filteredLedgers,
  searchTerm,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null);

  const addLedger = useAccountingStore((state) => state.addLedger);
  const updateLedger = useAccountingStore((state) => state.updateLedger);
  const deleteLedger = useAccountingStore((state) => state.deleteLedger);

  const handleAddLedger = (data: { name: string; group: LedgerGroup; openingBalance: number }) => {
    addLedger({
      name: data.name,
      group: data.group,
      openingBalance: data.openingBalance,
      currentBalance: data.openingBalance,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditLedger = (data: { name: string; group: LedgerGroup; openingBalance: number }) => {
    if (editingLedger) {
      updateLedger(editingLedger.id, data);
      setEditingLedger(null);
    }
  };

  const handleEdit = (ledger: Ledger) => {
    setEditingLedger(ledger);
  };

  const handleDelete = (ledger: Ledger) => {
    if (confirm(`Are you sure you want to delete "${ledger.name}"?`)) {
      deleteLedger(ledger.id);
    }
  };

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Ledgers',
      description: `${ledgers.length} active ledgers`,
      value: ledgers.length.toString(),
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Active Accounts',
      description: `${ledgers.filter(l => l.currentBalance !== 0).length} accounts with transactions`,
      value: ledgers.filter(l => l.currentBalance !== 0).length.toString(),
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Account Groups',
      description: `${new Set(ledgers.map(l => l.group)).size} classification groups`,
      value: new Set(ledgers.map(l => l.group)).size.toString(),
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} />

      {/* Ledgers Table */}
      <LedgerTable
        ledgers={ledgers}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Ledger Dialog */}
      <LedgerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddLedger}
        title="Add New Ledger"
      />

      {/* Edit Ledger Dialog */}
      <LedgerDialog
        isOpen={editingLedger !== null}
        onOpenChange={(open) => setEditingLedger(open ? editingLedger : null)}
        onSubmit={handleEditLedger}
        initialData={editingLedger ? {
          name: editingLedger.name,
          group: editingLedger.group,
          openingBalance: editingLedger.openingBalance,
        } : undefined}
        title="Edit Ledger"
      />
    </>
  );
};