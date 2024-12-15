import React from 'react';
import { z } from 'zod';
import { unitService } from '../../lib/services/unitService';
import type { PropertyUnit } from '../../types';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Select from '../ui/Form/Select';

interface AddUnitModalProps {
  propertyId: string;
  onClose: () => void;
  onSuccess: (unit: PropertyUnit) => void;
}

const unitSchema = z.object({
  unit_number: z.string().min(1, 'Unit number is required'),
  floor_plan: z.string().nullable(),
  status: z.enum(['available', 'occupied', 'maintenance']),
});

const AddUnitModal: React.FC<AddUnitModalProps> = ({ propertyId, onClose, onSuccess }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      unit_number: formData.get('unit_number') as string,
      floor_plan: formData.get('floor_plan') as string || null,
      status: formData.get('status') as 'available' | 'occupied' | 'maintenance',
    };

    try {
      const validated = unitSchema.parse(data);
      const unit = await unitService.createUnit({
        ...validated,
        property_id: propertyId,
      });
      onSuccess(unit);
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error creating unit:', err);
        setErrors({ submit: 'Failed to create unit' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Unit</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Unit Number" error={errors.unit_number} required>
            <Input
              id="unit_number"
              name="unit_number"
              type="text"
              placeholder="e.g., 101"
              error={!!errors.unit_number}
              data-testid="unit-number-input"
            />
          </FormField>

          <FormField label="Floor Plan" error={errors.floor_plan}>
            <Input
              id="floor_plan"
              name="floor_plan"
              type="text"
              placeholder="e.g., 2BR/2BA"
              error={!!errors.floor_plan}
              data-testid="floor-plan-input"
            />
          </FormField>

          <FormField label="Status" error={errors.status} required>
            <Select
              id="status"
              name="status"
              options={[
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'maintenance', label: 'Maintenance' }
              ]}
              error={!!errors.status}
              data-testid="status-select"
            />
          </FormField>

          {errors.submit && (
            <div className="text-red-500 text-sm">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Add Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;
