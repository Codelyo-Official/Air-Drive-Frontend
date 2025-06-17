import { ChevronDown, Menu, User, X } from 'lucide-react';
import React, { useState, useRef } from 'react'; // Import useRef
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to control the visibility of the account dropdown
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  // Ref to store the timeout ID for the dropdown
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isRentYourCar = location.pathname === '/rent-your-car';

  // Function to show the account dropdown
  const showAccountDropdown = () => {
    // Clear any existing timeout to prevent it from closing if re-entered
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsAccountDropdownOpen(true);
  };

  // Function to hide the account dropdown after a delay
  const hideAccountDropdown = () => {
    // Set a timeout to close the dropdown after 5 seconds (5000 milliseconds)
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownOpen(false);
    }, 2000);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md transition-all duration-300"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/air_drive_logo.PNG"
              alt="Air Drive Logo"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-sm font-medium text-white hover:text-amber-500">
              Find cars
            </Link>
            {!isRentYourCar && (
              <Link to="/rent-your-car" className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                Rent your car
              </Link>
            )}
            <Link to="/dashboard">
              <button className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                Dashboard
              </button>
            </Link>
            <Link to="/support">
              <button className="bg-amber-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                Support
              </button>
            </Link>
            {/* Account dropdown with hover delay */}
            <div
              className="relative"
              onMouseEnter={showAccountDropdown} // Show dropdown on mouse enter
              onMouseLeave={hideAccountDropdown}  // Hide dropdown on mouse leave after delay
            >
              <button className="flex items-center text-sm font-medium text-white hover:text-amber-500">
                <User size={18} className="mr-1" />
                <span>Account</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ${isAccountDropdownOpen ? 'block' : 'hidden'}`}
              >
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Log in
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign up
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-black">
            <div className="flex flex-col space-y-4">
              <Link
                to="/search"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find cars
              </Link>
              <Link
                to="/rent-your-car"
                className="text-white hover:text-amber-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Rent your car
              </Link>
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
