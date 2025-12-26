import { create } from 'zustand';
import { 
  Ledger, 
  Voucher, 
  LedgerEntry, 
  AccountStatement, 
  TrialBalance, 
  BalanceSheet, 
  ProfitLossStatement, 
  DayBook, 
  GSTReport,
  LedgerGroup,
  VoucherType
} from '@/types/accounting';
import { supabase } from '@/integrations/supabase/client';
import { 
  createDefaultLedgers, 
  generateVoucherNumber, 
  createSalesVoucherEntries, 
  createPurchaseVoucherEntries,
  calculateTrialBalance,
  calculateProfitLossStatement,
  calculateBalanceSheet,
  calculateDayBook,
  calculateGSTReport
} from '@/lib/accountingCalculations';
import { Sales, Purchases } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface AccountingState {
  ledgers: Ledger[];
  vouchers: Voucher[];
  loading: boolean;
  
  // Fetch data
  fetchLedgers: () => Promise<void>;
  fetchVouchers: () => Promise<void>;
  fetchAllAccountingData: () => Promise<void>;
  
  // Ledger actions
  addLedger: (ledger: Omit<Ledger, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLedger: (id: string, updates: Partial<Ledger>) => Promise<void>;
  deleteLedger: (id: string) => Promise<void>;
  
  // Voucher actions
  addVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVoucher: (id: string, updates: Partial<Voucher>) => Promise<void>;
  deleteVoucher: (id: string) => Promise<void>;
  
  // Accounting reports
  getAccountStatement: (ledgerId: string, startDate: Date, endDate: Date) => AccountStatement;
  getTrialBalance: () => TrialBalance[];
  getProfitLossStatement: (startDate: Date, endDate: Date) => ProfitLossStatement;
  getBalanceSheet: (startDate: Date, endDate: Date) => BalanceSheet;
  getDayBook: (date: Date) => DayBook;
  getGSTReport: (startDate: Date, endDate: Date) => GSTReport;
  
  // Utility functions
  getLedgerById: (id: string) => Ledger | undefined;
  getLedgerByName: (name: string) => Ledger | undefined;
  getVouchersByType: (type: VoucherType) => Voucher[];
  getVouchersByDateRange: (startDate: Date, endDate: Date) => Voucher[];
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  ledgers: [],
  vouchers: [],
  loading: false,
  
  // Fetch ledgers from Supabase
  fetchLedgers: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('ledgers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ledgers: Ledger[] = (data || []).map(l => ({
        id: l.id,
        name: l.name,
        group: l.group as LedgerGroup,
        openingBalance: l.opening_balance,
        currentBalance: l.current_balance,
        createdAt: new Date(l.created_at),
        updatedAt: new Date(l.updated_at),
      }));
      
      set({ ledgers, loading: false });
      
      // If no ledgers exist, create default ones
      if (ledgers.length === 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const defaultLedgers = createDefaultLedgers('My Business');
          await Promise.all(
            defaultLedgers.map(async (ledger) => {
              const { data, error } = await supabase
                .from('ledgers')
                .insert([{
                  ...ledger,
                  user_id: currentUser.id
                }])
                .select()
                .single();
              
              if (error) throw error;
              
              return {
                id: data.id,
                name: data.name,
                group: data.group,
                openingBalance: data.opening_balance,
                currentBalance: data.current_balance,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
              };
            })
          );
          
          // Refetch ledgers
          get().fetchLedgers();
        }
      }
    } catch (error) {
      console.error('Error fetching ledgers:', error);
      toast.error('Failed to load ledgers. Please try again.');
      set({ loading: false });
    }
  },
  
  // Fetch vouchers from Supabase
  fetchVouchers: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const vouchers: Voucher[] = (data || []).map(v => ({
        id: v.id,
        voucherType: v.voucher_type as VoucherType,
        voucherNumber: v.voucher_number,
        date: new Date(v.date),
        referenceNumber: v.reference_number,
        narration: v.narration,
        partyName: v.party_name,
        ledgerEntries: v.ledger_entries || [],
        totalDebit: v.total_debit,
        totalCredit: v.total_credit,
        createdAt: new Date(v.created_at),
        updatedAt: new Date(v.updated_at),
      }));
      
      set({ vouchers, loading: false });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load vouchers. Please try again.');
      set({ loading: false });
    }
  },
  
  // Fetch all accounting data
  fetchAllAccountingData: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const [ledgersData, vouchersData] = await Promise.all([
        supabase.from('ledgers').select('*').eq('user_id', user.id),
        supabase.from('vouchers').select('*').eq('user_id', user.id),
      ]);
      
      if (ledgersData.error) throw ledgersData.error;
      if (vouchersData.error) throw vouchersData.error;
      
      const ledgers: Ledger[] = (ledgersData.data || []).map(l => ({
        id: l.id,
        name: l.name,
        group: l.group as LedgerGroup,
        openingBalance: l.opening_balance,
        currentBalance: l.current_balance,
        createdAt: new Date(l.created_at),
        updatedAt: new Date(l.updated_at),
      }));
      
      const vouchers: Voucher[] = (vouchersData.data || []).map(v => ({
        id: v.id,
        voucherType: v.voucher_type as VoucherType,
        voucherNumber: v.voucher_number,
        date: new Date(v.date),
        referenceNumber: v.reference_number,
        narration: v.narration,
        partyName: v.party_name,
        ledgerEntries: v.ledger_entries || [],
        totalDebit: v.total_debit,
        totalCredit: v.total_credit,
        createdAt: new Date(v.created_at),
        updatedAt: new Date(v.updated_at),
      }));
      
      set({ ledgers, vouchers, loading: false });
      
      // Create default ledgers if none exist
      if (ledgers.length === 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const defaultLedgers = createDefaultLedgers('My Business');
          await Promise.all(
            defaultLedgers.map(async (ledger) => {
              const { data, error } = await supabase
                .from('ledgers')
                .insert([{
                  ...ledger,
                  user_id: currentUser.id
                }])
                .select()
                .single();
              
              if (error) throw error;
            })
          );
          
          // Refetch ledgers
          get().fetchLedgers();
        }
      }
    } catch (error) {
      console.error('Error fetching accounting data:', error);
      toast.error('Failed to load accounting data. Please try again.');
      set({ loading: false });
    }
  },
  
  // Add ledger
  addLedger: async (ledger) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('ledgers')
        .insert([{
          name: ledger.name,
          group: ledger.group,
          opening_balance: ledger.openingBalance,
          current_balance: ledger.currentBalance,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newLedger: Ledger = {
        id: data.id,
        name: data.name,
        group: data.group,
        openingBalance: data.opening_balance,
        currentBalance: data.current_balance,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      set((state) => ({ ledgers: [newLedger, ...state.ledgers] }));
      toast.success('Ledger added successfully');
    } catch (error) {
      console.error('Error adding ledger:', error);
      toast.error('Failed to add ledger. Please try again.');
      throw error;
    }
  },
  
  // Update ledger
  updateLedger: async (id, updates) => {
    try {
      const updatesData: any = {};
      if (updates.name) updatesData.name = updates.name;
      if (updates.group) updatesData.group = updates.group;
      if (updates.openingBalance !== undefined) updatesData.opening_balance = updates.openingBalance;
      if (updates.currentBalance !== undefined) updatesData.current_balance = updates.currentBalance;
      
      const { error } = await supabase
        .from('ledgers')
        .update(updatesData)
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        ledgers: state.ledgers.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l)
      }));
      toast.success('Ledger updated successfully');
    } catch (error) {
      console.error('Error updating ledger:', error);
      toast.error('Failed to update ledger. Please try again.');
      throw error;
    }
  },
  
  // Delete ledger
  deleteLedger: async (id) => {
    try {
      const { error } = await supabase
        .from('ledgers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({ ledgers: state.ledgers.filter(l => l.id !== id) }));
      toast.success('Ledger deleted successfully');
    } catch (error) {
      console.error('Error deleting ledger:', error);
      toast.error('Failed to delete ledger. Please try again.');
      throw error;
    }
  },
  
  // Add voucher
  addVoucher: async (voucher) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const voucherNumber = voucher.voucherNumber || generateVoucherNumber(voucher.voucherType, get().vouchers);
      
      const { data, error } = await supabase
        .from('vouchers')
        .insert([{
          voucher_type: voucher.voucherType,
          voucher_number: voucherNumber,
          date: voucher.date.toISOString(),
          reference_number: voucher.referenceNumber,
          narration: voucher.narration,
          party_name: voucher.partyName,
          ledger_entries: voucher.ledgerEntries,
          total_debit: voucher.totalDebit,
          total_credit: voucher.totalCredit,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newVoucher: Voucher = {
        id: data.id,
        voucherType: data.voucher_type,
        voucherNumber: data.voucher_number,
        date: new Date(data.date),
        referenceNumber: data.reference_number,
        narration: data.narration,
        partyName: data.party_name,
        ledgerEntries: data.ledger_entries || [],
        totalDebit: data.total_debit,
        totalCredit: data.total_credit,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      set((state) => ({ vouchers: [newVoucher, ...state.vouchers] }));
      toast.success('Voucher added successfully');
    } catch (error) {
      console.error('Error adding voucher:', error);
      toast.error('Failed to add voucher. Please try again.');
      throw error;
    }
  },
  
  // Update voucher
  updateVoucher: async (id, updates) => {
    try {
      const updatesData: any = {};
      if (updates.voucherType) updatesData.voucher_type = updates.voucherType;
      if (updates.voucherNumber) updatesData.voucher_number = updates.voucherNumber;
      if (updates.date) updatesData.date = updates.date.toISOString();
      if (updates.referenceNumber) updatesData.reference_number = updates.referenceNumber;
      if (updates.narration) updatesData.narration = updates.narration;
      if (updates.partyName) updatesData.party_name = updates.partyName;
      if (updates.ledgerEntries) updatesData.ledger_entries = updates.ledgerEntries;
      if (updates.totalDebit !== undefined) updatesData.total_debit = updates.totalDebit;
      if (updates.totalCredit !== undefined) updatesData.total_credit = updates.totalCredit;
      
      const { error } = await supabase
        .from('vouchers')
        .update(updatesData)
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        vouchers: state.vouchers.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v)
      }));
      toast.success('Voucher updated successfully');
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error('Failed to update voucher. Please try again.');
      throw error;
    }
  },
  
  // Delete voucher
  deleteVoucher: async (id) => {
    try {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({ vouchers: state.vouchers.filter(v => v.id !== id) }));
      toast.success('Voucher deleted successfully');
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Failed to delete voucher. Please try again.');
      throw error;
    }
  },
  
  // Get account statement
  getAccountStatement: (ledgerId, startDate, endDate) => {
    const { vouchers } = get();
    // Implementation would be similar to the one in accountingCalculations
    // For now, return empty statement
    return {
      ledgerId,
      ledgerName: ledgerId,
      openingBalance: 0,
      transactions: [],
      closingBalance: 0
    };
  },
  
  // Get trial balance
  getTrialBalance: () => {
    const { ledgers, vouchers } = get();
    return calculateTrialBalance(ledgers, vouchers);
  },
  
  // Get profit and loss statement
  getProfitLossStatement: (startDate, endDate) => {
    const { ledgers, vouchers } = get();
    return calculateProfitLossStatement(ledgers, vouchers, startDate, endDate);
  },
  
  // Get balance sheet
  getBalanceSheet: (startDate, endDate) => {
    const { ledgers, vouchers } = get();
    return calculateBalanceSheet(ledgers, vouchers, startDate, endDate);
  },
  
  // Get day book
  getDayBook: (date) => {
    const { vouchers } = get();
    return calculateDayBook(vouchers, date);
  },
  
  // Get GST report
  getGSTReport: (startDate, endDate) => {
    // This would need sales and purchases data
    // For now, return empty report
    return {
      outwardTaxable: { interState: [], intraState: [] },
      inwardTaxable: { interState: [], intraState: [] },
      totalTaxPayable: 0,
      totalTaxPaid: 0,
      netTaxLiability: 0
    };
  },
  
  // Utility functions
  getLedgerById: (id) => {
    const { ledgers } = get();
    return ledgers.find(l => l.id === id);
  },
  
  getLedgerByName: (name) => {
    const { ledgers } = get();
    return ledgers.find(l => l.name.toLowerCase() === name.toLowerCase());
  },
  
  getVouchersByType: (type) => {
    const { vouchers } = get();
    return vouchers.filter(v => v.voucherType === type);
  },
  
  getVouchersByDateRange: (startDate, endDate) => {
    const { vouchers } = get();
    return vouchers.filter(v => v.date >= startDate && v.date <= endDate);
  },
}));