import type React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../api/auth"

const PublicRoute: React.FC = () => {
  const { isAuthenticated, getCurrentUser } = useAuth()

  if (isAuthenticated()) {
    const user = getCurrentUser()

    // Redirect authenticated users to their appropriate dashboard
    switch (user?.user_type) {
      case "regular":
        return <Navigate to="/" replace />
      case "owner":
        return <Navigate to="/dashboard" replace />
      case "admin":
        return <Navigate to="/admin" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}

export default PublicRoute



// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../api/auth';

// const PublicRoute = () => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
// };

// export default PublicRoute;