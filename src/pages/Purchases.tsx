import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useERPStore, getProductById } from '@/store/erpStore';
import { formatCurrency, formatDate, generateInvoiceNo } from '@/lib/formatters';
import { Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { suppliers } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Purchases = () => {
  const purchases = useERPStore((state) => state.purchases);
  const products = useERPStore((state) => state.products);
  const addPurchase = useERPStore((state) => state.addPurchase);
  const deletePurchase = useERPStore((state) => state.deletePurchase);
  const fetchAllData = useERPStore((state) => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    invoiceNo: generateInvoiceNo('PUR', purchases.length + 1),
    supplier: '',
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const selectedProduct = useMemo(
    () => newPurchase.productId ? getProductById(products, newPurchase.productId) : null,
    [products, newPurchase.productId]
  );

  const calculatedValues = useMemo(() => {
    if (!selectedProduct) {
      return { purchaseRate: 0, totalValue: 0, gstAmount: 0, grandTotal: 0 };
    }
    const totalValue = selectedProduct.purchaseRate * newPurchase.quantity;
    const gstAmount = (totalValue * selectedProduct.gstPercent) / 100;
    return {
      purchaseRate: selectedProduct.purchaseRate,
      totalValue,
      gstAmount,
      grandTotal: totalValue + gstAmount,
    };
  }, [selectedProduct, newPurchase.quantity]);

  const filteredPurchases = useMemo(
    () => purchases.filter(
      (p) =>
        p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productId.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [purchases, searchTerm]
  );

  const handleDelete = (id: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete purchase "${invoiceNo}"?`)) {
      deletePurchase(id);
      toast.success('Purchase deleted successfully');
    }
  };

  const handleAddPurchase = () => {
    if (!newPurchase.supplier || !newPurchase.productId) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (newPurchase.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    addPurchase({
      invoiceNo: newPurchase.invoiceNo,
      supplier: newPurchase.supplier,
      productId: newPurchase.productId,
      quantity: newPurchase.quantity,
      purchaseRate: calculatedValues.purchaseRate,
      totalValue: calculatedValues.totalValue,
      gstAmount: calculatedValues.gstAmount,
      grandTotal: calculatedValues.grandTotal,
      date: new Date(newPurchase.date),
    });

    setIsAddDialogOpen(false);
    setNewPurchase({
      invoiceNo: generateInvoiceNo('PUR', purchases.length + 2),
      supplier: '',
      productId: '',
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Purchase recorded successfully - Stock updated');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Purchases (Inward)"
        description="Record stock purchases from suppliers"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        }
      />

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice, supplier, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPurchases.length} records
          </div>
        </div>

        {/* Data Grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Invoice No</th>
                  <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold">Product ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold">Value</th>
                  <th className="px-4 py-3 text-right font-semibold">GST</th>
                  <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
                  <th className="px-4 py-3 text-center font-semibold w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPurchases.map((purchase) => {
                  const product = getProductById(products, purchase.productId);
                  return (
                    <tr
                      key={purchase.id}
                      className="grid-row hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {formatDate(purchase.date)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs font-medium text-primary">
                        {purchase.invoiceNo}
                      </td>
                      <td className="px-4 py-2.5">{purchase.supplier}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">
                        {purchase.productId}
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        {product?.name || 'Unknown Product'}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(purchase.purchaseRate)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                        {purchase.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatCurrency(purchase.totalValue)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(purchase.gstAmount)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                        {formatCurrency(purchase.grandTotal)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleDelete(purchase.id, purchase.invoiceNo)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={6} className="px-4 py-3 text-right font-semibold">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {filteredPurchases.reduce((sum, p) => sum + p.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(
                      filteredPurchases.reduce((sum, p) => sum + p.totalValue, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(
                      filteredPurchases.reduce((sum, p) => sum + p.gstAmount, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-primary">
                    {formatCurrency(
                      filteredPurchases.reduce((sum, p) => sum + p.grandTotal, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Add Purchase Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Purchase Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice No</Label>
                <Input
                  value={newPurchase.invoiceNo}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, invoiceNo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newPurchase.date}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Select
                value={newPurchase.supplier}
                onValueChange={(value) =>
                  setNewPurchase({ ...newPurchase, supplier: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={newPurchase.productId}
                onValueChange={(value) =>
                  setNewPurchase({ ...newPurchase, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.productId} value={p.productId}>
                      {p.productId} - {p.name}
                    </SelectItem>
                  ))}
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
                    <span className="text-muted-foreground">Purchase Rate:</span>{' '}
                    <span className="font-semibold text-primary">
                      {formatCurrency(selectedProduct.purchaseRate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">GST:</span>{' '}
                    <span className="font-medium">{selectedProduct.gstPercent}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={newPurchase.quantity || ''}
                onChange={(e) =>
                  setNewPurchase({
                    ...newPurchase,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter quantity"
              />
            </div>

            {selectedProduct && newPurchase.quantity > 0 && (
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <h4 className="mb-2 font-semibold">Calculated Values</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Subtotal:</span>{' '}
                    <span className="font-medium">
                      {formatCurrency(calculatedValues.totalValue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">GST Amount:</span>{' '}
                    <span className="font-medium">
                      {formatCurrency(calculatedValues.gstAmount)}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-border pt-2 mt-2">
                    <span className="text-muted-foreground">Grand Total:</span>{' '}
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(calculatedValues.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPurchase}>Record Purchase</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Purchases;
