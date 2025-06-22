import {
  ChevronDown,
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth';
import AdminSidebar from '../pages/admin/AdminSidebar';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const user = {
    name: userData?.username,
    email: userData?.email,
    user_type: userData?.user_type,
    avatar: 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869153.jpg?ga=GA1.1.1363370257.1750433455&semt=ais_hybrid&w=740'
  };

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/'),
    });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* AdminSidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          user_type: user?.user_type,
          avatar: user?.avatar
        }}
        onLogout={onLogout}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin Dashboard Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 hidden md:flex">Admin</h1>
            <h1 className="text-2xl font-semibold text-gray-900 flex md:hidden"></h1>

            {/* User menu */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className="flex items-center space-x-2">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.avatar}
                    alt="User avatar"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.avatar}
                        alt="User avatar"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/admin/profiles")
                        // console.log('View Profile clicked');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        console.log('Settings clicked');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Admin Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
