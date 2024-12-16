import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import UserProfile from '@/components/settings/UserProfile';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AdminSettings from '@/components/settings/AdminSettings';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Settings */}
        <UserProfile />

        {/* Security Settings */}
        <SecuritySettings />

        {/* Admin Settings - Only visible to admins */}
        {user.role === 'admin' && <AdminSettings />}
      </div>
    </div>
  );
};

export default Settings;
