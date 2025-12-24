import { create } from 'zustand';
import { Product, Purchase, Sale, StockItem, ProfitLossItem, DashboardStats } from '@/types/erp';
import { initialProducts, initialPurchases, initialSales } from '@/data/mockData';

interface ERPState {
  products: Product[];
  purchases: Purchase[];
  sales: Sale[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Purchase actions
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  updatePurchase: (id: string, updates: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
  
  // Sale actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
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

export const useERPStore = create<ERPState>((set) => ({
  products: initialProducts,
  purchases: initialPurchases,
  sales: initialSales,
  
  // Product actions
  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  
  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    }));
  },
  
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
  
  // Purchase actions
  addPurchase: (purchase) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    set((state) => ({ purchases: [...state.purchases, newPurchase] }));
  },
  
  updatePurchase: (id, updates) => {
    set((state) => ({
      purchases: state.purchases.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },
  
  deletePurchase: (id) => {
    set((state) => ({
      purchases: state.purchases.filter((p) => p.id !== id),
    }));
  },
  
  // Sale actions
  addSale: (sale) => {
    const newSale: Sale = {
      ...sale,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    set((state) => ({ sales: [...state.sales, newSale] }));
  },
  
  updateSale: (id, updates) => {
    set((state) => ({
      sales: state.sales.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },
  
  deleteSale: (id) => {
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    }));
  },
}));
