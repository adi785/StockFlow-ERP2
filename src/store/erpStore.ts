import { create } from 'zustand';
import { Product, Purchase, Sale, StockItem, ProfitLossItem, DashboardStats } from '@/types/erp';
import { supabase } from '@/lib/supabase';

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
  updatePurchase: (id: string, updates: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;

  // Sale actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
}

// Helper functions (not in store to avoid re-render issues)
export const getProductById = (products: Product[], productId: string): Product | undefined => {
  return products.find((p) => p.productId === productId);
};

export const getAvailableStock = (
  products: Product[],
  purchases: Purchase[],
  sales: Sale[],
  productId: string
): number => {
  const product = products.find((p) => p.productId === productId);
  if (!product) return 0;
  
  const totalPurchased = purchases
    .filter((p) => p.productId === productId)
    .reduce((sum, p) => sum + p.quantity, 0);
  
  const totalSold = sales
    .filter((s) => s.productId === productId)
    .reduce((sum, s) => sum + s.quantity, 0);
  
  return product.openingStock + totalPurchased - totalSold;
};

export const computeStockItems = (
  products: Product[],
  purchases: Purchase[],
  sales: Sale[]
): StockItem[] => {
  return products.map((product) => {
    const totalPurchased = purchases
      .filter((p) => p.productId === product.productId)
      .reduce((sum, p) => sum + p.quantity, 0);
    
    const totalSold = sales
      .filter((s) => s.productId === product.productId)
      .reduce((sum, s) => sum + s.quantity, 0);
    
    const currentStock = product.openingStock + totalPurchased - totalSold;
    
    let status: 'in-stock' | 'low-stock' | 'out-of-stock';
    if (currentStock <= 0) {
      status = 'out-of-stock';
    } else if (currentStock <= product.reorderLevel) {
      status = 'low-stock';
    } else {
      status = 'in-stock';
    }
    
    return {
      productId: product.productId,
      productName: product.name,
      brand: product.brand,
      openingStock: product.openingStock,
      totalPurchased,
      totalSold,
      currentStock,
      reorderLevel: product.reorderLevel,
      status,
    };
  });
};

export const computeProfitLossItems = (
  products: Product[],
  purchases: Purchase[],
  sales: Sale[]
): ProfitLossItem[] => {
  return products.map((product) => {
    const totalPurchaseValue = purchases
      .filter((p) => p.productId === product.productId)
      .reduce((sum, p) => sum + p.totalValue, 0);
    
    const totalSalesValue = sales
      .filter((s) => s.productId === product.productId)
      .reduce((sum, s) => sum + s.totalValue, 0);
    
    const profit = totalSalesValue - totalPurchaseValue;
    const profitMargin = totalSalesValue > 0 ? (profit / totalSalesValue) * 100 : 0;
    
    return {
      productId: product.productId,
      productName: product.name,
      totalPurchaseValue,
      totalSalesValue,
      profit,
      profitMargin,
    };
  });
};

