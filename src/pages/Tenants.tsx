import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const Tenants: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Tenants"
        description="Manage your tenants and leases"
      />
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Tenant list coming soon...</p>
      </Card>
    </div>
  );
};

export default Tenants;