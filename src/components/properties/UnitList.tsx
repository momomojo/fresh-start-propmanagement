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
          className={`cursor-pointer transition-all ${selectedUnit?.id === unit.id ? 'ring-2 ring-primary' : ''
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
              <p className="text-sm text-muted-foreground">
                Status: {unit.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Floor Plan: {unit.floor_plan || 'Not specified'}
              </p>
              {unit.tenant && (
                <div className="pt-2">
                  <p className="text-sm font-medium">Current Tenant:</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.tenant.name}
                  </p>
                </div>
              )}
              <div className="pt-2">
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
