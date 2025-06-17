import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../api/auth';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;