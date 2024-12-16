import React, { useEffect } from 'react';
import type { PropertyUnit } from '../../types';
import { Card } from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../lib/store';
import { fetchPropertyUnits } from '../../lib/store/slices/unitSlice';
import { ActionStatus } from '../../lib/store/types';
import { AnyAction } from '@reduxjs/toolkit';

interface UnitListProps {
  propertyId: string;
  onUnitClick?: (unit: PropertyUnit) => void;
}

const UnitList: React.FC<UnitListProps> = ({ propertyId, onUnitClick }) => {
  const dispatch = useAppDispatch();
  const { units, status, error } = useAppSelector((state) => state.units);

  useEffect(() => {
    dispatch(fetchPropertyUnits(propertyId) as unknown as AnyAction);
  }, [propertyId, dispatch]);

  if (status === ActionStatus.LOADING) {
    return <LoadingSpinner data-testid="loading-spinner" />;
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-500" data-testid="error-message">{error}</div>
      </Card>
    );
  }

  const columns = [
    { 
      key: 'unit_number', 
      title: 'Unit Number', 
      sortable: true,
      render: (unit: PropertyUnit) => (
        <button
          onClick={() => onUnitClick?.(unit)}
          className="hover:text-purple-600"
          data-testid={`unit-row-${unit.unit_number}`}
        >
          {unit.unit_number}
        </button>
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (unit: PropertyUnit) => (
        <span className={`px-2 py-1 text-sm rounded-full ${
          unit.status === 'available' ? 'bg-green-100 text-green-800' :
          unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {unit.status}
        </span>
      )
    },
    { 
      key: 'floor_plan', 
      title: 'Floor Plan', 
      sortable: true,
      render: (unit: PropertyUnit) => unit.floor_plan || 'N/A'
    },
    { 
      key: 'updated_at', 
      title: 'Last Updated', 
      sortable: true,
      render: (unit: PropertyUnit) => new Date(unit.updated_at).toLocaleDateString()
    }
  ];

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Units</h3>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="units-table">
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className="text-left p-4 border-b font-medium text-muted-foreground"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map(unit => (
                <tr key={unit.id} className="hover:bg-muted/50">
                  {columns.map(column => (
                    <td key={`${unit.id}-${column.key}`} className="p-4 border-b">
                      {column.render ? column.render(unit) : unit[column.key as keyof PropertyUnit]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default UnitList;
