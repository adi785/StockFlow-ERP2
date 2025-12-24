// Currency formatter for Indian Rupees
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

// Number formatter with Indian number system
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

// Percentage formatter
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Date formatter
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Short date formatter
export const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};

// Generate unique invoice number
export const generateInvoiceNo = (prefix: string, count: number): string => {
  const year = new Date().getFullYear();
  const paddedCount = String(count).padStart(3, '0');
  return `${prefix}-${year}-${paddedCount}`;
};

// Generate unique product ID
export const generateProductId = (count: number): string => {
  const paddedCount = String(count).padStart(3, '0');
  return `PRD${paddedCount}`;
};
