import React, { useState } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { unitService } from '@/lib/services/unitService';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import { toast } from '@/components/ui/use-toast';
import type { PropertyUnit } from '@/types';

interface UnitDetailsModalProps {
  unit: PropertyUnit;
  onClose: () => void;
  onUpdate: (unit: PropertyUnit) => void;
}

const unitSchema = z.object({
  unit_number: z.string().min(1, 'Unit number is required'),
  floor_plan: z.string().min(1, 'Floor plan is required'),
  status: z.enum(['available', 'occupied', 'maintenance']),
  rent_amount: z.number().min(0, 'Rent amount must be positive'),
  square_feet: z.number().min(0, 'Square footage must be positive'),
  bedrooms: z.number().min(0, 'Number of bedrooms must be positive'),
  bathrooms: z.number().min(0, 'Number of bathrooms must be positive'),
});

export function UnitDetailsModal({ unit, onClose, onUpdate }: UnitDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      unit_number: formData.get('unit_number') as string,
      floor_plan: formData.get('floor_plan') as string,
      status: formData.get('status') as PropertyUnit['status'],
      rent_amount: Number(formData.get('rent_amount')),
      square_feet: Number(formData.get('square_feet')),
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
    };

    try {
      const validated = unitSchema.parse(data);
      const updatedUnit = await unitService.updateUnit(unit.id, {
        ...validated,
        property_id: unit.property_id,
      });
      
      if (updatedUnit) {
        toast({
          title: "Success",
          description: "Unit updated successfully",
        });
        onUpdate(updatedUnit);
        setIsEditing(false);
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
      } else {
        setErrors({ form: 'Failed to update unit. Please try again.' });
      }
      toast({
        title: "Error",
        description: "Failed to update unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}></div>
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Unit Details
            </h2>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Edit
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {errors.form && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Unit Number" error={errors.unit_number} required>
              <Input
                name="unit_number"
                type="text"
                defaultValue={unit.unit_number}
                disabled={!isEditing}
                error={!!errors.unit_number}
              />
            </FormField>

            <FormField label="Floor Plan" error={errors.floor_plan} required>
              <Input
                name="floor_plan"
                type="text"
                defaultValue={unit.floor_plan}
                disabled={!isEditing}
                error={!!errors.floor_plan}
              />
            </FormField>

            <FormField label="Status" error={errors.status} required>
              <select
                name="status"
                defaultValue={unit.status}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </FormField>

            <FormField label="Rent Amount" error={errors.rent_amount} required>
              <Input
                name="rent_amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={unit.rent_amount}
                disabled={!isEditing}
                error={!!errors.rent_amount}
              />
            </FormField>

            <FormField label="Square Feet" error={errors.square_feet} required>
              <Input
                name="square_feet"
                type="number"
                min="0"
                defaultValue={unit.square_feet}
                disabled={!isEditing}
                error={!!errors.square_feet}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Bedrooms" error={errors.bedrooms} required>
                <Input
                  name="bedrooms"
                  type="number"
                  min="0"
                  defaultValue={unit.bedrooms}
                  disabled={!isEditing}
                  error={!!errors.bedrooms}
                />
              </FormField>

              <FormField label="Bathrooms" error={errors.bathrooms} required>
                <Input
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  defaultValue={unit.bathrooms}
                  disabled={!isEditing}
                  error={!!errors.bathrooms}
                />
              </FormField>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}