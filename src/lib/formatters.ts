import { format } from 'date-fns';

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

// Generate unique invoice number with timestamp to prevent collisions
export const generateInvoiceNo = (prefix: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
  return `${prefix}-${timestamp}`;
};

// Generate unique product ID with timestamp to prevent collisions
export const generateProductId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
  return `PRD-${timestamp}`;
};