import React from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { z } from 'zod';
import { propertyService } from '../../lib/services/propertyService';
import { addProperty } from '../../lib/store/slices/propertySlice';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Select from '../ui/Form/Select';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['apartment', 'house', 'commercial']),
  units: z.number().min(1, 'Must have at least 1 unit'),
  status: z.enum(['available', 'occupied', 'maintenance'])
});

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as 'apartment' | 'house' | 'commercial',
      units: Number(formData.get('units')),
      status: formData.get('status') as 'available' | 'occupied' | 'maintenance'
    };

    try {
      const validated = propertySchema.parse(data);
      const newProperty = await propertyService.createProperty(validated);
      dispatch(addProperty(newProperty));
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: 'Failed to create property. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Property
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Property Name" error={errors.name} required>
              <Input
                name="name"
                type="text"
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Address" error={errors.address} required>
              <Input
                name="address"
                type="text"
                error={!!errors.address}
              />
            </FormField>

            <FormField label="Type" error={errors.type} required>
              <Select
                name="type"
                options={[
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'house', label: 'House' },
                  { value: 'commercial', label: 'Commercial' }
                ]}
                error={!!errors.type}
              />
            </FormField>

            <FormField label="Number of Units" error={errors.units} required>
              <Input
                name="units"
                type="number"
                min="1"
                error={!!errors.units}
              />
            </FormField>

            <FormField label="Status" error={errors.status} required>
              <Select
                name="status"
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'maintenance', label: 'Under Maintenance' }
                ]}
                error={!!errors.status}
              />
            </FormField>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;