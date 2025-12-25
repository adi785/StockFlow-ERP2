import { useEffect, useMemo, useState } from 'react';
import { useERPStore } from '@/store/erpStore';
import { Sale } from '@/types/erp';

export const useSalesData = (searchTerm: string) => {
  const sales = useERPStore((state) => state.sales);
  const products = useERPStore((state) => state.products);
  const purchases = useERPStore((state) => state.purchases);
  const fetchAllData = useERPStore((state) => state.fetchAllData);
  const loading = useERPStore((state) => state.loading);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Group sales by invoice number
  const groupedSales = useMemo(() => {
    const groups: { [key: string]: Sale[] } = {};
    sales.forEach(sale => {
      if (!groups[sale.invoiceNo]) {
        groups[sale.invoiceNo] = [];
      }
      groups[sale.invoiceNo].push(sale);
    });
    // Sort groups by date of the first sale in descending order
    return Object.values(groups).sort((a, b) => new Date(b[0].date).getTime() - new Date(a[0].date).getTime());
  }, [sales]);

  const filteredGroupedSales = useMemo(() => {
    return groupedSales.filter(
      (group) => {
        const firstSale = group[0];
        const matchesSearch =
          firstSale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firstSale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.some(item => item.productId.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
      }
    );
  }, [groupedSales, searchTerm]);

  return {
    sales,
    products,
    purchases,
    loading,
    groupedSales,
    filteredGroupedSales,
  };
};