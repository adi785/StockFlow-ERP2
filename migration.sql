-- ERP Database Schema Migration
-- Apply this in Supabase Dashboard > SQL Editor

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  purchase_rate numeric NOT NULL CHECK (purchase_rate >= 0),
  selling_rate numeric NOT NULL CHECK (selling_rate >= 0),
  gst_percent numeric NOT NULL CHECK (gst_percent >= 0),
  opening_stock integer NOT NULL DEFAULT 0 CHECK (opening_stock >= 0),
  reorder_level integer NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL,
  supplier text NOT NULL,
  product_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  purchase_rate numeric NOT NULL CHECK (purchase_rate >= 0),
  total_value numeric NOT NULL CHECK (total_value >= 0),
  gst_amount numeric NOT NULL CHECK (gst_amount >= 0),
  grand_total numeric NOT NULL CHECK (grand_total >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL,
  customer text NOT NULL,
  product_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  selling_rate numeric NOT NULL CHECK (selling_rate >= 0),
  total_value numeric NOT NULL CHECK (total_value >= 0),
  gst_amount numeric NOT NULL CHECK (gst_amount >= 0),
  grand_total numeric NOT NULL CHECK (grand_total >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_product_id_fkey;
ALTER TABLE purchases ADD CONSTRAINT purchases_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT;

ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_product_id_fkey;
ALTER TABLE sales ADD CONSTRAINT sales_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can update own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can delete own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can view own sales" ON sales;
DROP POLICY IF EXISTS "Users can insert own sales" ON sales;
DROP POLICY IF EXISTS "Users can update own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON sales;

-- RLS Policies for Products
CREATE POLICY "Users can view own products" ON products FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for Purchases
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own purchases" ON purchases FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own purchases" ON purchases FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for Sales
CREATE POLICY "Users can view own sales" ON sales FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sales" ON sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sales" ON sales FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sales" ON sales FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
