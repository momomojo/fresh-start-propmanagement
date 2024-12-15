import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { RootState } from '../../lib/store';
import { setUser } from '../../lib/store/slices/authSlice';
import { authService } from '../../lib/services/authService';
import FormField from '../ui/Form/FormField';
import Input from '../ui/Form/Input';
import Card from '../ui/Card';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar_url: z.string().url('Invalid URL').optional(),
});

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = React.useState(false);
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
      avatar_url: formData.get('avatar_url') as string,
    };

    try {
      const validated = profileSchema.parse(data);
      const updatedUser = await authService.updateProfile(validated);
      dispatch(setUser(updatedUser));
      setIsEditing(false);
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
        setErrors({ form: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-500"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {errors.form && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {errors.form}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name" error={errors.name} required>
            <Input
              name="name"
              type="text"
              defaultValue={user.name}
              error={!!errors.name}
            />
          </FormField>

          <FormField label="Email Address" error={errors.email} required>
            <Input
              name="email"
              type="email"
              defaultValue={user.email}
              error={!!errors.email}
              disabled
            />
          </FormField>

          <FormField label="Avatar URL" error={errors.avatar_url}>
            <Input
              name="avatar_url"
              type="url"
              defaultValue={user.avatar_url}
              error={!!errors.avatar_url}
              placeholder="https://example.com/avatar.jpg"
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserProfile;
