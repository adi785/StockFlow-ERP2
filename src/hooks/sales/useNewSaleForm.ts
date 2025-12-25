import { useState, useMemo } from 'react';
import { useERPStore } from '@/store/erpStore';
import { getProductById, getAvailableStock } from '@/lib/erpCalculations';
import { generateInvoiceNo } from '@/lib/formatters';
import { toast } from 'sonner';
import { Product, Purchase, Sale } from '@/types/erp';

interface UseNewSaleFormProps {
  sales: Sale[];
  products: Product[];
  purchases: Purchase[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  onSuccess: () => void;
}

export const useNewSaleForm = ({ sales, products, purchases, addSale, onSuccess }: UseNewSaleFormProps) => {
  const [newSale, setNewSale] = useState({
    invoiceNo: generateInvoiceNo('SAL', sales.length + 1),
    customer: '',
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const selectedProduct = useMemo(
    () => (newSale.productId ? getProductById(products, newSale.productId) : null),
    [products, newSale.productId]
  );

  const availableStock = useMemo(
    () => (newSale.productId ? getAvailableStock(products, purchases, sales, newSale.productId) : 0),
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

  const handleAddSale = async () => {
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

    try {
      await addSale({
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

      toast.success('Sale recorded successfully - Stock updated');
      onSuccess(); // Close dialog and reset form

      // Generate next invoice number
      setNewSale({
        invoiceNo: generateInvoiceNo('SAL', sales.length + 2),
        customer: '',
        productId: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to record sale. Please try again.');
    }
  };

  return {
    newSale,
    setNewSale,
    selectedProduct,
    availableStock,
    calculatedValues,
    isQuantityValid,
    handleAddSale,
  };
};