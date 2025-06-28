//searchPage.tsx
import { Calendar, Filter, List, Loader2, Map as MapIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useCar } from '../api/carManagement';
import CarCard from '../components/CarCard';
// import Map from '../components/Map';

const SearchPage: React.FC = () => {
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();

  console.log("availableCars=-=-=-=-=",availableCars)

  // Toggle map view
  const toggleMapView = () => setShowMap(!showMap);

  // Toggle filters sidebar
  const toggleFilters = () => setShowFilters(!showFilters);


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
              {/* <h1 className="text-xl font-bold mb-1">
                Cars in {location || 'All locations'}
              </h1> */}

            </div>

            <div className="flex items-center space-x-2 md:ml-auto">
              <button
                onClick={toggleFilters}
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                Filter
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
          {/* Main content */}
          <div className={`flex-1 ${showFilters ? 'md:ml-4' : ''}`}>
            {showMap ? (
              /* Map View */
              <div className="h-[calc(100vh-180px)] rounded-lg overflow-hidden">
                {/* <Map  cars={cars}/> */}
              </div>
            ) : (
              /* List View */
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    {availableCars.length} cars available
                    {availableCars.length > availableCars.length &&
                      ` (${availableCars.length - availableCars.length} filtered out)`
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
                  {availableCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {availableCars.length === 0 && availableCars.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
                    <button
                      // onClick={clearFilters}
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