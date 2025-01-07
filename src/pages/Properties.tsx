import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnitList } from '@/components/properties/UnitList';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchProperties } from '@/lib/store/slices/propertySlice';
import { fetchUnits } from '@/lib/store/slices/unitSlice';
import { Property, PropertyUnit, Tenant } from '@/types';

const Properties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, status, error } = useSelector((state: RootState) => state.properties);
  const { units, status: unitsStatus, error: unitsError } = useSelector((state: RootState) => state.units);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProperties()).unwrap(),
          dispatch(fetchUnits()).unwrap()
        ]);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  const handleAddProperty = () => {
    // TODO: Implement add property modal
    console.log('Add property clicked');
  };

  const handleAddUnit = (propertyId: string) => {
    // TODO: Implement add unit modal
    console.log('Add unit clicked for property:', propertyId);
  };

  const handleUnitClick = (unit: PropertyUnit & { tenant?: Tenant }) => {
    // TODO: Implement unit details modal
    console.log('Unit clicked:', unit);
  };

  if (error || unitsError) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error: {error || unitsError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and units
          </p>
        </div>
        <Button onClick={handleAddProperty}>Add Property</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => (
          <Card
            key={property.id}
            className={`cursor-pointer transition-all ${selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedProperty(property)}
          >
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {property.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  Type: {property.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  Units: {property.units}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {property.status}
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddUnit(property.id);
                    }}
                  >
                    Add Unit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProperty && (
        <div>
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
    </div>
  );
};

export default Properties;