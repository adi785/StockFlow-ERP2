import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Warehouse, 
  Database, 
  Shield, 
  Zap, 
  Palette,
  Bell,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
  });
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    low_stock_alerts: true,
    sales_reports: false,
  });
  const [erpSettings, setErpSettings] = useState({
    default_currency: 'INR',
    date_format: 'dd/MM/yyyy',
    gst_enabled: true,
    auto_backup: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleExportData = () => {
    toast.info('Data export functionality will be implemented in a future update');
  };

  const handleImportData = () => {
    toast.info('Data import functionality will be implemented in a future update');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.info('Account deletion functionality will be implemented in a future update');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading settings...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Settings" 
        description="Configure your ERP system preferences" 
      />
      
      <div className="p-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information and profile settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={profile.first_name}
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={profile.last_name}
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={updateProfile}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred color scheme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Notification Settings */}
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

        <Separator />

        {/* ERP Settings */}
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

        <Separator />

        {/* Data Management */}
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
                onClick={handleExportData}
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
                onClick={handleImportData}
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
                onClick={handleDeleteAccount}
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

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              StockFlow ERP
            </CardTitle>
            <CardDescription>
              Distribution Management System v1.0.0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Product Master</h3>
                  <p className="text-sm text-muted-foreground">
                    Central source of truth for all product data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Auto Stock Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time stock updates from purchases & sales
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Business Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevents negative stock & enforces data integrity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Excel-like interface with inline editing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Automatic GST calculation on purchases & sales
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Real-time stock status with color indicators
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Product-wise profit & loss reporting
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Negative stock prevention on sales
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  Low stock alerts with reorder level tracking
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;