import React from 'react';
import { useDispatch } from 'react-redux';
import { X, User, Calendar, DollarSign, Home } from 'lucide-react';
import { tenantService } from '../../lib/services/tenantService';
import { updateTenant } from '../../lib/store/slices/tenantSlice';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Card from '../ui/Card';

interface TenantDetailsModalProps {
  tenantId: string;
  onClose: () => void;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ tenantId, onClose }) => {
  const dispatch = useDispatch();
  const [tenant, setTenant] = React.useState<Awaited<ReturnType<typeof tenantService.getTenant>> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTenant = async () => {
      try {
        setIsLoading(true);
        const data = await tenantService.getTenant(tenantId);
        setTenant(data);
      } catch (error) {
        setError('Failed to load tenant details');
        console.error('Error fetching tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  if (!tenant && !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Tenant Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tenant ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <div className="flex flex-col items-center">
                    <img
                      src={tenant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.name)}`}
                      alt={tenant.name}
                      className="w-32 h-32 rounded-full mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {tenant.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tenant.email}
                    </p>
                  </div>
                </Card>

                <Card className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Lease Information
                  </h3>
                  {tenant.lease ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Date(tenant.lease.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Date(tenant.lease.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Monthly Rent
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(tenant.lease.rent_amount)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Security Deposit
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(tenant.lease.deposit_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No active lease
                    </p>
                  )}
                </Card>
              </div>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Payment History
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" colSpan={4}>
                          No payment history available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsModal;