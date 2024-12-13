import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const Maintenance: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Maintenance"
        description="Track and manage maintenance requests"
      />
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Maintenance requests coming soon...</p>
      </Card>
    </div>
  );
};

export default Maintenance;