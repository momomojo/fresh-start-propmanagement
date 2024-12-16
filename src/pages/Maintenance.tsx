import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';

const Maintenance: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Maintenance"
        description="Track and manage maintenance requests"
      />
      <Card>
        <CardContent>
          <p className="text-muted-foreground">Maintenance requests coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
