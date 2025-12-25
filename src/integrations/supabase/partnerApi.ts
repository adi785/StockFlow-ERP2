import { supabase } from './client';
import { TablesInsert, TablesUpdate } from './types';

// --- Customers API ---

export interface Customer {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  openingBalance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchCustomersApi = async (userId: string): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    contactPerson: c.contact_person,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    pincode: c.pincode,
    gstin: c.gstin,
    openingBalance: c.opening_balance,
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
  }));
};

export const addCustomerApi = async (customer: TablesInsert<'customers'>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    contactPerson: data.contact_person,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    gstin: data.gstin,
    openingBalance: data.opening_balance,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

export const updateCustomerApi = async (id: string, updates: TablesUpdate<'customers'>): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteCustomerApi = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// --- Suppliers API ---

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  openingBalance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchSuppliersApi = async (userId: string): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((s) => ({
    id: s.id,
    name: s.name,
    contactPerson: s.contact_person,
    email: s.email,
    phone: s.phone,
    address: s.address,
    city: s.city,
    state: s.state,
    pincode: s.pincode,
    gstin: s.gstin,
    openingBalance: s.opening_balance,
    createdAt: new Date(s.created_at),
    updatedAt: new Date(s.updated_at),
  }));
};

export const addSupplierApi = async (supplier: TablesInsert<'suppliers'>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    contactPerson: data.contact_person,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    gstin: data.gstin,
    openingBalance: data.opening_balance,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

export const updateSupplierApi = async (id: string, updates: TablesUpdate<'suppliers'>): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteSupplierApi = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};