import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { UserRole } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, status } = useSelector((state: RootState) => state.auth);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};