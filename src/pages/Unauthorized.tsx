import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Access Denied
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => navigate('/')} variant="outline">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate(-1)} variant="default">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;