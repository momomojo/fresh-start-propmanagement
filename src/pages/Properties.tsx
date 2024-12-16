import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnitList } from '@/components/properties/UnitList';
import { Property, PropertyUnit, Tenant } from '@/types';

interface PropertiesProps {
  properties: Property[];
  units: (PropertyUnit & { tenant?: Tenant })[];
  onAddProperty: () => void;
  onAddUnit: (propertyId: string) => void;
  onUnitClick: (unit: PropertyUnit & { tenant?: Tenant }) => void;
}

export const Properties = ({
  properties,
  units,
  onAddProperty,
  onAddUnit,
  onUnitClick,
}: PropertiesProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and units
          </p>
        </div>
        <Button onClick={onAddProperty}>Add Property</Button>
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
                      onAddUnit(property.id);
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
            onUnitClick={onUnitClick}
          />
        </div>
      )}
    </div>
  );
};
