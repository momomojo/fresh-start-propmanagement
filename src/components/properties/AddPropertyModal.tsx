import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { z } from 'zod';
import { createProperty, updateProperty } from '../../lib/store/slices/propertySlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Select from '@/components/ui/Form/Select';
import { RootState, AppDispatch } from '../../lib/store/index';
import { User, Property } from '../../types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
}

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['apartment', 'house', 'commercial']),
  description: z.string().optional(),
  units: z.number().min(0, 'Number of units must be 0 or greater'),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['available', 'occupied', 'maintenance']),
  manager_id: z.string().optional()
});

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, property }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useAuth();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [propertyManagers, setPropertyManagers] = React.useState<User[]>([]);

  const isEditing = !!property;

  React.useEffect(() => {
    // Fetch property managers from Firestore
    const fetchPropertyManagers = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'property_manager'))
        );
        const managers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setPropertyManagers(managers);
      } catch (error) {
        console.error('Error fetching property managers:', error);
        setErrors(prev => ({ ...prev, manager_id: 'Failed to load property managers' }));
      }
    };

    fetchPropertyManagers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const amenities = Array.from(formData.getAll('amenities')) as string[];

    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as 'apartment' | 'house' | 'commercial' || 'apartment',
      description: formData.get('description') as string,
      units: Number(formData.get('units')) || 0,
      amenities,
      status: formData.get('status') as 'available' | 'occupied' | 'maintenance' || 'available',
      manager_id: formData.get('manager_id') as string | undefined,
    };

    try {
      const validated = propertySchema.parse(data);
      if (isEditing && property) {
        const result = await dispatch(updateProperty({ 
          id: property.id, 
          data: {
            ...validated,
            updated_at: new Date().toISOString()
          }
        })).unwrap();
        
        if (result) {
          toast({
            title: "Success",
            description: "Property updated successfully",
          });
          onClose();
        }
      } else {
        const result = await dispatch(createProperty({
          ...validated,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })).unwrap();
        
        if (result) {
          toast({
            title: "Success",
            description: "Property created successfully",
          });
          onClose();
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      } else {
        setErrors({ form: 'Failed to create property. Please try again.' });
        toast({
          title: "Error",
          description: "Failed to save property. Please try again.",
          variant: "destructive",
        });
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
              {isEditing ? 'Edit Property' : 'Add New Property'}
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
                defaultValue={property?.name}
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Address" error={errors.address} required>
              <Input
                name="address"
                type="text"
                defaultValue={property?.address}
                error={!!errors.address}
              />
            </FormField>

            <FormField label="Description" error={errors.description}>
              <Input
                name="description"
                type="text"
                placeholder="Brief description of the property"
                error={!!errors.description}
              />
            </FormField>

            <FormField label="Number of Units" error={errors.units} required>
              <Input
                name="units"
                type="number"
                min="1"
                defaultValue={property?.units || "1"}
                placeholder="Total number of units"
                error={!!errors.units}
              />
            </FormField>

            <FormField label="Amenities" error={errors.amenities}>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="amenities" value="parking" />
                  <span>Parking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="amenities" value="pool" />
                  <span>Pool</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="amenities" value="gym" />
                  <span>Gym</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="amenities" value="security" />
                  <span>Security</span>
                </label>
              </div>
            </FormField>
            <FormField label="Status" error={errors.status} required>
              <Select
                name="status"
                defaultValue={property?.type || 'apartment'}
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'maintenance', label: 'Under Maintenance' }
                ]}
                error={!!errors.status}
              />
            </FormField>
            
            <FormField label="Property Manager" error={errors.manager_id}>
              <Select
                name="manager_id"
                defaultValue={property?.manager_id || currentUser?.id || ''}
                options={propertyManagers.map((manager: User) => ({
                  value: manager.id,
                  label: manager.name,
                }))}
                error={!!errors.manager_id}
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
                {isLoading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Property')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;
