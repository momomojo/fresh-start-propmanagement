import React from 'react';
import { X } from 'lucide-react';
import { propertyService } from '../../lib/services/propertyService';
import { Card } from '../ui/Card';
import type { Tenant, Property } from '../../types';

interface TenantDetailsModalProps {
  tenant: Tenant;
  onClose: () => void;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ tenant, onClose }) => {
  const [property, setProperty] = React.useState<Property | null>(null);

  React.useEffect(() => {
    const fetchProperty = async () => {
      if (tenant.lease?.unit_id) {
        try {
          const propertyData = await propertyService.getPropertyByUnitId(tenant.lease.unit_id);
          setProperty(propertyData);
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      }
    };

    fetchProperty();
  }, [tenant.lease?.unit_id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{tenant.name}</h2>
              <p className="text-muted-foreground">{tenant.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {tenant.status}
              </span>
            </div>

            {property && (
              <div>
                <h3 className="text-lg font-medium mb-2">Property</h3>
                <p>{property.name}</p>
                <p className="text-muted-foreground">{property.address}</p>
              </div>
            )}

            {tenant.lease && (
              <div>
                <h3 className="text-lg font-medium mb-2">Lease Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p>{new Date(tenant.lease.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p>{new Date(tenant.lease.end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rent</p>
                    <p>${tenant.lease.rent_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deposit</p>
                    <p>${tenant.lease.deposit_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p>${tenant.balance.toFixed(2)}</p>
                </div>
                {tenant.lastPaymentDate && (
                  <div>
                    <p className="text-muted-foreground">Last Payment</p>
                    <p>{new Date(tenant.lastPaymentDate).toLocaleDateString()}</p>
                  </div>
                )}
                {tenant.nextPaymentDue && (
                  <div>
                    <p className="text-muted-foreground">Next Payment Due</p>
                    <p>{new Date(tenant.nextPaymentDue).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {tenant.documents.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Documents</h3>
                <ul className="space-y-2">
                  {tenant.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span>{doc.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TenantDetailsModal;
