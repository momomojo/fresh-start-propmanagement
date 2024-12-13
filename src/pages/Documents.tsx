import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const Documents: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Documents"
        description="Manage property-related documents and contracts"
      />
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Document management coming soon...</p>
      </Card>
    </div>
  );
};

export default Documents;