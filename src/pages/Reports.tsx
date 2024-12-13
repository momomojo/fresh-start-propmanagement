import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const Reports: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Reports"
        description="View financial and operational reports"
      />
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Reports dashboard coming soon...</p>
      </Card>
    </div>
  );
};

export default Reports;