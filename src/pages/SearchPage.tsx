import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Calendar, List, Map as MapIcon } from 'lucide-react';
import { mockSearchResults, filterOptions } from '../data/mockData';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import Map from '../components/Map';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
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
    priceRange: [0, 200],
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
      priceRange: [0, 200],
      carTypes: [],
      features: [],
      makes: []
    });
  };
  
  // Filter the search results
  const filteredResults = mockSearchResults.filter(car => {
    // Filter by price
    if (car.pricePerDay < activeFilters.priceRange[0] || car.pricePerDay > activeFilters.priceRange[1]) {
      return false;
    }
    
    // Filter by make
    if (activeFilters.makes.length > 0 && !activeFilters.makes.includes(car.make)) {
      return false;
    }
    
    // For car types and features, we would need more data in our mock objects
    // This is a simplified version
    
    return true;
  });

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
              </button>
              
              <button 
                onClick={toggleMapView}
                className={`px-4 py-2 border rounded-md flex items-center text-sm font-medium ${
                  showMap 
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
          {/* Filters sidebar - mobile version is a slide-in */}
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
                <div className="mb-4">
                  <p className="text-gray-600">
                    {filteredResults.length} cars available
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                
                {filteredResults.length === 0 && (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;