export const computeDashboardStats = (
  products: Product[],
  stockItems: StockItem[],
  profitLossItems: ProfitLossItem[]
): DashboardStats => {
  const totalPurchaseValue = profitLossItems.reduce((sum, p) => sum + p.totalPurchaseValue, 0);
  const totalSalesValue = profitLossItems.reduce((sum, p) => sum + p.totalSalesValue, 0);
  const totalProfit = totalSalesValue - totalPurchaseValue;
  
  const lowStockCount = stockItems.filter((s) => s.status === 'low-stock').length;
  const outOfStockCount = stockItems.filter((s) => s.status === 'out-of-stock').length;
  
  return {
    totalProducts: products.length,
    totalPurchaseValue,
    totalSalesValue,
    totalProfit,
    lowStockCount,
    outOfStockCount,
  };
};

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

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({
        products: (data || []).map((p) => ({
          ...p,
          createdAt: new Date(p.created_at),
          updatedAt: new Date(p.updated_at),
        })),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ loading: false });
    }
  },

  // Fetch purchases from Supabase
  fetchPurchases: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      set({
        purchases: (data || []).map((p) => ({
          ...p,
          date: new Date(p.date),
          createdAt: new Date(p.created_at),
        })),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      set({ loading: false });
    }
  },

  // Fetch sales from Supabase
  fetchSales: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      set({
        sales: (data || []).map((s) => ({
          ...s,
          date: new Date(s.date),
          createdAt: new Date(s.created_at),
        })),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      set({ loading: false });
    }
  },

  // Fetch all data
  fetchAllData: async () => {
    await get().fetchProducts();
    await get().fetchPurchases();
    await get().fetchSales();
  },

  // Product actions
  addProduct: async (product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert([{
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
        }])
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        productId: data.product_id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        purchaseRate: data.purchase_rate,
        sellingRate: data.selling_rate,
        gstPercent: data.gst_percent,
        openingStock: data.opening_stock,
        reorderLevel: data.reorder_level,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set((state) => ({ products: [newProduct, ...state.products] }));
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const dbUpdates: any = {};
      if (updates.productId) dbUpdates.product_id = updates.productId;
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.brand) dbUpdates.brand = updates.brand;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.purchaseRate !== undefined) dbUpdates.purchase_rate = updates.purchaseRate;
      if (updates.sellingRate !== undefined) dbUpdates.selling_rate = updates.sellingRate;
      if (updates.gstPercent !== undefined) dbUpdates.gst_percent = updates.gstPercent;
      if (updates.openingStock !== undefined) dbUpdates.opening_stock = updates.openingStock;
      if (updates.reorderLevel !== undefined) dbUpdates.reorder_level = updates.reorderLevel;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Purchase actions
  addPurchase: async (purchase) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('purchases')
        .insert([{
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
        }])
        .select()
        .single();

      if (error) throw error;

      const newPurchase: Purchase = {
        id: data.id,
        invoiceNo: data.invoice_no,
        supplier: data.supplier,
        productId: data.product_id,
        quantity: data.quantity,
        purchaseRate: data.purchase_rate,
        totalValue: data.total_value,
        gstAmount: data.gst_amount,
        grandTotal: data.grand_total,
        date: new Date(data.date),
        createdAt: new Date(data.created_at),
      };

      set((state) => ({ purchases: [newPurchase, ...state.purchases] }));
    } catch (error) {
      console.error('Error adding purchase:', error);
      throw error;
    }
  },

  updatePurchase: async (id, updates) => {
    try {
      const dbUpdates: any = {};
      if (updates.invoiceNo) dbUpdates.invoice_no = updates.invoiceNo;
      if (updates.supplier) dbUpdates.supplier = updates.supplier;
      if (updates.productId) dbUpdates.product_id = updates.productId;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.purchaseRate !== undefined) dbUpdates.purchase_rate = updates.purchaseRate;
      if (updates.totalValue !== undefined) dbUpdates.total_value = updates.totalValue;
      if (updates.gstAmount !== undefined) dbUpdates.gst_amount = updates.gstAmount;
      if (updates.grandTotal !== undefined) dbUpdates.grand_total = updates.grandTotal;
      if (updates.date) dbUpdates.date = updates.date.toISOString().split('T')[0];

      const { error } = await supabase
        .from('purchases')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        purchases: state.purchases.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  },

  deletePurchase: async (id) => {
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        purchases: state.purchases.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  },

  // Sale actions
  addSale: async (sale) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sales')
        .insert([{
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
        }])
        .select()
        .single();

      if (error) throw error;

      const newSale: Sale = {
        id: data.id,
        invoiceNo: data.invoice_no,
        customer: data.customer,
        productId: data.product_id,
        quantity: data.quantity,
        sellingRate: data.selling_rate,
        totalValue: data.total_value,
        gstAmount: data.gst_amount,
        grandTotal: data.grand_total,
        date: new Date(data.date),
        createdAt: new Date(data.created_at),
      };

      set((state) => ({ sales: [newSale, ...state.sales] }));
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  },

  updateSale: async (id, updates) => {
    try {
      const dbUpdates: any = {};
      if (updates.invoiceNo) dbUpdates.invoice_no = updates.invoiceNo;
      if (updates.customer) dbUpdates.customer = updates.customer;
      if (updates.productId) dbUpdates.product_id = updates.productId;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.sellingRate !== undefined) dbUpdates.selling_rate = updates.sellingRate;
      if (updates.totalValue !== undefined) dbUpdates.total_value = updates.totalValue;
      if (updates.gstAmount !== undefined) dbUpdates.gst_amount = updates.gstAmount;
      if (updates.grandTotal !== undefined) dbUpdates.grand_total = updates.grandTotal;
      if (updates.date) dbUpdates.date = updates.date.toISOString().split('T')[0];

      const { error } = await supabase
        .from('sales')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        sales: state.sales.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  },

  deleteSale: async (id) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  },
}));
