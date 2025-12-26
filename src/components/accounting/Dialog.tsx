import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, Edit2, Trash2, Save, X } from 'lucide-react';
import { Ledger, LedgerGroup } from '@/types/accounting';
import { toast } from 'sonner';

interface LedgerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; group: LedgerGroup; openingBalance: number }) => void;
  initialData?: { name: string; group: LedgerGroup; openingBalance: number };
  title: string;
}

export const LedgerDialog: React.FC<LedgerDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) => {
  const [formData, setFormData] = React.useState(
    initialData || {
      name: '',
      group: 'Current Assets' as LedgerGroup,
      openingBalance: 0,
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        group: 'Current Assets' as LedgerGroup,
        openingBalance: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter ledger name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Account Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter ledger name"
            />
          </div>
          <div className="space-y-2">
            <Label>Account Group</Label>
            <Select
              value={formData.group}
              onValueChange={(value) => setFormData({ ...formData, group: value as LedgerGroup })}
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
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Ledger</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};