import React from 'react';
import { useDispatch } from 'react-redux';
import { Users, Plus, Search, Filter, Pencil, Trash2, Download, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageHeader from '../components/ui/PageHeader';
import Table from '../components/ui/Table/Table';
import TablePagination from '../components/ui/Table/TablePagination';
import AddTenantModal from '../components/tenants/AddTenantModal';
import TenantDetailsModal from '../components/tenants/TenantDetailsModal';
import Input from '../components/ui/Form/Input';
import Select from '@/components/ui/Form/Select';
import { useAppSelector, useTenants, useProperties } from '@/lib/store';
import { setTenants, setLoading, setFilters } from '../lib/store/slices/tenantSlice';
import { tenantService } from '../lib/services/tenantService';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Tenants: React.FC = () => {
  const dispatch = useDispatch();
  const { tenants, loading, filters } = useTenants();
  const { properties } = useProperties();
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const [error, setError] = React.useState<string | null>(null); 
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchTenants = async () => {
      try {
        dispatch(setLoading(true));
        const data = await tenantService.getTenants();
        dispatch(setTenants(data));
      } catch (error) {
        setError('Failed to load tenants. Please try again later.');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTenants();
  }, [dispatch]);

  const filteredTenants = React.useMemo(() => {
    return tenants.filter(tenant => {
      if (filters.propertyId && tenant.lease?.unit_id !== filters.propertyId) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(tenant.lease?.status || '')) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          tenant.name.toLowerCase().includes(searchLower) ||
          tenant.email.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [tenants, filters]);

  const columns = [
    {
      key: 'name',
      title: 'Tenant Name',
      render: (tenant: typeof tenants[0]) => (
        <div className="flex items-center">
          <img
            src={tenant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.name)}`}
            alt={tenant.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{tenant.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.email}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'lease',
      title: 'Lease Status',
      render: (tenant: typeof tenants[0]) => (
        <span className={`px-2 py-1 text-sm rounded-full ${
          tenant.lease?.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : tenant.lease?.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {tenant.lease?.status || 'No Lease'}
        </span>
      ),
      sortable: true
    },
    {
      key: 'rent',
      title: 'Monthly Rent',
      render: (tenant: typeof tenants[0]) => (
        <span className="font-medium">
          {tenant.lease
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(tenant.lease.rent_amount)
            : '-'}
        </span>
      ),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (tenant: typeof tenants[0]) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTenantId(tenant.id)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Tenants"
        description="Manage your tenants and leases"
      />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" />
            <Input
              type="text"
              placeholder="Search tenants..."
              className="pl-10 min-w-[250px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                dispatch(setFilters({ search: e.target.value }));
              }}
            />
          </div>
          
          <Select
            value={filters.leaseStatus || ''}
            onChange={(e) => dispatch(setFilters({ leaseStatus: e.target.value }))}
            options={[
              { value: '', label: 'All Lease Statuses' },
              { value: 'active', label: 'Active Lease' },
              { value: 'expired', label: 'Expired Lease' },
              { value: 'pending', label: 'Pending Lease' }
            ]}
          />
          
          <Select
            value={filters.paymentStatus || ''}
            onChange={(e) => dispatch(setFilters({ paymentStatus: e.target.value }))}
            options={[
              { value: '', label: 'All Payment Statuses' },
              { value: 'current', label: 'Current' },
              { value: 'late', label: 'Late' },
              { value: 'overdue', label: 'Overdue' }
            ]}
          />
          
          <Select
            value={filters.propertyId || ''}
            onChange={(e) => dispatch(setFilters({ propertyId: e.target.value || null }))}
            options={[
              { value: '', label: 'All Properties' },
              ...properties.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
          
          <Select
            value={filters.status.join(',')}
            onChange={(e) => dispatch(setFilters({ status: e.target.value ? e.target.value.split(',') : [] }))}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'ended', label: 'Ended' }
            ]}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message All
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <Card>
        <Table
          data={filteredTenants}
          columns={columns}
          isLoading={loading}
        />
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTenants.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredTenants.length}
          itemsPerPage={itemsPerPage}
        />
      </Card>

      <Toaster />

      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedTenantId && (
        <TenantDetailsModal
          tenantId={selectedTenantId}
          onClose={() => setSelectedTenantId(null)}
        />
      )}
    </div>
  );
};

export default Tenants;