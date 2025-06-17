import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import SupportLayout from './layouts/SupportLayout';

// Pages
import CarDetailPage from './pages/CarDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RentYourCarPage from './pages/RentYourCarPage';
import SearchPage from './pages/SearchPage';
import SignupPage from './pages/SignupPage';

// Dashboard Pages
import Analytics from './pages/dashboard/Analytics';
import CarList from './pages/dashboard/CarList';
import Chat from './pages/dashboard/Chat';
import CreateCar from './pages/dashboard/CreateCar';
import DashboardHome from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';

// Support Pages
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './components/PublicRoute';
import Settings from './pages/support/Profile';
import Tickets from './pages/support/Tickets';
import Vehicles from './pages/support/Vehicles';
import TanstackProvider from './providers/TanstackProvider';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <TanstackProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Main Website Routes */}
            {/* Public Routes */}
            {/* <Route element={<PublicRoute />}> */}
            <Route path="/" element={<MainLayout />}>
              {/* <Route index element={<Navigate to="/login" />} /> */}
              <Route index element={<HomePage />} />

              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              {/* </Route> */}


              <Route path="home" element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="cars/:carId" element={<CarDetailPage />} />
              <Route path="rent-your-car" element={<RentYourCarPage />} />
            </Route>

            {/* Dashboard Routes */}
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="car-list" element={<CarList />} />
                <Route
                  path="profile"
                  element={<Profile />}
                />
                <Route path="create-car" element={<CreateCar />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            {/* </Route> */}


            {/* Support Dashboard Routes */}
            <Route path="/support" element={<SupportLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="chat" element={<Chat />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route
                path="settings"
                element={<Settings user={{ name: 'John Doe', email: 'john@example.com', avatar: '' }} />}
              />
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
  );
}

export default App;
