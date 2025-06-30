//searchPage.tsx
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useCar } from '../api/carManagement';
import CarCard from '../components/CarCard';
// import Map from '../components/Map';

const SearchPage: React.FC = () => {

  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();


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
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Main content */}
          <div>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {availableCars.length} cars available
                {availableCars.length > availableCars.length &&
                  ` (${availableCars.length - availableCars.length} filtered out)`
                }
              </p>
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
        </div>
      </div>
    </div>
  );
};

export default SearchPage;