import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import UserProfile from '../components/settings/UserProfile';
import SecuritySettings from '../components/settings/SecuritySettings';
import AdminSettings from '../components/settings/AdminSettings';

const Settings: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Settings"
        description="Manage your account and application preferences"
      />
      
      <div className="space-y-6">
        <UserProfile />
        <SecuritySettings />
        <AdminSettings />
      </div>
    </div>
  );
};

export default Settings;