import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail } from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.emailVerified) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyEmail();
      setEmailSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification email');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Mail className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification email to {user.email}. Please check your inbox and click the verification link.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {emailSent && (
          <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md p-4 text-sm text-green-600 dark:text-green-400">
            Verification email sent successfully!
          </div>
        )}

        <div className="mt-4 space-y-4">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;