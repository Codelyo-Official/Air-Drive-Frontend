// AdminSidebar.tsx
import {
  CalendarDays,
  Car,
  DollarSign,
  FileBarChart,
  Home,
  Users
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import type { User } from "../../types"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: User
  onLogout: () => void
}

interface MenuItem {
  id: string
  name: string
  icon: React.ReactNode
  route: string
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const location = useLocation()

  const menuItems: MenuItem[] = [
    {
      id: "admin",
      name: "Admin Dashboard",
      route: "/admin",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "user",
      name: "User Management",
      route: "/admin/user-management",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "carManagement",
      name: "Car Management",
      route: "/admin/car-management",
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: "bookingManagement",
      name: "Booking Management",
      route: "/admin/booking-management",
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: "revenue",
      name: "Revenue",
      route: "/admin/revenue",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "report",
      name: "Report Management",
      route: "/admin/report-management",
      icon: <FileBarChart className="w-5 h-5" />,
    },
  ]

  const handleMenuClick = (itemId: string): void => {
    setActiveTab(itemId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-amber-500 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <Link to="/admin" onClick={() => setActiveTab("admin")}>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-black">
            <div className="flex items-center justify-center">
              <img
                src="/air_drive_logo.PNG"
                alt="Air Drive Logo"
                className="h-16 w-auto"
              />
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              // Determine if this menu item is active based on the current route or activeTab
              const isActive =
                activeTab === item.id ||
                (location.pathname === item.route ||
                  (item.route !== "/admin" && location.pathname.startsWith(item.route)))
              return (
                <li key={item.id}>
                  <Link
                    to={item.route}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${isActive
                      ? "bg-amber-50 text-amber-700 border-r-2 border-amber-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <img
              src={user.avatar || "/placeholder.svg?height=40&width=40"}
              alt={user.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.user_type}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
             Admin Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
