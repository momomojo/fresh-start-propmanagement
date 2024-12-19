import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyUnit, Tenant } from '@/types';

interface UnitListProps {
  units: (PropertyUnit & { tenant?: Tenant })[];
  onUnitClick: (unit: PropertyUnit & { tenant?: Tenant }) => void;
}

export const UnitList = ({ units, onUnitClick }: UnitListProps) => {
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {units.map((unit) => (
        <Card
          key={unit.id}
          className={`cursor-pointer hover:shadow-lg transition-all ${
            selectedUnit?.id === unit.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => {
            setSelectedUnit(unit);
            onUnitClick(unit);
          }}
        >
          <CardHeader>
            <CardTitle>Unit {unit.unit_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`inline-flex px-2 py-1 rounded-full text-sm ${
                unit.status === 'available' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : unit.status === 'maintenance'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </div>
              <p className="text-sm text-muted-foreground">
                Floor Plan: {unit.floor_plan || 'Not specified'}
              </p>
              <p className="text-sm text-muted-foreground">
                Rent: ${unit.rent_amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.square_feet} sq ft
              </p>
              {unit.tenant && (
                <div className="pt-2">
                  <p className="text-sm font-medium">Current Tenant:</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.tenant.name}
                  </p>
                </div>
              )}
              <div className="pt-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnitClick(unit);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};