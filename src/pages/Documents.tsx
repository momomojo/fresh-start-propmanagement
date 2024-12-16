import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Documents = () => {
  const [documents] = useState([
    {
      id: '1',
      name: 'Lease Agreement',
      type: 'PDF',
      size: '2.5MB',
      uploadedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Property Insurance',
      type: 'PDF',
      size: '1.8MB',
      uploadedAt: '2024-01-10',
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage your property-related documents
          </p>
        </div>
        <Button>Upload Document</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card key={doc.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>{doc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type: {doc.type}</p>
                <p className="text-sm text-muted-foreground">Size: {doc.size}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {doc.uploadedAt}
                </p>
                <div className="pt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
