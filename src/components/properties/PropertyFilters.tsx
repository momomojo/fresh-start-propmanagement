import React from 'react';
import { Filter, X } from 'lucide-react';
import Input from '../ui/Form/Input';
import Select from '../ui/Form/Select';

interface PropertyFilters {
  search: string;
  type: string[];
  status: string[];
}

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onChange: (filters: Partial<PropertyFilters>) => void;
  onClear: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onChange,
  onClear
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="text"
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.type.join(',')}
        onChange={(e) => onChange({ type: e.target.value ? e.target.value.split(',') : [] })}
        options={[
          { value: '', label: 'All Types' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'house', label: 'House' },
          { value: 'commercial', label: 'Commercial' }
        ]}
      />

      <Select
        value={filters.status.join(',')}
        onChange={(e) => onChange({ status: e.target.value ? e.target.value.split(',') : [] })}
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'available', label: 'Available' },
          { value: 'occupied', label: 'Occupied' },
          { value: 'maintenance', label: 'Under Maintenance' }
        ]}
      />

      {(filters.search || filters.type.length > 0 || filters.status.length > 0) && (
        <button
          onClick={onClear}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default PropertyFilters;