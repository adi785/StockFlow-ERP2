import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Product, Purchase, Sale } from '@/types/erp';
import { getAvailableStock } from '@/lib/erpCalculations';
import { Customer } from '@/integrations/supabase/partnerApi';

interface AddSaleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newSale: {
    invoiceNo: string;
    customer: string;
    productId: string;
    quantity: number;
    date: string;
  };
  setNewSale: React.Dispatch<
    React.SetStateAction<{
      invoiceNo: string;
      customer: string;
      productId: string;
      quantity: number;
      date: string;
    }>
  >;
  products: Product[];
  purchases: Purchase[];
  sales: Sale[];
  selectedProduct: Product | null;
  availableStock: number;
  calculatedValues: {
    sellingRate: number;
    totalValue: number;
    gstAmount: number;
    grandTotal: number;
  };
  isQuantityValid: boolean;
  handleAddSale: () => void;
  customers: Customer[]; // Add customers prop
}

export const AddSaleDialog: React.FC<AddSaleDialogProps> = ({
  isOpen,
  onOpenChange,
  newSale,
  setNewSale,
  products,
  purchases,
  sales,
  selectedProduct,
  availableStock,
  calculatedValues,
  isQuantityValid,
  handleAddSale,
  customers, // Destructure customers
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Sale Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice No</Label>
              <Input
                value={newSale.invoiceNo}
                onChange={(e) => setNewSale({ ...newSale, invoiceNo: e.target.value })}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Customer *</Label>
            <Select
              value={newSale.customer}
              onValueChange={(value) => setNewSale({ ...newSale, customer: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Product *</Label>
            <Select
              value={newSale.productId}
              onValueChange={(value) => setNewSale({ ...newSale, productId: value, quantity: 0 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => {
                  const stock = getAvailableStock(products, purchases, sales, p.productId);
                  return (
                    <SelectItem key={p.productId} value={p.productId} disabled={stock <= 0}>
                      {p.productId} - {p.name} (Stock: {stock})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {selectedProduct && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Product:</span>{' '}
                  <span className="font-medium">{selectedProduct.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Brand:</span>{' '}
                  <span className="font-medium">{selectedProduct.brand}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Selling Rate:</span>{' '}
                  <span className="font-semibold text-green-600">
                    {formatCurrency(selectedProduct.sellingRate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available Stock:</span>{' '}
                  <span className={`font-semibold ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {availableStock} units
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Quantity *</Label>
            <Input
              type="number"
              value={newSale.quantity || ''}
              onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value) || 0 })}
              placeholder="Enter quantity"
              max={availableStock}
            />
            {newSale.quantity > availableStock && availableStock > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Quantity exceeds available stock ({availableStock} units)
              </div>
            )}
          </div>
          {selectedProduct && newSale.quantity > 0 && (
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200"> Calculated Values </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Subtotal:</span>{' '}
                  <span className="font-medium"> {formatCurrency(calculatedValues.totalValue)} </span>
                </div>
                <div>
                  <span className="text-muted-foreground">GST Amount:</span>{' '}
                  <span className="font-medium"> {formatCurrency(calculatedValues.gstAmount)} </span>
                </div>
                <div className="col-span-2 border-t border-green-200 pt-2 mt-2 dark:border-green-800">
                  <span className="text-muted-foreground">Grand Total:</span>{' '}
                  <span className="text-lg font-bold text-green-600">
                    {' '}
                    {formatCurrency(calculatedValues.grandTotal)}{' '}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {' '}
            Cancel{' '}
          </Button>
          <Button onClick={handleAddSale} disabled={!isQuantityValid}>
            Record Sale
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};