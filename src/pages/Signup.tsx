// src/pages/Signup.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Building2 } from 'lucide-react';
import { z } from 'zod';
import { authService } from '../lib/services/authService';
import FormField from '../components/ui/Form/FormField';
import Input from '../components/ui/Form/Input';
import Select from '../components/ui/Form/Select';
import type { UserRole } from '../types';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'property_manager', 'tenant'] as const)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
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
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      role: formData.get('role') as UserRole,
    };
    try {
      const validated = signupSchema.parse(data);
      const { user } = await authService.signup({
        email: validated.email,
        password: validated.password,
        name: validated.name,
        role: validated.role,
      });
      dispatch(setUser(user));
      navigate('/');
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
        setErrors({ form: error instanceof Error ? error.message : 'Signup failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              sign in to your account
            </a>
          </p>
        </div>
        {errors.form && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-600 dark:text-red-400">
            {errors.form}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormField label="Full Name" error={errors.name} required>
              <Input
                name="name"
                type="text"
                autoComplete="name"
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email} required>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" error={errors.password} required>
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
              />
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword} required>
              <Input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
              />
            </FormField>

            <FormField label="Role" error={errors.role} required>
              <Select
                name="role"
                options={[
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'property_manager', label: 'Property Manager' },
                  { value: 'admin', label: 'Administrator' }
                ]}
                error={!!errors.role}
              />
            </FormField>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
    </div>
  </div>
  );
};

export default Signup;
