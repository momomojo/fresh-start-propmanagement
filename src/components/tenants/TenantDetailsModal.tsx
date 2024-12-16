import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tenant } from '@/types';

interface TenantDetailsModalProps {
  tenant: Tenant;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
}

export const TenantDetailsModal = ({
  tenant,
  onClose,
  onSave,
}: TenantDetailsModalProps) => {
  const [formData, setFormData] = useState({
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    lease_start: tenant.lease_start,
    lease_end: tenant.lease_end,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...tenant,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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
        </CardContent>
      </Card>
    </div>
  );
};
