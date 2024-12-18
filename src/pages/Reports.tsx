import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Reports = () => {
  const [reports] = useState([
    {
      id: '1',
      title: 'Monthly Revenue',
      type: 'Financial',
      period: 'January 2024',
      status: 'Generated',
    },
    {
      id: '2',
      title: 'Occupancy Rate',
      type: 'Performance',
      period: 'Q4 2023',
      status: 'Generated',
    },
    {
      id: '3',
      title: 'Maintenance Summary',
      type: 'Operations',
      period: '2023',
      status: 'Generated',
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and generate property management reports
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Type: {report.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  Period: {report.period}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {report.status}
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

export default Reports;