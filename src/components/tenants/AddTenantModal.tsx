import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { z } from 'zod';
import { tenantService } from '../../lib/services/tenantService';
import { addTenant } from '../../lib/store/slices/tenantSlice';
import { RootState } from '../../lib/store';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Select from '@/components/ui/Form/Select';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  unit_id: z.string().uuid('Please select a unit'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  rent_amount: z.number().positive('Rent amount must be positive'),
  deposit_amount: z.number().positive('Deposit amount must be positive'),
});

const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { properties } = useSelector((state: RootState) => state.properties);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      unit_id: formData.get('unit_id') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      rent_amount: Number(formData.get('rent_amount')),
      deposit_amount: Number(formData.get('deposit_amount')),
    };

    try {
      const validated = tenantSchema.parse(data);
      const newTenant = await tenantService.createTenant({
        email: validated.email,
        password: validated.password,
        name: validated.name,
        lease: {
          unit_id: validated.unit_id,
          start_date: validated.start_date,
          end_date: validated.end_date,
          rent_amount: validated.rent_amount,
          deposit_amount: validated.deposit_amount,
          status: 'active'
        }
      });
      
      dispatch(addTenant(newTenant));
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
        setErrors({ form: 'Failed to create tenant. Please try again.' });
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
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Tenant
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" error={errors.name} required>
                <Input
                  name="name"
                  type="text"
                  error={!!errors.name}
                />
              </FormField>

              <FormField label="Email Address" error={errors.email} required>
                <Input
                  name="email"
                  type="email"
                  error={!!errors.email}
                />
              </FormField>

              <FormField label="Password" error={errors.password} required>
                <Input
                  name="password"
                  type="password"
                  error={!!errors.password}
                />
              </FormField>

              <FormField label="Property Unit" error={errors.unit_id} required>
                <Select
                  name="unit_id"
                  options={properties.flatMap(property => 
                    Array.from({ length: property.units }, (_, i) => ({
                      value: `${property.id}-unit-${i + 1}`,
                      label: `${property.name} - Unit ${i + 1}`
                    }))
                  )}
                  error={!!errors.unit_id}
                />
              </FormField>

              <FormField label="Lease Start Date" error={errors.start_date} required>
                <Input
                  name="start_date"
                  type="date"
                  error={!!errors.start_date}
                />
              </FormField>

              <FormField label="Lease End Date" error={errors.end_date} required>
                <Input
                  name="end_date"
                  type="date"
                  error={!!errors.end_date}
                />
              </FormField>

              <FormField label="Monthly Rent" error={errors.rent_amount} required>
                <Input
                  name="rent_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  error={!!errors.rent_amount}
                />
              </FormField>

              <FormField label="Security Deposit" error={errors.deposit_amount} required>
                <Input
                  name="deposit_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  error={!!errors.deposit_amount}
                />
              </FormField>
            </div>

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
                {isLoading ? 'Creating...' : 'Create Tenant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTenantModal;