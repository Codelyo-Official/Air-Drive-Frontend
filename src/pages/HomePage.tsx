import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, DollarSign, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import CarCard from '../components/CarCard';
import { useCar } from '../api/carManagement';

const HomePage: React.FC = () => {
  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();

  // Helper function to generate default coordinates for locations
  const getLocationCoordinates = (location: string) => {
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      'Dollar': { lat: 40.7128, lng: -74.0060 }, // Default NYC coordinates
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Miami': { lat: 25.7617, lng: -80.1918 },
      // Add more locations as needed
    };
    
    return locationMap[location] || { lat: 40.7128, lng: -74.0060 };
  };

  // Transform API data for CarCard component and get featured cars (latest 6)
  const featuredCars = useMemo(() => {
    if (!availableCars.length) return [];

    return availableCars
      .map(car => {
        const coords = getLocationCoordinates(car.location);
        return {
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          pricePerDay: parseFloat(car.daily_rate),
          rating: 4.5, // Default rating - consider adding to API
          reviewCount: Math.floor(Math.random() * 50) + 10, // Random for demo
          features: [], // Could be derived from transmission, fuel_type, etc.
          location: car.location,
          latitude: car.latitude || coords.lat,
          longitude: car.longitude || coords.lng,
          color: car.color,
          license_plate: car.license_plate,
          description: car.description || `${car.year} ${car.make} ${car.model}`,
          seats: car.seats,
          transmission: car.transmission,
          fuel_type: car.fuel_type,
          status: car.status || 'available',
          auto_approve_bookings: car.auto_approve_bookings || false
        };
      })
      .filter(car => car.status === 'available')
      .sort((a, b) => b.year - a.year) // Sort by newest first
      .slice(0, 6); // Take first 6 cars
  }, [availableCars]);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const totalCars = availableCars.length;
    const availableCount = availableCars.filter(car => car.status === 'available').length;
    const uniqueLocations = new Set(availableCars.map(car => car.location)).size;
    
    return {
      carsAvailable: availableCount > 0 ? `${availableCount}+` : '15K+',
      locations: uniqueLocations > 0 ? `${uniqueLocations}+` : '60+',
      customers: '250K+', // Keep static for now
      rating: '4.9★' // Keep static for now
    };
  }, [availableCars]);

  // Featured Cars Component
  const FeaturedCarsSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <span className="text-gray-600">Loading latest cars...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-red-500 text-lg">Error loading cars</span>
          </div>
          <p className="text-gray-600 mb-4">Unable to load latest vehicles at the moment.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (featuredCars.length === 0) {
      return (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No cars available at the moment.</p>
          <p className="text-gray-400">Check back later for new listings!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
            }}
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative w-full mt-[80px] my-[40%] sm:my-[8%] lg:my-[5%]">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Text */}
            <div className="mb-8 lg:mb-12 space-y-4 lg:space-y-6">
              <div className="space-y-2 pt-[80px]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  <span className="block text-white drop-shadow-2xl mb-2">
                    Find the perfect car
                  </span>
                  <span className="block text-amber-300 drop-shadow-lg animate-pulse">
                    for your next adventure
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
                Book premium cars from trusted local hosts around the world.
                <span className="block sm:inline"> Experience freedom, comfort, and reliability.</span>
              </p>
            </div>

            {/* Search Form Card */}
            <div className="max-w-5xl mx-auto mb-8 lg:mb-12">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:bg-white/100 hover:shadow-3xl transition-all duration-300 mx-4 sm:mx-0">
                <SearchForm />
              </div>
            </div>

            {/* Dynamic Trust Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {stats.carsAvailable}
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Cars Available</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {stats.locations}
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Locations</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {stats.customers}
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Happy Customers</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {stats.rating}
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Air Drive Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Find the perfect car</h3>
              <p className="text-gray-600">
                Choose from a wide selection of cars with verified reviews, flexible pickup options, and affordable prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Book instantly</h3>
              <p className="text-gray-600">
                Book directly on our platform with instant confirmation. No waiting for host approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Drive with peace of mind</h3>
              <p className="text-gray-600">
                Every trip includes insurance coverage and 24/7 roadside assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section - Now Dynamic */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Cars</h2>
            <p className="text-gray-600">
              {isLoading 
                ? "Loading our latest vehicles..." 
                : featuredCars.length > 0 
                  ? `Discover ${featuredCars.length} of our newest vehicles` 
                  : "Check back soon for new vehicles"
              }
            </p>
          </div>

          <FeaturedCarsSection />

          {featuredCars.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/search" 
                className="inline-block bg-amber-500 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors"
              >
                View all {availableCars.length} cars
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Rent Your Car Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Make money renting your car</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Turn your car into a second paycheck and earn income on your own schedule.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <DollarSign size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Earn up to $1,000 per month renting your car</span>
                </li>
                <li className="flex items-start">
                  <Shield size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>$1M insurance protection for every trip</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Set your own availability and pricing</span>
                </li>
              </ul>

              <Link to="/rent-your-car" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors">
                Get started
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4549414/pexels-photo-4549414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Earn money with your car"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white text-black p-6 rounded-lg shadow-lg md:max-w-xs">
                <p className="font-bold text-lg mb-2">Average monthly earnings</p>
                <p className="text-3xl font-bold text-amber-500">$850</p>
                <p className="text-gray-600 mt-2">Based on 15 days of rental per month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Renter</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I needed a car for a weekend trip and Air Drive made it super easy. The booking process was smooth and the car was exactly as described. Will definitely use again!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-gray-600 text-sm">Car Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been renting my car on Air Drive for 6 months now and it's been a great experience. The extra income helps pay for my car expenses, and the platform is easy to use."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer Lee</h4>
                  <p className="text-gray-600 text-sm">Renter</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Air Drive saved my trip when my car broke down last minute. I found a great replacement in minutes and was able to pick it up just a few blocks away. Lifesaver!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already saving money and earning income with Air Drive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/search" >
              <button className="bg-white text-amber-500 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Find a car
              </button>
            </Link>
            <Link to="/rent-your-car" >
              <button className="bg-amber-600 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-700 transition-colors">
                Rent your car
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;