import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { SaleBillPdf } from '@/components/SaleBillPdf';
import { Sale, Product } from '@/types/erp';

export const usePdfGenerator = (sales: Sale[], products: Product[]) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [pdfInvoiceData, setPdfInvoiceData] = useState<{ invoiceSales: Sale[]; productsMap: Map<string, Product> } | null>(null);

  const handleDownloadPdf = async (invoiceNo: string) => {
    const salesForInvoice = sales.filter(s => s.invoiceNo === invoiceNo);
    if (salesForInvoice.length === 0) {
      toast.error('No sales found for this invoice number.');
      return;
    }

    const productsMap = new Map<string, Product>();
    products.forEach(p => productsMap.set(p.productId, p));

    setPdfInvoiceData({ invoiceSales: salesForInvoice, productsMap });

    // Wait for the component to render with the new data
    setTimeout(async () => {
      if (pdfContentRef.current) {
        const input = pdfContentRef.current;
        const canvas = await html2canvas(input, { scale: 2 }); // Increased scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Invoice_${invoiceNo}.pdf`);
        toast.success(`Invoice ${invoiceNo} downloaded successfully!`);
        setPdfInvoiceData(null); // Clear PDF data after download
      } else {
        toast.error('Failed to generate PDF. Please try again.');
      }
    }, 100); // Small delay to allow rendering
  };

  return {
    pdfContentRef,
    pdfInvoiceData,
    handleDownloadPdf,
  };
};