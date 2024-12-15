import React, { useState } from 'react';
import { z } from 'zod';
import { unitService } from '../../lib/services/unitService';
import type { PropertyUnit } from '../../types';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Select from '../ui/Form/Select';

interface UnitDetailsModalProps {
  unit: PropertyUnit;
  onClose: () => void;
  onUpdate: (unit: PropertyUnit) => void;
  onDelete: (unitId: string) => void;
}

const unitSchema = z.object({
  unit_number: z.string().min(1, 'Unit number is required'),
  floor_plan: z.string().nullable(),
  status: z.enum(['available', 'occupied', 'maintenance']),
});

const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({ 
  unit, 
  onClose, 
  onUpdate,
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);

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
      const updatedUnit = await unitService.updateUnit(unit.id, validated);
      if (updatedUnit) {
        onUpdate(updatedUnit);
        setIsEditing(false);
      }
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
        console.error('Error updating unit:', err);
        setErrors({ submit: 'Failed to update unit' });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await unitService.deleteUnit(unit.id);
      onDelete(unit.id);
      onClose();
    } catch (err) {
      console.error('Error deleting unit:', err);
      setErrors({ submit: 'Failed to delete unit' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Unit Details</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 hover:text-purple-700"
              data-testid="edit-button"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Unit Number" error={errors.unit_number} required>
            <Input
              id="unit_number"
              name="unit_number"
              type="text"
              defaultValue={unit.unit_number}
              disabled={!isEditing}
              error={!!errors.unit_number}
              data-testid="unit-number-input"
            />
          </FormField>

          <FormField label="Floor Plan" error={errors.floor_plan}>
            <Input
              id="floor_plan"
              name="floor_plan"
              type="text"
              defaultValue={unit.floor_plan || ''}
              disabled={!isEditing}
              error={!!errors.floor_plan}
              data-testid="floor-plan-input"
            />
          </FormField>

          <FormField label="Status" error={errors.status} required>
            <Select
              id="status"
              name="status"
              defaultValue={unit.status}
              disabled={!isEditing}
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

          <div className="flex justify-between mt-6">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                  data-testid="delete-button"
                >
                  Delete Unit
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={isEditing ? () => setIsEditing(false) : onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
              >
                {isEditing ? 'Cancel' : 'Close'}
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                  data-testid="save-button"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>

        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this unit? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  data-testid="confirm-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitDetailsModal;
