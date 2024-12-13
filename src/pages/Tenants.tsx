import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table/Table';
import TablePagination from '../components/ui/Table/TablePagination';
import AddTenantModal from '../components/tenants/AddTenantModal';
import TenantDetailsModal from '../components/tenants/TenantDetailsModal';
import Input from '../components/ui/Form/Input';
import Select from '../components/ui/Form/Select';
import type { RootState } from '../lib/store';
import { setTenants, setLoading, setFilters } from '../lib/store/slices/tenantSlice';
import { tenantService } from '../lib/services/tenantService';

const Tenants: React.FC = () => {
  const dispatch = useDispatch();
  const { tenants, loading, filters } = useSelector((state: RootState) => state.tenants);
  const { properties } = useSelector((state: RootState) => state.properties);
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const [error, setError] = React.useState<string | null>(null);

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
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" />
            <Input
              type="text"
              placeholder="Search tenants..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
            />
          </div>
          
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

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </button>
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