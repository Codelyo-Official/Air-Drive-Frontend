export const getRoleBasedRedirect = (userType: string): string => {
  switch (userType) {
    case "regular":
      return "/"
    case "owner":
      return "/dashboard"
    case "admin":
      return "/admin"
    default:
      return "/"
  }
}

export const canAccessRoute = (userType: string, route: string): boolean => {
  // Admin can access all routes
  if (userType === "admin") {
    return true
  }

  // Owner can access all routes except admin routes
  if (userType === "owner") {
    return !route.startsWith("/admin")
  }

  // Regular users can only access public routes (not dashboard or admin)
  if (userType === "regular") {
    return !route.startsWith("/dashboard") && !route.startsWith("/admin") && !route.startsWith("/support")
  }

  return false
}
