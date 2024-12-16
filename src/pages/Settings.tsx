import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/settings/UserProfile';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { AdminSettings } from '@/components/settings/AdminSettings';
import { User } from '@/types';

export const Settings = () => {
  const [user] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  });

  const handleProfileUpdate = (updatedUser: Partial<User>) => {
    console.log('Updating user profile:', updatedUser);
  };

  const handleSecurityUpdate = (data: { currentPassword: string; newPassword: string }) => {
    console.log('Updating security settings:', data);
  };

  const handleAdminSettingsUpdate = (settings: any) => {
    console.log('Updating admin settings:', settings);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfile user={user} onSave={handleProfileUpdate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <SecuritySettings onSave={handleSecurityUpdate} />
          </CardContent>
        </Card>

        {user.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminSettings onSave={handleAdminSettingsUpdate} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
