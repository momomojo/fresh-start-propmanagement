import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchMaintenanceRequests } from '@/lib/store/slices/maintenanceSlice';
import { MaintenanceRequest } from '@/types';

const Maintenance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading, error } = useSelector((state: RootState) => state.maintenance);

  useEffect(() => {
    dispatch(fetchMaintenanceRequests());
  }, [dispatch]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error loading maintenance requests: {error}
      </div>
    );
  }

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

export default Maintenance;