import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  notifications: {
    email_alerts: boolean;
    low_stock_alerts: boolean;
    sales_reports: boolean;
  };
  setNotifications: React.Dispatch<React.SetStateAction<{
    email_alerts: boolean;
    low_stock_alerts: boolean;
    sales_reports: boolean;
  }>>;
}

export const NotificationSettings = ({ notifications, setNotifications }: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Configure how you receive alerts and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Receive important system notifications via email
            </p>
          </div>
          <Switch
            checked={notifications.email_alerts}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, email_alerts: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Low Stock Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when products reach reorder level
            </p>
          </div>
          <Switch
            checked={notifications.low_stock_alerts}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, low_stock_alerts: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Weekly Sales Reports</Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly sales performance summaries
            </p>
          </div>
          <Switch
            checked={notifications.sales_reports}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, sales_reports: checked})
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};