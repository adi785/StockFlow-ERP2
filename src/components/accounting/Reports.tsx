import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FilePdf, Printer, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const reports = [
    {
      title: 'Day Book',
      description: 'Daily transaction summary',
      icon: Calendar,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Cash Book',
      description: 'Cash transactions report',
      icon: FileText,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Bank Book',
      description: 'Bank transaction report',
      icon: FileText,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'GST Report',
      description: 'GST input/output summary',
      icon: FileSpreadsheet,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Ageing Report',
      description: 'Debtors and creditors ageing',
      icon: Calendar,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Inventory Report',
      description: 'Stock and inventory summary',
      icon: FileText,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Bank Reconciliation',
      description: 'Bank statement reconciliation',
      icon: FileSpreadsheet,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Budget Analysis',
      description: 'Budget vs actual analysis',
      icon: FileSpreadsheet,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Ratio Analysis',
      description: 'Financial health indicators',
      icon: FileSpreadsheet,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Multi-Currency Report',
      description: 'Foreign currency transactions',
      icon: FileText,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Cost Center Report',
      description: 'Departmental cost analysis',
      icon: FileText,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    },
    {
      title: 'Cash Flow Statement',
      description: 'Cash flow analysis',
      icon: FileSpreadsheet,
      actions: ['Generate', 'Export PDF', 'Export Excel']
    }
  ];

  const handleReportAction = (reportTitle: string, action: string) => {
    toast.info(`${action} ${reportTitle} - Feature coming soon!`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Reports</CardTitle>
        <CardDescription>Generate and export various accounting reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <Card key={index} className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <report.icon className="h-5 w-5" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleReportAction(report.title, action)}
                    >
                      {action === 'Export PDF' && <FilePdf className="mr-2 h-4 w-4" />}
                      {action === 'Export Excel' && <FileSpreadsheet className="mr-2 h-4 w-4" />}
                      {action === 'Export CSV' && <FileText className="mr-2 h-4 w-4" />}
                      {action === 'Print' && <Printer className="mr-2 h-4 w-4" />}
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};