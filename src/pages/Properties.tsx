import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchProperties } from '../lib/store/slices/propertySlice';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import AddPropertyModal from '../components/properties/AddPropertyModal';
import Table from '../components/ui/Table/Table';
import TablePagination from '../components/ui/Table/TablePagination';
import type { Property } from '../types';
import type { RootState } from '../lib/store';
import { propertyService } from '../lib/services/propertyService';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Properties: React.FC = () => {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state: RootState) => state.properties);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchPropertiesData = () => {
      try {
        dispatch(fetchProperties());
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchPropertiesData();
  }, [dispatch]);

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
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
      <div>
        <PageHeader 
          title="Properties"
          description="Manage your property portfolio"
        />
        
        <div className="mb-6">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
        </div>

        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <Card>
          <Table
            data={properties}
            columns={columns}
            isLoading={loading}
          />
          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(properties.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={properties.length}
            itemsPerPage={itemsPerPage}
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Properties;
