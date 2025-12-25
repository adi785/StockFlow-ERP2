import { supabase } from './client';
import { Product, Purchase, Sale } from '@/types/erp';
import { TablesInsert, TablesUpdate } from './types';

// --- Products API ---
export const fetchProductsApi = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((p) => ({
    ...p,
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
  }));
};

export const addProductApi = async (product: TablesInsert<'products'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return {
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
};

export const updateProductApi = async (id: string, updates: TablesUpdate<'products'>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteProductApi = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// --- Purchases API ---
export const fetchPurchasesApi = async (userId: string): Promise<Purchase[]> => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data || []).map((p) => ({
    ...p,
    date: new Date(p.date),
    createdAt: new Date(p.created_at),
  }));
};

export const addPurchaseApi = async (purchase: TablesInsert<'purchases'>): Promise<Purchase> => {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return {
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
};

export const deletePurchaseApi = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// --- Sales API ---
export const fetchSalesApi = async (userId: string): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data || []).map((s) => ({
    ...s,
    date: new Date(s.date),
    createdAt: new Date(s.created_at),
  }));
};

export const addSaleApi = async (sale: TablesInsert<'sales'>): Promise<Sale> => {
  const { data, error } = await supabase
    .from('sales')
    .insert([sale])
    .select()
    .single();

  if (error) throw error;
  return {
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
};

export const deleteSaleApi = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id);

  if (error) throw error;
};