import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useERPStore } from '@/store/erpStore';
import { SaleBillPdf } from '@/components/SaleBillPdf';
import { useSalesData } from '@/hooks/sales/useSalesData';
import { useNewSaleForm } from '@/hooks/sales/useNewSaleForm';
import { usePdfGenerator } from '@/hooks/sales/usePdfGenerator';
import { SalesTable } from '@/components/sales/SalesTable';
import { AddSaleDialog } from '@/components/sales/AddSaleDialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const saleSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  date: z.string().min(1, 'Date is required'),
});

type SaleFormValues = z.infer<typeof saleSchema>;

const Sales = () => {
  const addSale = useERPStore((state) => state.addSale);
  const deleteSale = useERPStore((state) => state.deleteSale);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Use custom hook for sales data management
  const { sales, products, purchases, filteredGroupedSales } = useSalesData(searchTerm);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      invoiceNo: '',
      customer: '',
      productId: '',
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
    }
  });
  
  const watchedFields = watch();
  
  // Use custom hook for new sale form logic
  const { newSale, setNewSale, selectedProduct, availableStock, calculatedValues, isQuantityValid, handleAddSale } = useNewSaleForm({
    sales,
    products,
    purchases,
    addSale,
    onSuccess: () => setIsAddDialogOpen(false),
  });
  
  // Use custom hook for PDF generation
  const { pdfContentRef, pdfInvoiceData, handleDownloadPdf } = usePdfGenerator(sales, products);
  
  const handleDelete = (id: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete sale "${invoiceNo}"?`)) {
      deleteSale(id);
    }
  };
  
  return (
    <AppLayout>
      <PageHeader
        title="Sales (Outward)"
        description="Record sales to customers"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Sale
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
            {filteredGroupedSales.length} invoices
          </div>
        </div>
        
        {/* Sales Table */}
        <SalesTable
          filteredGroupedSales={filteredGroupedSales}
          products={products}
          handleDownloadPdf={handleDownloadPdf}
          handleDelete={handleDelete}
        />
      </div>
      
      {/* Add Sale Dialog */}
      <AddSaleDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newSale={newSale}
        setNewSale={setNewSale}
        products={products}
        purchases={purchases}
        sales={sales}
        selectedProduct={selectedProduct}
        availableStock={availableStock}
        calculatedValues={calculatedValues}
        isQuantityValid={isQuantityValid}
        handleAddSale={handleAddSale}
      />
      
      {/* Hidden component for PDF generation */}
      {pdfInvoiceData && (
        <div className="absolute -left-[9999px] -top-[9999px]">
          <SaleBillPdf
            ref={pdfContentRef}
            invoiceSales={pdfInvoiceData.invoiceSales}
            productsMap={pdfInvoiceData.productsMap}
          />
        </div>
      )}
    </AppLayout>
  );
};

export default Sales;