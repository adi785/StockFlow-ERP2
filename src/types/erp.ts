// ERP Type Definitions

export interface Product {
  id: string;
  productId: string; // User-facing unique ID (e.g., "PRD001")
  name: string;
  brand: string;
  category: string;
  purchaseRate: number;
  sellingRate: number;
  gstPercent: number;
  openingStock: number;
  reorderLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  invoiceNo: string;
  supplier: string;
  productId: string;
  quantity: number;
  purchaseRate: number;
  totalValue: number;
  gstAmount: number;
  grandTotal: number;
  date: Date;
  createdAt: Date;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customer: string;
  productId: string;
  quantity: number;
  sellingRate: number;
  totalValue: number;
  gstAmount: number;
  grandTotal: number;
  date: Date;
  createdAt: Date;
}

export interface StockItem {
  productId: string;
  productName: string;
  brand: string;
  openingStock: number;
  totalPurchased: number;
  totalSold: number;
  currentStock: number;
  reorderLevel: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface ProfitLossItem {
  productId: string;
  productName: string;
  totalPurchaseValue: number;
  totalSalesValue: number;
  profit: number;
  profitMargin: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalPurchaseValue: number;
  totalSalesValue: number;
  totalProfit: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// Grid column definition for Excel-like interface
export interface GridColumn<T> {
  key: keyof T | string;
  header: string;
  width?: number;
  minWidth?: number;
  editable?: boolean;
  type?: 'text' | 'number' | 'select' | 'date' | 'currency' | 'percentage';
  options?: { value: string; label: string }[];
  render?: (value: any, row: T) => React.ReactNode;
  format?: (value: any) => string;
}
