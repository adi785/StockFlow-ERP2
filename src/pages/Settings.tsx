import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';

// Import modular components
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ERPSettings } from '@/components/settings/ERPSettings';
import { DataManagement } from '@/components/settings/DataManagement';
import { AboutSection } from '@/components/settings/AboutSection';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    business_name: '',
    gstin: '',
    proprietor_name: '',
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
        .select('first_name, last_name, avatar_url, business_name, gstin, proprietor_name')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url || '',
          business_name: data.business_name || '',
          gstin: data.gstin || '',
          proprietor_name: data.proprietor_name || '',
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
          business_name: profile.business_name,
          gstin: profile.gstin,
          proprietor_name: profile.proprietor_name,
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
        <ProfileSettings 
          profile={profile} 
          setProfile={setProfile} 
          onUpdate={updateProfile} 
        />

        <Separator />

        {/* Appearance Settings */}
        <AppearanceSettings theme={theme} setTheme={setTheme} />

        <Separator />

        {/* Notification Settings */}
        <NotificationSettings 
          notifications={notifications} 
          setNotifications={setNotifications} 
        />

        <Separator />

        {/* ERP Settings */}
        <ERPSettings 
          erpSettings={erpSettings} 
          setErpSettings={setErpSettings} 
        />

        <Separator />

        {/* Data Management */}
        <DataManagement 
          onExport={handleExportData}
          onImport={handleImportData}
          onDelete={handleDeleteAccount}
        />

        {/* About Section */}
        <AboutSection />
      </div>
    </AppLayout>
  );
};

export default Settings;