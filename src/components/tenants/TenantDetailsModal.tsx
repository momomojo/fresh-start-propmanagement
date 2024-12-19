import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TenantTabs } from './TenantTabs';
import { tenantService } from '@/lib/services/tenantService';
import { toast } from '@/components/ui/use-toast';
import type { Tenant } from '@/types';

interface TenantDetailsModalProps {
  tenantId: string;
  onClose: () => void;
}

const TenantDetailsModal = ({ tenantId, onClose }: TenantDetailsModalProps) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    lease_start: string;
    lease_end: string;
  }>({
    name: '',
    email: '',
    phone: '',
    lease_start: '',
    lease_end: '',
  });

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setIsLoading(true);
        const data = await tenantService.getTenant(tenantId);
        if (data) {
          setTenant(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            lease_start: data.lease_start || '',
            lease_end: data.lease_end || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenant');
        toast({
          title: "Error",
          description: "Failed to load tenant details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    try {
      await tenantService.updateTenant(tenant.id, formData);
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update tenant",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Tenant Not Found</h3>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                placeholder="Enter tenant name"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="lease_start">Lease Start Date</Label>
              <Input
                id="lease_start"
                type="date"
                value={formData.lease_start}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lease_start: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="lease_end">Lease End Date</Label>
              <Input
                id="lease_end"
                type="date"
                value={formData.lease_end}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lease_end: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
            </form>
          
            <div className="mt-8">
              <TenantTabs tenantId={tenant.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDetailsModal;