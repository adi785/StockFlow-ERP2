import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import { Users, Edit2, Trash2 } from 'lucide-react';
import { Ledger } from '@/types/accounting';

interface LedgerTableProps {
  ledgers: Ledger[];
  searchTerm: string;
  onEdit: (ledger: Ledger) => void;
  onDelete: (ledger: Ledger) => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  ledgers,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  const filteredLedgers = ledgers.filter(
    (ledger) =>
      ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ledger.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
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
                          onClick={() => onEdit(ledger)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(ledger)}
                        >
                          <Trash2 className="h-4 w-4" />
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
  );
};