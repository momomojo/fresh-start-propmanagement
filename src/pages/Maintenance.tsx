import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MaintenanceRequest } from '@/types';

export const Maintenance = () => {
  const [requests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      tenant_id: '1',
      property_id: '1',
      title: 'Leaking Faucet',
      description: 'Kitchen sink faucet is leaking',
      priority: 'medium',
      status: 'pending',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
    },
    {
      id: '2',
      tenant_id: '2',
      property_id: '1',
      title: 'AC Not Working',
      description: 'Air conditioning unit not cooling',
      priority: 'high',
      status: 'in_progress',
      created_at: '2024-01-14',
      updated_at: '2024-01-15',
    },
  ]);

  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'emergency':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const getStatusColor = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance requests
          </p>
        </div>
        <Button>New Request</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>{request.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>
                <p className="text-sm">
                  Priority:{' '}
                  <span className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </span>
                </p>
                <p className="text-sm">
                  Status:{' '}
                  <span className={getStatusColor(request.status)}>
                    {request.status}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(request.created_at).toLocaleDateString()}
                </p>
                <div className="pt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
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
