import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';

const Reports: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Reports"
        description="View financial and operational reports"
      />
      <Card>
        <CardContent>
          <p className="text-muted-foreground">Reports dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
