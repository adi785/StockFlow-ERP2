import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Ledger, VoucherType } from '@/types/accounting';
import { toast } from 'sonner';

interface VoucherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
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
  }) => void;
  ledgers: Ledger[];
  title: string;
}

export const VoucherDialog: React.FC<VoucherDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  ledgers,
  title,
}) => {
  const [formData, setFormData] = React.useState({
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

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        voucherType: 'Sales',
        date: new Date().toISOString().split('T')[0],
        referenceNumber: '',
        narration: '',
        partyName: '',
        ledgerEntries: [],
        totalDebit: 0,
        totalCredit: 0,
      });
    }
  }, [isOpen]);

  const addLedgerEntry = () => {
    setFormData({
      ...formData,
      ledgerEntries: [
        ...formData.ledgerEntries,
        { ledgerId: '', ledgerName: '', amount: 0, type: 'Debit' }
      ]
    });
  };

  const updateLedgerEntry = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.ledgerEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    if (field === 'ledgerId') {
      const ledger = ledgers.find(l => l.id === value);
      updatedEntries[index].ledgerName = ledger ? ledger.name : '';
    }
    
    setFormData({ ...formData, ledgerEntries: updatedEntries });
    calculateTotals(updatedEntries);
  };

  const removeLedgerEntry = (index: number) => {
    const updatedEntries = formData.ledgerEntries.filter((_, i) => i !== index);
    setFormData({ ...formData, ledgerEntries: updatedEntries });
    calculateTotals(updatedEntries);
  };

  const calculateTotals = (entries: typeof formData.ledgerEntries) => {
    const totalDebit = entries
      .filter(e => e.type === 'Debit')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalCredit = entries
      .filter(e => e.type === 'Credit')
      .reduce((sum, e) => sum + e.amount, 0);
    
    setFormData({
      ...formData,
      ledgerEntries: entries,
      totalDebit,
      totalCredit,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.totalDebit !== formData.totalCredit) {
      toast.error('Debit and Credit amounts must be equal');
      return;
    }

    if (formData.ledgerEntries.length === 0) {
      toast.error('Please add at least one ledger entry');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Voucher Type</Label>
              <Select
                value={formData.voucherType}
                onValueChange={(value) => setFormData({ ...formData, voucherType: value as VoucherType })}
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
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="Optional reference"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Party Name</Label>
            <Input
              value={formData.partyName}
              onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
              placeholder="Customer/Supplier name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Narration</Label>
            <Textarea
              value={formData.narration}
              onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
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
                    {formData.ledgerEntries.map((entry, index) => (
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
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={2} className="px-4 py-3 text-right font-semibold">Totals:</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        Debit: {formData.totalDebit.toLocaleString()} | Credit: {formData.totalCredit.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formData.totalDebit !== formData.totalCredit}>
              Add Voucher
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};