import { Product, Purchase, Sale, StockItem, ProfitLossItem, DashboardStats } from '@/types/erp';

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
      .reduce((sum, s) => sum + s.quantity * s.sellingRate, 0); // Use sellingRate from sale record
    
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