import React from 'react';
import { z } from 'zod';
import { authService } from '../../lib/services/authService';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Card from '../ui/Card';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SecuritySettings: React.FC = () => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    try {
      const validated = passwordSchema.parse(data);
      await authService.updatePassword(validated.currentPassword, validated.newPassword);
      setSuccessMessage('Password updated successfully');
      e.currentTarget.reset();
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
        setErrors({ form: 'Failed to update password. Please verify your current password.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/50 dark:text-green-400">
          {successMessage}
        </div>
      )}

      {errors.form && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Current Password" error={errors.currentPassword} required>
          <Input
            name="currentPassword"
            type="password"
            error={!!errors.currentPassword}
          />
        </FormField>

        <FormField label="New Password" error={errors.newPassword} required>
          <Input
            name="newPassword"
            type="password"
            error={!!errors.newPassword}
          />
        </FormField>

        <FormField label="Confirm New Password" error={errors.confirmPassword} required>
          <Input
            name="confirmPassword"
            type="password"
            error={!!errors.confirmPassword}
          />
        </FormField>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default SecuritySettings;
