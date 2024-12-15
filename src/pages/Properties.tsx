import React from 'react';
import { Building2, Plus, Pencil, Trash2, Home } from 'lucide-react';
import { fetchProperties } from '../lib/store/slices/propertySlice';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import AddPropertyModal from '../components/properties/AddPropertyModal';
import UnitList from '../components/properties/UnitList';
import AddUnitModal from '../components/properties/AddUnitModal';
import UnitDetailsModal from '../components/properties/UnitDetailsModal';
import Table from '../components/ui/Table/Table';
import TablePagination from '../components/ui/Table/TablePagination';
import type { Property, PropertyUnit } from '../types';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { propertyService } from '../lib/services/propertyService';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ActionStatus } from '../lib/store/types';
import { AnyAction } from '@reduxjs/toolkit';

const Properties: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, status } = useAppSelector((state) => state.properties);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<PropertyUnit | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchPropertiesData = () => {
      try {
        dispatch(fetchProperties() as unknown as AnyAction);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchPropertiesData();
  }, [dispatch]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleUnitClick = (unit: PropertyUnit) => {
    setSelectedUnit(unit);
  };

  const handleUnitUpdate = () => {
    // Refresh properties to get updated unit counts
    dispatch(fetchProperties() as unknown as AnyAction);
  };

  const handleUnitDelete = () => {
    // Refresh properties after unit deletion
    dispatch(fetchProperties() as unknown as AnyAction);
    setSelectedUnit(null);
  };

  const columns = [
    {
      key: 'name',
      title: 'Property Name',
      render: (property: Property) => (
        <button
          onClick={() => handlePropertyClick(property)}
          className="flex items-center hover:text-purple-600"
        >
          <Building2 className="w-5 h-5 mr-2 text-purple-600" />
          <span>{property.name}</span>
        </button>
      ),
      sortable: true
    },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'units', title: 'Units', sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      render: (property: Property) => (
        <span className={`px-2 py-1 text-sm rounded-full ${
          property.status === 'available' ? 'bg-green-100 text-green-800' :
          property.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {property.status}
        </span>
      ),
      sortable: true 
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (property: Property) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePropertyClick(property);
            }}
            className="p-1 text-purple-600 hover:text-purple-800"
            title="View Units"
          >
            <Home className="w-4 h-4" />
          </button>
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

        {isAddModalOpen && (
          <AddPropertyModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}

        <Card>
          <Table
            data={properties}
            columns={columns}
            isLoading={status === ActionStatus.LOADING}
          />
          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(properties.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={properties.length}
            itemsPerPage={itemsPerPage}
          />
        </Card>

        {selectedProperty && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Units for {selectedProperty.name}
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsAddUnitModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unit
                </button>
              </div>
            </div>
            
            <UnitList
              propertyId={selectedProperty.id}
              onUnitClick={handleUnitClick}
            />
          </div>
        )}

        {isAddUnitModalOpen && selectedProperty && (
          <AddUnitModal
            propertyId={selectedProperty.id}
            onClose={() => setIsAddUnitModalOpen(false)}
            onSuccess={() => {
              setIsAddUnitModalOpen(false);
              handleUnitUpdate();
            }}
          />
        )}

        {selectedUnit && (
          <UnitDetailsModal
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdate={handleUnitUpdate}
            onDelete={handleUnitDelete}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Properties;
