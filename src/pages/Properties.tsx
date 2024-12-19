import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Download, Printer, Building2 } from 'lucide-react';
import { UnitDetailsModal } from '@/components/properties/UnitDetailsModal';
import { Toaster } from '@/components/ui/toaster';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/Form/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { UnitList } from '@/components/properties/UnitList';
import AddPropertyModal from '@/components/properties/AddPropertyModal';
import AddUnitModal from '@/components/properties/AddUnitModal';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchProperties, setError as setPropertyError } from '@/lib/store/slices/propertySlice';
import { fetchUnits, setError as setUnitError } from '@/lib/store/slices/unitSlice';
import { Property, PropertyUnit, Tenant } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { propertyService } from '@/lib/services/propertyService';

const exportToCSV = (properties: Property[]) => {
  const headers = ['Name', 'Address', 'Type', 'Units', 'Status'];
  const data = properties.map(p => [p.name, p.address, p.type, p.units, p.status]);
  const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'properties.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
const Properties = () => {
  const dispatch = useAppDispatch();
  const { properties, status, error } = useAppSelector((state) => state.properties);
  const { units, status: unitsStatus, error: unitsError } = useAppSelector((state) => state.units);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isLoading = status === 'loading' || unitsStatus === 'loading';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPropertyForUnit, setSelectedPropertyForUnit] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);

  useEffect(() => {
    dispatch(fetchProperties())
      .unwrap()
      .catch(error => {
        console.error('Error fetching properties:', error);
        dispatch(setPropertyError(error.message));
      });
    
    dispatch(fetchUnits())
      .unwrap()
      .catch(error => {
        console.error('Error fetching units:', error);
        dispatch(setUnitError(error.message));
      });
  }, [dispatch]);

  const handleAddUnit = (propertyId: string) => {
    setSelectedPropertyForUnit(propertyId);
    setIsAddUnitModalOpen(true);
  };

  const handleUnitAdded = (unit: PropertyUnit) => {
    setIsAddUnitModalOpen(false);
    setSelectedPropertyForUnit(null);
    // Refresh units list
    dispatch(fetchUnits());
  };

  const handleUnitClick = (unit: PropertyUnit & { tenant?: Tenant }) => {
    setSelectedUnit(unit);
  };

  const handleUnitUpdate = async (updatedUnit: PropertyUnit) => {
    try {
      await dispatch(fetchUnits());
      toast({
        title: "Success",
        description: "Unit updated successfully",
      });
      setSelectedUnit(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update unit",
        variant: "destructive",
      });
    }
  };

  const handleEditProperty = async (property: Property) => {
    setSelectedProperty(property);
    setIsAddModalOpen(true);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    setIsDeleteLoading(true);
    try {
      await propertyService.deleteProperty(propertyToDelete);
      dispatch(fetchProperties());
      toast({
        title: "Property deleted",
        description: "The property and its units have been deleted successfully.",
      });
      setPropertyToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || unitsError) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/50 rounded-md">
        Error: {error || unitsError}
      </div>
    );
  }

  if (!properties || !units) {
    return (
      <div className="p-4 text-gray-600">
        No properties or units found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              Manage your properties and units
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => exportToCSV(filteredProperties)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.reduce((acc, p) => acc + (p.units || 0), 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'apartment', label: 'Apartments' },
              { value: 'house', label: 'Houses' },
              { value: 'commercial', label: 'Commercial' }
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'available', label: 'Available' },
              { value: 'occupied', label: 'Occupied' },
              { value: 'maintenance', label: 'Maintenance' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={(property) => handleEditProperty(property)}
              onDelete={(id) => {
                setPropertyToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onAddUnit={(id) => handleAddUnit(id)}
              onViewDetails={(property) => setSelectedProperty(property)}
            />
          ))}
        </div>

        {selectedProperty && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Units - {selectedProperty.name}
              </h2>
            </div>
            <UnitList
              units={units.filter((unit) => unit.property_id === selectedProperty.id)}
              onUnitClick={handleUnitClick}
            />
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this property? This action cannot be undone and will also delete all associated units.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProperty}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? 'Deleting...' : 'Delete Property'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />

        {selectedPropertyForUnit && (
          <AddUnitModal
            propertyId={selectedPropertyForUnit}
            onClose={() => setIsAddUnitModalOpen(false)}
            onSuccess={handleUnitAdded}
          />
        )}

        {selectedUnit && (
          <UnitDetailsModal
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdate={(updatedUnit) => {
              dispatch(fetchUnits());
              setSelectedUnit(null);
            }}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
};

export default Properties;