import type React from "react"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../api/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [], redirectTo = "/login" }) => {
  const { isAuthenticated, getCurrentUser } = useAuth()
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const user = getCurrentUser()

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_type)) {
    // Redirect based on user type if they don't have access
    switch (user?.user_type) {
      case "regular":
        return <Navigate to="/" replace />
      case "owner":
        return <Navigate to="/dashboard" replace />
      case "admin":
        return <Navigate to="/admin" replace />
      default:
        return <Navigate to={redirectTo} replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute




// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../api/auth";

// const ProtectedRoute = () => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
