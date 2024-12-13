import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const Settings: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Settings"
        description="Manage your account and application preferences"
      />
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Settings panel coming soon...</p>
      </Card>
    </div>
  );
};

export default Settings;