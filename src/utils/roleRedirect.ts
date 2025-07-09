export const getRoleBasedRedirect = (userType: string): string => {
  switch (userType) {
    case "regular":
      return "/";
    case "owner":
      return "/dashboard";
    case "admin":
      return "/admin";
    case "support":
      return "/support";
    default:
      return "/";
  }
}

export const canAccessRoute = (userType: string, route: string): boolean => {
  // Admin can access all routes
  if (userType === "admin") {
    return true;
  }

  // Support can access only /support and public routes (not dashboard or admin)
  if (userType === "support") {
    return route.startsWith("/support") || (!route.startsWith("/dashboard") && !route.startsWith("/admin"));
  }

  // Owner can access all routes except admin routes
  if (userType === "owner") {
    return !route.startsWith("/admin");
  }

  // Regular users can only access public routes (not dashboard, admin, or support)
  if (userType === "regular") {
    return !route.startsWith("/dashboard") && !route.startsWith("/admin") && !route.startsWith("/support");
  }

  return false;
}
