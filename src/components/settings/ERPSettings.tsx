import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse } from 'lucide-react';

interface ERPSettingsProps {
  erpSettings: {
    default_currency: string;
    date_format: string;
    gst_enabled: boolean;
    auto_backup: boolean;
  };
  setErpSettings: React.Dispatch<React.SetStateAction<{
    default_currency: string;
    date_format: string;
    gst_enabled: boolean;
    auto_backup: boolean;
  }>>;
}

export const ERPSettings = ({ erpSettings, setErpSettings }: ERPSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warehouse className="h-5 w-5" />
          ERP Configuration
        </CardTitle>
        <CardDescription>
          Customize business rules and system behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select 
              value={erpSettings.default_currency} 
              onValueChange={(value) => 
                setErpSettings({...erpSettings, default_currency: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select 
              value={erpSettings.date_format} 
              onValueChange={(value) => 
                setErpSettings({...erpSettings, date_format: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>GST Calculation</Label>
            <p className="text-sm text-muted-foreground">
              Enable automatic GST calculation on transactions
            </p>
          </div>
          <Switch
            checked={erpSettings.gst_enabled}
            onCheckedChange={(checked) => 
              setErpSettings({...erpSettings, gst_enabled: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Automatic Backups</Label>
            <p className="text-sm text-muted-foreground">
              Enable daily automated backups of your data
            </p>
          </div>
          <Switch
            checked={erpSettings.auto_backup}
            onCheckedChange={(checked) => 
              setErpSettings({...erpSettings, auto_backup: checked})
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};