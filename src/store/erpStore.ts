import { create } from 'zustand';
import { Product, Purchase, Sale } from '@/types/erp';
import { supabase } from '@/integrations/supabase/client';
import { fetchProductsApi, addProductApi, updateProductApi, deleteProductApi, fetchPurchasesApi, addPurchaseApi, deletePurchaseApi, fetchSalesApi, addSaleApi, deleteSaleApi, } from '@/integrations/supabase/erpApi';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface ERPState {
  products: Product[];
  purchases: Purchase[];
  sales: Sale[];
  loading: boolean;
  // Fetch data
  fetchProducts: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Purchase actions
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => Promise<void>;
  // updatePurchase: (id: string, updates: Partial<Purchase>) => Promise<void>; // Not currently used in UI
  deletePurchase: (id: string) => Promise<void>;
  // Sale actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  // updateSale: (id: string, updates: Partial<Sale>) => Promise<void>; // Not currently used in UI
  deleteSale: (id: string) => Promise<void>;
}

export const useERPStore = create<ERPState>((set, get) => ({
  products: [],
  purchases: [],
  sales: [],
  loading: false,
  
  // Fetch products from Supabase
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const products = await fetchProductsApi(user.id);
      set({ products, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
      set({ loading: false });
    }
  },
  
  // Fetch purchases from Supabase
  fetchPurchases: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const purchases = await fetchPurchasesApi(user.id);
      set({ purchases, loading: false });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchases. Please try again.');
      set({ loading: false });
    }
  },
  
  // Fetch sales from Supabase
  fetchSales: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const sales = await fetchSalesApi(user.id);
      set({ sales, loading: false });
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales. Please try again.');
      set({ loading: false });
    }
  },
  
  // Fetch all data
  fetchAllData: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const [products, purchases, sales] = await Promise.all([
        fetchProductsApi(user.id),
        fetchPurchasesApi(user.id),
        fetchSalesApi(user.id),
      ]);
      
      set({ products, purchases, sales, loading: false });
    } catch (error) {
      console.error('Error fetching all data:', error);
      toast.error('Failed to load data. Please try again.');
      set({ loading: false });
    }
  },
  
  // Product actions
  addProduct: async (product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const newProductData: TablesInsert<'products'> = {
        product_id: product.productId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        purchase_rate: product.purchaseRate,
        selling_rate: product.sellingRate,
        gst_percent: product.gstPercent,
        opening_stock: product.openingStock,
        reorder_level: product.reorderLevel,
        user_id: user.id,
      };
      
      const newProduct = await addProductApi(newProductData);
      set((state) => ({ products: [newProduct, ...state.products] }));
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
      throw error;
    }
  },
  
  updateProduct: async (id, updates) => {
    try {
      const dbUpdates: TablesUpdate<'products'> = {};
      if (updates.productId) dbUpdates.product_id = updates.productId;
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.brand) dbUpdates.brand = updates.brand;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.purchaseRate !== undefined) dbUpdates.purchase_rate = updates.purchaseRate;
      if (updates.sellingRate !== undefined) dbUpdates.selling_rate = updates.sellingRate;
      if (updates.gstPercent !== undefined) dbUpdates.gst_percent = updates.gstPercent;
      if (updates.openingStock !== undefined) dbUpdates.opening_stock = updates.openingStock;
      if (updates.reorderLevel !== undefined) dbUpdates.reorder_level = updates.reorderLevel;
      
      await updateProductApi(id, dbUpdates);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
      }));
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      await deleteProductApi(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
      throw error;
    }
  },
  
  // Purchase actions
  addPurchase: async (purchase) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const newPurchaseData: TablesInsert<'purchases'> = {
        invoice_no: purchase.invoiceNo,
        supplier: purchase.supplier,
        product_id: purchase.productId,
        quantity: purchase.quantity,
        purchase_rate: purchase.purchaseRate,
        total_value: purchase.totalValue,
        gst_amount: purchase.gstAmount,
        grand_total: purchase.grandTotal,
        date: purchase.date.toISOString().split('T')[0],
        user_id: user.id,
      };
      
      const newPurchase = await addPurchaseApi(newPurchaseData);
      set((state) => ({ purchases: [newPurchase, ...state.purchases] }));
      toast.success('Purchase recorded successfully - Stock updated');
    } catch (error) {
      console.error('Error adding purchase:', error);
      toast.error('Failed to record purchase. Please try again.');
      throw error;
    }
  },
  
  deletePurchase: async (id) => {
    try {
      await deletePurchaseApi(id);
      set((state) => ({
        purchases: state.purchases.filter((p) => p.id !== id),
      }));
      toast.success('Purchase deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error('Failed to delete purchase. Please try again.');
      throw error;
    }
  },
  
  // Sale actions
  addSale: async (sale) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const newSaleData: TablesInsert<'sales'> = {
        invoice_no: sale.invoiceNo,
        customer: sale.customer,
        product_id: sale.productId,
        quantity: sale.quantity,
        selling_rate: sale.sellingRate,
        total_value: sale.totalValue,
        gst_amount: sale.gstAmount,
        grand_total: sale.grandTotal,
        date: sale.date.toISOString().split('T')[0],
        user_id: user.id,
      };
      
      const newSale = await addSaleApi(newSaleData);
      set((state) => ({ sales: [newSale, ...state.sales] }));
      toast.success('Sale recorded successfully - Stock updated');
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to record sale. Please try again.');
      throw error;
    }
  },
  
  deleteSale: async (id) => {
    try {
      await deleteSaleApi(id);
      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
      }));
      toast.success('Sale deleted successfully');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale. Please try again.');
      throw error;
    }
  },
}));