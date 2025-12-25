import React from 'react';
import { Purchase, Sale, Product } from '@/types/erp';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface ErpDocumentPdfProps {
  documentType: 'purchase' | 'sale';
  invoiceData: Purchase[] | Sale[];
  productsMap: Map<string, Product>;
}

export const ErpDocumentPdf = React.forwardRef<HTMLDivElement, ErpDocumentPdfProps>(
  ({ documentType, invoiceData, productsMap }, ref) => {
    if (!invoiceData || invoiceData.length === 0) {
      return <div ref={ref}>No data available for this document.</div>;
    }

    const firstItem = invoiceData[0];
    const invoiceNo = firstItem.invoiceNo;
    const date = firstItem.date;
    const isPurchase = documentType === 'purchase';
    
    // For purchases
    const supplier = isPurchase ? (firstItem as Purchase).supplier : '';
    // For sales
    const customer = !isPurchase ? (firstItem as Sale).customer : '';

    let totalSubtotal = 0;
    let totalGstAmount = 0;
    let totalGrandTotal = 0;

    return (
      <div ref={ref} className="p-8 bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-lg">
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">StockFlow ERP</h1>
            <p className="text-sm text-gray-600">Distribution Management System</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold">{isPurchase ? 'PURCHASE ORDER' : 'TAX INVOICE'}</h2>
            <p className="text-sm text-gray-700">Invoice No: <span className="font-medium">{invoiceNo}</span></p>
            <p className="text-sm text-gray-700">Date: <span className="font-medium">{formatDate(date)}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{isPurchase ? 'Supplier:' : 'Bill To:'}</h3>
            <p className="font-medium">{isPurchase ? supplier : customer}</p>
            <p className="text-sm text-gray-600">Address Line 1</p>
            <p className="text-sm text-gray-600">Address Line 2</p>
            <p className="text-sm text-gray-600">City, State - ZIP</p>
            {isPurchase && <p className="text-sm text-gray-600">GSTIN: XXXXXXXXXXXXXXX</p>}
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{isPurchase ? 'Shipped To:' : 'Shipped From:'}</h3>
            <p className="font-medium">Your Company Name</p>
            <p className="text-sm text-gray-600">Your Company Address Line 1</p>
            <p className="text-sm text-gray-600">Your Company Address Line 2</p>
            <p className="text-sm text-gray-600">City, State - ZIP</p>
            {!isPurchase && <p className="text-sm text-gray-600">GSTIN: XXXXXXXXXXXXXXX</p>}
          </div>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">S.No</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">Rate</th>
              <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">Qty</th>
              <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">GST %</th>
              <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((item, index) => {
              const product = productsMap.get(item.productId);
              const gstRate = product?.gstPercent || 0;
              
              // For purchases
              const purchaseRate = isPurchase ? (item as Purchase).purchaseRate : 0;
              // For sales
              const sellingRate = !isPurchase ? (item as Sale).sellingRate : 0;
              
              const rate = isPurchase ? purchaseRate : sellingRate;
              const quantity = item.quantity;
              const itemTotal = rate * quantity;
              const itemGstAmount = (itemTotal * gstRate) / 100;
              const itemGrandTotal = itemTotal + itemGstAmount;

              totalSubtotal += itemTotal;
              totalGstAmount += itemGstAmount;
              totalGrandTotal += itemGrandTotal;

              return (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-sm">{index + 1}</td>
                  <td className="py-2 px-4 text-sm font-medium">{product?.name || 'N/A'} ({item.productId})</td>
                  <td className="py-2 px-4 text-right text-sm tabular-nums">{formatCurrency(rate)}</td>
                  <td className="py-2 px-4 text-right text-sm tabular-nums">{quantity}</td>
                  <td className="py-2 px-4 text-right text-sm tabular-nums">{gstRate}%</td>
                  <td className="py-2 px-4 text-right text-sm tabular-nums">{formatCurrency(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm text-gray-700">Subtotal:</span>
              <span className="text-sm font-medium tabular-nums">{formatCurrency(totalSubtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm text-gray-700">Total GST:</span>
              <span className="text-sm font-medium tabular-nums">{formatCurrency(totalGstAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-gray-300 mt-2">
              <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
              <span className="text-lg font-bold text-primary tabular-nums">{formatCurrency(totalGrandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-200">
          <p>Thank you for your business!</p>
          <p>This is a computer generated document and does not require a signature.</p>
        </div>
      </div>
    );
  }
);

ErpDocumentPdf.displayName = "ErpDocumentPdf";