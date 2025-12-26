import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FilePdf, Printer } from 'lucide-react';

interface ReportExportProps {
  title: string;
  data: any[];
  columns: Array<{ key: string; header: string }>;
  onExport: (format: 'pdf' | 'excel' | 'csv' | 'print') => void;
}

export const ReportExport: React.FC<ReportExportProps> = ({ title, data, columns, onExport }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => onExport('pdf')} className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <FilePdf className="mr-2 h-4 w-4" />
        PDF
      </Button>
      <Button variant="outline" onClick={() => onExport('excel')} className="text-green-600 hover:text-green-700 hover:bg-green-50">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" onClick={() => onExport('csv')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <FileText className="mr-2 h-4 w-4" />
        CSV
      </Button>
      <Button variant="outline" onClick={() => onExport('print')} className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
    </div>
  );
};