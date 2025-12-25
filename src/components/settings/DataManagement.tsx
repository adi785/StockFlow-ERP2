import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DataManagementProps {
  onExport: () => void;
  onImport: () => void;
  onDelete: () => void;
}

export const DataManagement = ({ onExport, onImport, onDelete }: DataManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Export, import, or delete your ERP data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button 
            variant="outline" 
            onClick={onExport}
            className="flex flex-col items-center justify-center h-24 gap-2"
          >
            <Download className="h-5 w-5" />
            Export Data
            <span className="text-xs text-muted-foreground">
              Download all ERP data
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onImport}
            className="flex flex-col items-center justify-center h-24 gap-2"
          >
            <Upload className="h-5 w-5" />
            Import Data
            <span className="text-xs text-muted-foreground">
              Upload ERP data files
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onDelete}
            className="flex flex-col items-center justify-center h-24 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-5 w-5" />
            Delete Account
            <span className="text-xs text-muted-foreground">
              Permanently remove account
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};