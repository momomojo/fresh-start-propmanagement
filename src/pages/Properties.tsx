import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Building2, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { fetchProperties, setProperties, setFilters } from '../lib/store/slices/propertySlice';
import { propertyService } from '../lib/services/propertyService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import AddPropertyModal from '../components/properties/AddPropertyModal';
import EditPropertyModal from '../components/properties/EditPropertyModal';
import DeletePropertyDialog from '../components/properties/DeletePropertyDialog';
import PropertyFilters from '../components/properties/PropertyFilters';
import Table from '../components/ui/Table/Table';
import TablePagination from '../components/ui/Table/TablePagination';
import type { Property } from '../types';
import type { RootState } from '../lib/store';

const Properties: React.FC = () => {
  const dispatch = useDispatch();
  const { properties, loading, filters } = useSelector((state: RootState) => state.properties);
  const [error, setError] = React.useState<{ message: string; retry?: () => void } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Initial fetch
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setError(null);
        const properties = await propertyService.getProperties();
        dispatch(setProperties(properties));
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError({
          message: 'Failed to load properties',
          retry: fetchProperties
        });
      }
    };

    if (!loading) {
      fetchProperties();
    }
  }, [dispatch]);

  // Subscribe to real-time updates
  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = propertyService.subscribeToProperties((updatedProperties) => {
        dispatch(setProperties(updatedProperties));
      });
    } catch (error) {
      console.error('Error setting up property subscription:', error);
      setError({
        message: 'Failed to receive property updates'
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  const filteredProperties = React.useMemo(() => {
    return properties.filter(property => {
      if (filters.type.length > 0 && !filters.type.includes(property.type)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(property.status as Property['status'])) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          property.name.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [properties, filters]);

  const handleExport = () => {
    const csv = [
      ['Property Name', 'Address', 'Type', 'Units', 'Status'],
      ...filteredProperties.map(p => [
        p.name,
        p.address,
        p.type,
        p.units.toString(),
        p.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'name',
      title: 'Property Name',
      render: (property: Property) => (
        <div className="flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-purple-600" />
          <span>{property.name}</span>
        </div>
      ),
      sortable: true
    },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'units', title: 'Units', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    {
      key: 'actions',
      title: 'Actions',
      render: (property: Property) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedProperty(property)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedProperty(property);
              setIsDeleteDialogOpen(true);
            }}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Properties"
        description="Manage your property portfolio"
      />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800 flex items-center justify-between">
          <span>{error.message}</span>
          {error.retry && (
            <button
              onClick={error.retry}
              className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Retry
            </button>
          )}
        </div>
      )}
      
      <div className="mb-6 flex justify-between">
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <PropertyFilters
        filters={filters}
        onChange={(newFilters) => dispatch(setFilters(newFilters))}
        onClear={() => dispatch(setFilters({ search: '', type: [], status: [] }))}
      />

      <Card>
        <Table
          data={filteredProperties}
          columns={columns}
          isLoading={loading}
        />
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProperties.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredProperties.length}
          itemsPerPage={itemsPerPage}
        />
      </Card>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedProperty && !isDeleteDialogOpen && (
        <EditPropertyModal
          property={selectedProperty}
          isOpen={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {selectedProperty && isDeleteDialogOpen && (
        <DeletePropertyDialog
          property={selectedProperty}
          isOpen={true}
          onClose={() => {
            setSelectedProperty(null);
            setIsDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Properties;