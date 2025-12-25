# StockFlow ERP - Supabase Setup Guide

## Overview
Your ERP system is now fully integrated with Supabase for authentication and data persistence. This guide will help you complete the setup.

## Step 1: Apply Database Migration

You need to apply the database schema to your Supabase project. The migration file has been created at `migration.sql`.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/trvjuxwulzursylufoqv
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the `migration.sql` file in your project and copy its entire contents
5. Paste the SQL into the query editor
6. Click **Run** or press Ctrl+Enter (Cmd+Enter on Mac)
7. Wait for the confirmation message

### Option B: Using psql (Advanced)

If you have psql installed:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.trvjuxwulzursylufoqv.supabase.co:5432/postgres" -f migration.sql
```

## Step 2: Verify Database Setup

After applying the migration, verify the tables were created:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see three new tables:
   - `products`
   - `purchases`
   - `sales`
3. Click on each table to verify the columns are present

## Step 3: Enable Email/Password Authentication

1. In Supabase Dashboard, go to **Authentication > Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates (optional but recommended)
4. Disable email confirmation for testing (Settings > Auth > Email Auth > Confirm email = OFF)

## Step 4: Test the Application

### Create Your First User

1. Start the development server (if not already running):
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:8080/signup

3. Create a new account with:
   - Email: your-email@example.com
   - Password: (minimum 6 characters)

4. After signup, you'll be redirected to login

5. Sign in with your credentials

### Test Data Operations

Once logged in:

1. **Add Products**: Go to Products page and add sample products
2. **Record Purchases**: Go to Purchases page and add inward stock
3. **Record Sales**: Go to Sales page and create sales entries
4. **View Reports**: Check Dashboard, Stock, and Profit & Loss pages

## What's Been Implemented

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes (redirects to login if not authenticated)
- Automatic session management
- Logout functionality

### Database Schema
- **Products Table**: Master product catalog with pricing and stock info
- **Purchases Table**: All inward stock transactions
- **Sales Table**: All outward sales transactions
- Row Level Security (RLS): Users can only see their own data
- Foreign key constraints for data integrity
- Indexed columns for fast queries

### Data Operations
- All CRUD operations now use Supabase
- Real-time data fetching from database
- Automatic user_id association
- Snake_case to camelCase conversion for TypeScript

### Store Updates
- Zustand store now integrated with Supabase
- Async methods for all data operations
- Proper error handling
- Loading states

## Environment Variables

Your `.env` file is already configured with:

```env
VITE_SUPABASE_URL=https://trvjuxwulzursylufoqv.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

These are used automatically by the application.

## Database Structure

### Products Table
```sql
- id: uuid (primary key)
- product_id: text (unique, e.g., "PRD001")
- name: text
- brand: text
- category: text
- purchase_rate: numeric
- selling_rate: numeric
- gst_percent: numeric
- opening_stock: integer
- reorder_level: integer
- user_id: uuid (foreign key to auth.users)
- created_at: timestamp
- updated_at: timestamp
```

### Purchases Table
```sql
- id: uuid (primary key)
- invoice_no: text
- supplier: text
- product_id: text (foreign key to products)
- quantity: integer
- purchase_rate: numeric
- total_value: numeric
- gst_amount: numeric
- grand_total: numeric
- date: date
- user_id: uuid (foreign key to auth.users)
- created_at: timestamp
```

### Sales Table
```sql
- id: uuid (primary key)
- invoice_no: text
- customer: text
- product_id: text (foreign key to products)
- quantity: integer
- selling_rate: numeric
- total_value: numeric
- gst_amount: numeric
- grand_total: numeric
- date: date
- user_id: uuid (foreign key to auth.users)
- created_at: timestamp
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only SELECT their own data
- Users can only INSERT data with their user_id
- Users can only UPDATE their own data
- Users can only DELETE their own data

### Data Isolation
Each user's data is completely isolated through user_id filtering, ensuring multi-tenant security.

## Common Issues & Solutions

### Issue: "Failed to fetch" error on login
**Solution**: Make sure the migration has been applied and auth is enabled in Supabase.

### Issue: No data showing after login
**Solution**: Add some products first. The system starts with an empty database.

### Issue: "Not authenticated" errors
**Solution**: Make sure you're logged in. Session cookies should persist automatically.

### Issue: Foreign key constraint errors
**Solution**: Make sure products exist before creating purchases/sales that reference them.

## Next Steps

1. **Apply the migration** using Step 1 above
2. **Create your first user account** via the signup page
3. **Add products** to get started
4. **Test the complete workflow**: Products → Purchases → Sales → Reports

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase Dashboard logs
3. Verify all migration steps were completed
4. Ensure environment variables are correct

## Production Checklist

Before deploying to production:
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Configure custom SMTP for email delivery
- [ ] Set up custom domain (optional)
- [ ] Review and adjust RLS policies if needed
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Test all CRUD operations thoroughly
- [ ] Add indexes for frequently queried columns

Your ERP system is now ready to use with Supabase backend!
