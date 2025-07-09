import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../api/auth"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { getRoleBasedRedirect } from "../utils/roleRedirect"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string>("")

  // Clear general error when typing starts again
  useEffect(() => {
    if (generalError) {
      setGeneralError("")
    }
  }, [username, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    if (!username.trim() || !password) {
      setGeneralError("Please enter both username and password.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("username", username.trim())
      formData.append("password", password)

      const result = await login.mutateAsync(formData)

      // Get the redirect path based on user role
      const redirectPath = getRoleBasedRedirect(result.user.user_type)

      // Check if there's a previous location to redirect to
      const from = location.state?.from?.pathname

      // Only redirect to 'from' if the user has access to that route
      if (from && from !== "/login") {
        const { canAccessRoute } = await import("../utils/roleRedirect")
        if (canAccessRoute(result.user.user_type, from)) {
          navigate(from, { replace: true })
          return
        }
      }

      // Otherwise, redirect to role-based default
      navigate(redirectPath, { replace: true })
    } catch (error: unknown) {
      console.error("Login failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again."
      setGeneralError(errorMessage)
    }
  }

  return (
    <>
      <Header />
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your Air Drive account</p>
          </div>

          {generalError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex" role="alert">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{generalError}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                {/* <Link to="/forgot-password" className="font-medium text-amber-600 hover:text-amber-500">
                Forgot your password?
              </Link> */}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {login.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-amber-600 hover:text-amber-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />

    </>
  )
}

export default LoginPage
