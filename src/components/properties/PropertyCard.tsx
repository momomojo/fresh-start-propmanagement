import { useState } from 'react';
import { Building2, Users, Wrench, DollarSign, MapPin, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onAddUnit: (propertyId: string) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property,
  onEdit,
  onDelete,
  onAddUnit,
  onViewDetails
}) => {

  const occupancyRate = Math.round(Math.random() * 100); // Replace with actual calculation
  const revenue = Math.round(Math.random() * 10000); // Replace with actual data
  const pendingMaintenance = Math.round(Math.random() * 5); // Replace with actual count
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const getStatusIcon = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          {property.name} {getStatusIcon(property.status)}
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(property);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(property.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.address}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Type</span>
              <span className="text-sm text-muted-foreground capitalize">
                {property.type}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Units</span>
              <span className="text-sm text-muted-foreground">
                {property.units}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
              <Users className="h-4 w-4 mb-1" />
              <span className={`text-sm font-medium ${occupancyRate > 80 ? 'text-green-500' : occupancyRate > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {occupancyRate}%
              </span>
              <span className="text-xs text-muted-foreground">Occupied</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
              <DollarSign className="h-4 w-4 mb-1" />
              <span className="text-sm font-medium">${revenue}</span>
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
              <Wrench className="h-4 w-4 mb-1" />
              <span className={`text-sm font-medium ${pendingMaintenance > 0 ? 'text-red-500' : 'text-green-500'}`}>{pendingMaintenance}</span>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => onAddUnit(property.id)}
              className="flex-1"
            >
              Add Unit
            </Button>
            <Button
              onClick={() => onViewDetails(property)}
              className="flex-1"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}