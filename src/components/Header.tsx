import { ChevronDown, Menu, User, X } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../api/auth"

interface HeaderProps {
  isScrolled: boolean
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Add authentication hooks
  const { isAuthenticated, getCurrentUser, logout } = useAuth()
  const user = getCurrentUser()
  const userType = user?.user_type

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const isRentYourCar = location.pathname === "/rent-your-car"

  const showAccountDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setIsAccountDropdownOpen(true)
  }

  const hideAccountDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownOpen(false)
    }, 2000)
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      navigate('/')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/air_drive_logo.PNG" alt="Air Drive Logo" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Public Links - Always visible */}
            <Link to="/" className="text-sm font-medium text-white hover:text-amber-500">
              Home
            </Link>
            <Link to="/search" className="text-sm font-medium text-white hover:text-amber-500">
              Find cars
            </Link>

             {isAuthenticated() && (userType === "regular") && (
              <Link
                to="/my-bookings"
                className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
              >
               My Bookings
              </Link>
            )}
            <Link to="/about" className="text-sm font-medium text-white hover:text-amber-500">
              About Us
            </Link>
            {/* <Link to="/blog" className="text-sm font-medium text-white hover:text-amber-500">
              Blog
            </Link>
            <Link to="/contact" className="text-sm font-medium text-white hover:text-amber-500">
              Contact
            </Link> */}


            {/* Role-based Navigation */}
            {isAuthenticated() && (userType === "regular") && !isRentYourCar && (
              <Link
                to="/rent-your-car"
                className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                Rent your car
              </Link>
            )}

            {isAuthenticated() && (userType === "owner" || userType === "admin") && (
              <Link to="/dashboard">
                <button className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                  Dashboard
                </button>
              </Link>
            )}

            {isAuthenticated() && (userType === "support") && (
              <Link to="/support">
                <button className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                  Support
                </button>
              </Link>
            )}

            {isAuthenticated() && userType === "admin" && (
              <Link to="/admin">
                <button className="bg-red-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                  Admin
                </button>
              </Link>
            )}

            {/* Account dropdown */}
            <div className="relative" onMouseEnter={showAccountDropdown} onMouseLeave={hideAccountDropdown}>
              <button className="flex items-center text-sm font-medium text-white hover:text-amber-500">
                <User size={18} className="mr-1" />
                <span>{isAuthenticated() ? user?.first_name || "Account" : "Account"}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ${isAccountDropdownOpen ? "block" : "hidden"}`}
              >
                {isAuthenticated() ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">{user?.email}</div>
                    <Link to="/profiles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {(userType === "owner" || userType === "admin") && (
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    )}
                      {(userType === "regular") && (
                      <Link to="/tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ticket
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      disabled={logout.isPending}
                    >
                      {logout.isPending ? "Logging out..." : "Log out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Log in
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-black">
            <div className="flex flex-col space-y-4">
              {/* Public Links */}
              <Link to="/" className="text-white hover:text-amber-500 font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link
                to="/search"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find cars
              </Link>
              {isAuthenticated() && (
                <Link
                  to="/my-bookings"
                  className="text-white hover:text-amber-500 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              <Link
                to="/about"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              {/* <Link
                to="/blog"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link> */}

              {/* Role-based Mobile Links */}
              {isAuthenticated() && (userType === "owner" || userType === "admin") && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/support"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <Link
                    to="/rent-your-car"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Rent your car
                  </Link>
                </>
              )}

              {isAuthenticated() && userType === "admin" && (
                <Link
                  to="/admin"
                  className="text-white hover:text-amber-500 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              {/* Authentication Links */}
              {isAuthenticated() ? (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-white hover:text-amber-500 font-medium"
                    disabled={logout.isPending}
                  >
                    {logout.isPending ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="text-white hover:text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
