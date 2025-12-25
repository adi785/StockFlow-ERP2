import { useState, useMemo, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useERPStore } from '@/store/erpStore';
import { getProductById, getAvailableStock } from '@/lib/erpCalculations';
import { formatCurrency, formatDate, generateInvoiceNo } from '@/lib/formatters';
import { Plus, Trash2, Search, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { customers } from '@/data/mockData';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SaleBillPdf } from '@/components/SaleBillPdf'; // Import the new component

const Sales = () => {
  const sales = useERPStore((state) => state.sales);
  const products = useERPStore((state) => state.products);
  const purchases = useERPStore((state) => state.purchases);
  const addSale = useERPStore((state) => state.addSale);
  const deleteSale = useERPStore((state) => state.deleteSale);
  const fetchAllData = useERPStore((state) => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    invoiceNo: generateInvoiceNo('SAL', sales.length + 1),
    customer: '',
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const selectedProduct = useMemo(
    () => newSale.productId ? getProductById(products, newSale.productId) : null,
    [products, newSale.productId]
  );

  const availableStock = useMemo(
    () => newSale.productId ? getAvailableStock(products, purchases, sales, newSale.productId) : 0,
    [products, purchases, sales, newSale.productId]
  );

  const calculatedValues = useMemo(() => {
    if (!selectedProduct) {
      return { sellingRate: 0, totalValue: 0, gstAmount: 0, grandTotal: 0 };
    }
    const totalValue = selectedProduct.sellingRate * newSale.quantity;
    const gstAmount = (totalValue * selectedProduct.gstPercent) / 100;
    return {
      sellingRate: selectedProduct.sellingRate,
      totalValue,
      gstAmount,
      grandTotal: totalValue + gstAmount,
    };
  }, [selectedProduct, newSale.quantity]);

  const isQuantityValid = newSale.quantity > 0 && newSale.quantity <= availableStock;

  const filteredSales = useMemo(
    () => sales.filter(
      (s) =>
        s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.productId.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [sales, searchTerm]
  );

  const handleDelete = (id: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete sale "${invoiceNo}"?`)) {
      deleteSale(id);
      toast.success('Sale deleted successfully');
    }
  };

  const handleAddSale = () => {
    if (!newSale.customer || !newSale.productId) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (newSale.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    if (newSale.quantity > availableStock) {
      toast.error(`Insufficient stock. Available: ${availableStock} units`);
      return;
    }

    addSale({
      invoiceNo: newSale.invoiceNo,
      customer: newSale.customer,
      productId: newSale.productId,
      quantity: newSale.quantity,
      sellingRate: calculatedValues.sellingRate,
      totalValue: calculatedValues.totalValue,
      gstAmount: calculatedValues.gstAmount,
      grandTotal: calculatedValues.grandTotal,
      date: new Date(newSale.date),
    });

    setIsAddDialogOpen(false);
    setNewSale({
      invoiceNo: generateInvoiceNo('SAL', sales.length + 2),
      customer: '',
      productId: '',
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Sale recorded successfully - Stock updated');
  };

  // Ref for the PDF content
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [pdfSaleData, setPdfSaleData] = useState<{ sale: Sale; product: Product | undefined } | null>(null);

  const handleDownloadPdf = async (sale: Sale) => {
    const product = getProductById(products, sale.productId);
    setPdfSaleData({ sale, product });

    // Wait for the component to render with the new data
    // A small delay might be needed for the DOM to update
    setTimeout(async () => {
      if (pdfContentRef.current) {
        const input = pdfContentRef.current;
        const canvas = await html2canvas(input, { scale: 2 }); // Increased scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Invoice_${sale.invoiceNo}.pdf`);
        toast.success(`Invoice ${sale.invoiceNo} downloaded successfully!`);
        setPdfSaleData(null); // Clear PDF data after download
      } else {
        toast.error('Failed to generate PDF. Please try again.');
      }
    }, 100); // Small delay
  };

  return (
    <AppLayout>
      <PageHeader
        title="Sales (Outward)"
        description="Record sales to customers"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        }
      />

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice, customer, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredSales.length} records
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
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Product ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold">Value</th>
                  <th className="px-4 py-3 text-right font-semibold">GST</th>
                  <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSales.map((sale) => {
                  const product = getProductById(products, sale.productId);
                  return (
                    <tr
                      key={sale.id}
                      className="grid-row hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs font-medium text-green-600">
                        {sale.invoiceNo}
                      </td>
                      <td className="px-4 py-2.5">{sale.customer}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">
                        {sale.productId}
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        {product?.name || 'Unknown Product'}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(sale.sellingRate)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                        {sale.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatCurrency(sale.totalValue)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(sale.gstAmount)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-green-600">
                        {formatCurrency(sale.grandTotal)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleDownloadPdf(sale)}
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(sale.id, sale.invoiceNo)}
                            title="Delete Sale"
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
                    {filteredSales.reduce((sum, s) => sum + s.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(
                      filteredSales.reduce((sum, s) => sum + s.totalValue, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatCurrency(
                      filteredSales.reduce((sum, s) => sum + s.gstAmount, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-green-600">
                    {formatCurrency(
                      filteredSales.reduce((sum, s) => sum + s.grandTotal, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Add Sale Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  onChange={(e) =>
                    setNewSale({ ...newSale, invoiceNo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newSale.date}
                  onChange={(e) =>
                    setNewSale({ ...newSale, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select
                value={newSale.customer}
                onValueChange={(value) =>
                  setNewSale({ ...newSale, customer: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={newSale.productId}
                onValueChange={(value) =>
                  setNewSale({ ...newSale, productId: value, quantity: 0 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => {
                    const stock = getAvailableStock(products, purchases, sales, p.productId);
                    return (
                      <SelectItem
                        key={p.productId}
                        value={p.productId}
                        disabled={stock <= 0}
                      >
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
                    <span
                      className={`font-semibold ${
                        availableStock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
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
                onChange={(e) =>
                  setNewSale({
                    ...newSale,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
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

            {selectedProduct && isQuantityValid && (
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
                <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200">
                  Calculated Values
                </h4>
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
                  <div className="col-span-2 border-t border-green-200 pt-2 mt-2 dark:border-green-800">
                    <span className="text-muted-foreground">Grand Total:</span>{' '}
                    <span className="text-lg font-bold text-green-600">
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
            <Button onClick={handleAddSale} disabled={!isQuantityValid}>
              Record Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden component for PDF generation */}
      {pdfSaleData && (
        <div className="absolute -left-[9999px] -top-[9999px]">
          <SaleBillPdf ref={pdfContentRef} sale={pdfSaleData.sale} product={pdfSaleData.product} />
        </div>
      )}
    </AppLayout>
  );
};

export default Sales;