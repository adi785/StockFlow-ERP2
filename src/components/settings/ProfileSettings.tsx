import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface ProfileSettingsProps {
  profile: {
    first_name: string;
    last_name: string;
    business_name: string;
    gstin: string;
    proprietor_name: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
    business_name: string;
    gstin: string;
    proprietor_name: string;
  }>>;
  onUpdate: () => void;
}

export const ProfileSettings = ({ profile, setProfile, onUpdate }: ProfileSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Manage your personal information and business details
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
        
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            value={profile.business_name}
            onChange={(e) => setProfile({...profile, business_name: e.target.value})}
            placeholder="Enter your business name"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gst">GSTIN</Label>
            <Input
              id="gst"
              value={profile.gstin}
              onChange={(e) => setProfile({...profile, gstin: e.target.value})}
              placeholder="Enter GST identification number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proprietor">Proprietor Name</Label>
            <Input
              id="proprietor"
              value={profile.proprietor_name}
              onChange={(e) => setProfile({...profile, proprietor_name: e.target.value})}
              placeholder="Enter proprietor name"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onUpdate}>Save Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
};