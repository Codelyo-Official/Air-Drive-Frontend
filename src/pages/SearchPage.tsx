//searchPage.tsx
import { Calendar, Filter, List, Loader2, Map as MapIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCar } from '../api/carManagement';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import Map from '../components/Map';
import { filterOptions } from '../data/mockData';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();

  console.log("Available cars data:", availableCars);

  // Get search parameters
  const location = searchParams.get('address') || '';
  const startDate = searchParams.get('start_date') || '';
  const endDate = searchParams.get('end_date') || '';
  const startTime = searchParams.get('start_time') || '';
  const endTime = searchParams.get('end_time') || '';

  // Active filters state
  const [activeFilters, setActiveFilters] = useState<{
    priceRange: [number, number];
    carTypes: string[];
    features: string[];
    makes: string[];
  }>({
    priceRange: [0, 2000], // Adjusted based on your API data (max 1500)
    carTypes: [],
    features: [],
    makes: []
  });

  // Toggle map view
  const toggleMapView = () => setShowMap(!showMap);

  // Toggle filters sidebar
  const toggleFilters = () => setShowFilters(!showFilters);

  // Update filters
  const updateFilters = (newFilters: typeof activeFilters) => {
    setActiveFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      priceRange: [0, 2000],
      carTypes: [],
      features: [],
      makes: []
    });
  };

  // Helper function to generate default coordinates for locations
  const getLocationCoordinates = (location: string) => {
    // You should replace this with actual geocoding or store coordinates in your database
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      'Dollar': { lat: 40.7128, lng: -74.0060 }, // Default NYC coordinates
      // Add more locations as needed
    };
    
    return locationMap[location] || { lat: 40.7128, lng: -74.0060 };
  };

  // Transform API data to match CarCard expectations and apply filters
  const filteredResults = useMemo(() => {
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
          reviewCount: 0, // Default - consider adding to API
          // image: car.image_url || '/placeholder-car.jpg', 
          features: [], // Could be derived from transmission, fuel_type, etc.
          location: car.location,
          latitude: car.latitude || coords.lat,
          longitude: car.longitude || coords.lng,
          // owner: car.owner || 'Private Owner', 
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
      .filter(car => {
        // Filter by price
        if (car.pricePerDay < activeFilters.priceRange[0] || car.pricePerDay > activeFilters.priceRange[1]) {
          return false;
        }

        // Filter by make (case-insensitive)
        if (activeFilters.makes.length > 0 && 
            !activeFilters.makes.some(make => make.toLowerCase() === car.make.toLowerCase())) {
          return false;
        }

        // Filter by location if provided in search (case-insensitive)
        if (location && !car.location.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }

        // Enhanced car type filtering
        if (activeFilters.carTypes.length > 0) {
          const hasMatchingType = activeFilters.carTypes.some(type => {
            const lowerType = type.toLowerCase();
            const carTransmission = car.transmission.toLowerCase();
            const carFuelType = car.fuel_type.toLowerCase();
            
            // Match transmission types
            if (lowerType === 'automatic' && (carTransmission === 'automatic' || carTransmission === 'cvt')) {
              return true;
            }
            if (lowerType === 'manual' && carTransmission === 'manual') {
              return true;
            }
            
            // Match fuel types
            if (lowerType === 'electric' && carFuelType === 'electric') {
              return true;
            }
            if (lowerType === 'hybrid' && carFuelType === 'hybrid') {
              return true;
            }
            if (lowerType === 'gasoline' && (carFuelType === 'gasoline' || carFuelType === 'petrol')) {
              return true;
            }
            
            return lowerType === carTransmission || lowerType === carFuelType;
          });
          
          if (!hasMatchingType) return false;
        }

        return true;
      });
  }, [availableCars, activeFilters, location]);

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading available cars...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">
              Error loading cars: {error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-4 md:mb-0 md:mr-8">
              <h1 className="text-xl font-bold mb-1">
                Cars in {location || 'All locations'}
              </h1>

              {(startDate || endDate) && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {startDate || 'Any start date'} {startTime && `at ${startTime}`} {' - '}
                    {endDate || 'Any end date'} {endTime && `at ${endTime}`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 md:ml-auto">
              <button
                onClick={toggleFilters}
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                Filter
                {(activeFilters.makes.length > 0 || 
                  activeFilters.carTypes.length > 0 || 
                  activeFilters.features.length > 0 ||
                  activeFilters.priceRange[0] > 0 ||
                  activeFilters.priceRange[1] < 2000) && (
                  <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-2 py-1">
                    {activeFilters.makes.length + activeFilters.carTypes.length + activeFilters.features.length + 
                     (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 2000 ? 1 : 0)}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMapView}
                className={`px-4 py-2 border rounded-md flex items-center text-sm font-medium ${showMap
                    ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {showMap ? (
                  <>
                    <List size={16} className="mr-2" />
                    List
                  </>
                ) : (
                  <>
                    <MapIcon size={16} className="mr-2" />
                    Map
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Filters sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={activeFilters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            filterOptions={filterOptions}
          />

          {/* Main content */}
          <div className={`flex-1 ${showFilters ? 'md:ml-4' : ''}`}>
            {showMap ? (
              /* Map View */
              <div className="h-[calc(100vh-180px)] rounded-lg overflow-hidden">
                <Map cars={filteredResults} />
              </div>
            ) : (
              /* List View */
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    {filteredResults.length} cars available
                    {availableCars.length > filteredResults.length &&
                      ` (${availableCars.length - filteredResults.length} filtered out)`
                    }
                  </p>
                  
                  {/* Sort dropdown - you can implement sorting logic */}
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-new">Year: Newest First</option>
                    <option value="year-old">Year: Oldest First</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {filteredResults.length === 0 && availableCars.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-amber-600 font-medium hover:text-amber-700"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {availableCars.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No cars are currently available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;