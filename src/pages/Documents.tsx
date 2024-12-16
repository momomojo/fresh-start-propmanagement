import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';

const Documents: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Documents"
        description="Manage property-related documents and contracts"
      />
      <Card>
        <CardContent>
          <p className="text-muted-foreground">Document management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
