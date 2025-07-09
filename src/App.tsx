import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

// Layouts
import AdminLayout from "./layouts/AdminLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import MainLayout from "./layouts/MainLayout"
import SupportLayout from "./layouts/SupportLayout"

// Pages
import CarDetailPage from "./pages/CarDetailPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import RentYourCarPage from "./pages/RentYourCarPage"
import SearchPage from "./pages/SearchPage"
import SignupPage from "./pages/SignupPage"
// import AboutPage from "./pages/AboutPage"
import AboutPage from "./components/AboutPage"
// import BlogPage from "./components/BlogPage"
// import ContactPage from "./components/ContactPage"
import ProfilePage from "./components/ProfilePage"
import MyBookingsPage from "./pages/MyBookingsPage"

// Dashboard Pages
// import Analytics from "./pages/dashboard/Analytics"
import CarList from "./pages/dashboard/CarList"
import Chat from "./pages/dashboard/Chat"
import CreateCar from "./pages/dashboard/CreateCar"
// import DashboardHome from "./pages/dashboard/Dashboard"
import OwnerBookingPage from "./pages/dashboard/OwnerBookingPage"
// import Profile from "./pages/dashboard/Profile"

// Support Pages
// import Settings from "./pages/support/Profile"
import Tickets from "./pages/support/Tickets"
// import Vehicles from "./pages/support/Vehicles"

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import BookingManagement from "./pages/admin/BookingManagement"
import CarManagement from "./pages/admin/CarManagement"
import ReportManagement from "./pages/admin/ReportManagement"
import Revenue from "./pages/admin/Revenue"
import UserManagement from "./pages/admin/UserManagement"

// Components
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import TanstackProvider from "./providers/TanstackProvider"

import { ToastContainer } from "react-toastify"
import AccessibilityPage from "./components/AccessibilityPage"
import CookiePage from "./components/CookiePage"
import PrivacyPage from "./components/PrivacyPage"
import TermsPage from "./components/TermsPage"
import CreateSupportUser from "./pages/admin/CreateSupportUser"
import UserSupportPage from "./pages/TicketPage"
{/* Legal Pages */ }

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <TanstackProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes - Only accessible when not logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Main Website Routes - Accessible to all authenticated users */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="cars/:carId" element={<CarDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              {/* <Route path="blog" element={<BlogPage />} /> */}
              {/* <Route path="contact" element={<ContactPage />} /> */}
              <Route path="profiles" element={<ProfilePage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />

              <Route path="tickets" element={<UserSupportPage />} />
              {/* Legal Pages */}
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="cookies" element={<CookiePage />} />
              <Route path="accessibility" element={<AccessibilityPage />} />

              {/* Rent your car - only for owners and admins */}
              <Route
                path="rent-your-car"
                element={
                  <ProtectedRoute allowedRoles={["regular"]}>
                    <RentYourCarPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Dashboard Routes - Only for owners and admins */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["owner", "admin"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* <Route index element={<DashboardHome />} /> */}
              {/* <Route path="analytics" element={<Analytics />} /> */}
              {/* <Route path="car-list" element={<CarList />} /> */}
              <Route index element={<CarList />} />
              <Route path="owner-bookings" element={<OwnerBookingPage />} />
              <Route path="profiles" element={<ProfilePage />} />
              <Route path="create-car" element={<CreateCar />} />
              <Route path="chat" element={<Chat />} />
            </Route>

            {/* Support Dashboard Routes - Only for owners and admins */}
            <Route
              path="/support"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <SupportLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Tickets />} />
              <Route path="tickets" element={<Tickets />} />
              {/* <Route path="vehicles" element={<Vehicles />} /> */}
              {/* <Route
                path="settings"
                element={<Settings user={{ name: "John Doe", email: "john@example.com", avatar: "" }} />}
              /> */}
            </Route>

            {/* Admin Routes - Only for admins */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="car-management" element={<CarManagement />} />
              <Route path="booking-management" element={<BookingManagement />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="report-management" element={<ReportManagement />} />
              <Route path="create-support-user" element={<CreateSupportUser />} />
              <Route path="profiles" element={<ProfilePage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </TanstackProvider>
  )
}

export default App
