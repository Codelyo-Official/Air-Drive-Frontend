import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface FilterOptions {
  carTypes: string[];
  features: string[];
  makes: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priceRange: [number, number];
    carTypes: string[];
    features: string[];
    makes: string[];
  };
  updateFilters: (filters: FilterSidebarProps['filters']) => void;
  clearFilters: () => void;
  filterOptions: FilterOptions;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  updateFilters,
  clearFilters,
  filterOptions
}) => {
  // Local state for filters that only updates parent on apply
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    carTypes: true,
    features: true,
    makes: true
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Update price range
  const updatePriceRange = (index: number, value: number) => {
    const newRange = [...localFilters.priceRange] as [number, number];
    newRange[index] = value;
    setLocalFilters({
      ...localFilters,
      priceRange: newRange
    });
  };
  
  // Toggle filter item
  const toggleFilterItem = (type: 'carTypes' | 'features' | 'makes', item: string) => {
    const currentItems = localFilters[type];
    const newItems = currentItems.includes(item)
      ? currentItems.filter(i => i !== item)
      : [...currentItems, item];
    
    setLocalFilters({
      ...localFilters,
      [type]: newItems
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    updateFilters(localFilters);
    onClose();
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    const emptyFilters = {
      priceRange: [0, 200],
      carTypes: [],
      features: [],
      makes: []
    };
    setLocalFilters(emptyFilters);
    clearFilters();
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 200) {
      count++;
    }
    
    count += localFilters.carTypes.length;
    count += localFilters.features.length;
    count += localFilters.makes.length;
    
    return count;
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-full md:h-auto w-4/5 md:w-72 bg-white shadow-lg z-50 md:z-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-60px)] md:h-auto p-4 space-y-6">
          {/* Price Range */}
          <div>
            <button 
              className="w-full flex items-center justify-between font-medium mb-2"
              onClick={() => toggleSection('price')}
            >
              <span>Price Range</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.price && (
              <div className="mt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">${localFilters.priceRange[0]}</span>
                  <span className="text-sm text-gray-600">${localFilters.priceRange[1]}</span>
                </div>
                
                <div className="relative mb-6">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={localFilters.priceRange[0]}
                    onChange={(e) => updatePriceRange(0, parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={localFilters.priceRange[1]}
                    onChange={(e) => updatePriceRange(1, parseInt(e.target.value))}
                    className="w-full accent-amber-500 -mt-2"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                    <input
                      type="number"
                      min="0"
                      max={localFilters.priceRange[1]}
                      value={localFilters.priceRange[0]}
                      onChange={(e) => updatePriceRange(0, parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                    <input
                      type="number"
                      min={localFilters.priceRange[0]}
                      max="200"
                      value={localFilters.priceRange[1]}
                      onChange={(e) => updatePriceRange(1, parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Car Types */}
          <div>
            <button 
              className="w-full flex items-center justify-between font-medium mb-2"
              onClick={() => toggleSection('carTypes')}
            >
              <span>Car Types</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${expandedSections.carTypes ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.carTypes && (
              <div className="mt-3 space-y-2">
                {filterOptions.carTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center mr-3">
                      {localFilters.carTypes.includes(type) && (
                        <Check size={14} className="text-amber-500" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={localFilters.carTypes.includes(type)}
                      onChange={() => toggleFilterItem('carTypes', type)}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Features */}
          <div>
            <button 
              className="w-full flex items-center justify-between font-medium mb-2"
              onClick={() => toggleSection('features')}
            >
              <span>Features</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${expandedSections.features ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.features && (
              <div className="mt-3 space-y-2">
                {filterOptions.features.map((feature) => (
                  <label key={feature} className="flex items-center">
                    <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center mr-3">
                      {localFilters.features.includes(feature) && (
                        <Check size={14} className="text-amber-500" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={localFilters.features.includes(feature)}
                      onChange={() => toggleFilterItem('features', feature)}
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Makes */}
          <div>
            <button 
              className="w-full flex items-center justify-between font-medium mb-2"
              onClick={() => toggleSection('makes')}
            >
              <span>Makes</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${expandedSections.makes ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expandedSections.makes && (
              <div className="mt-3 space-y-2">
                {filterOptions.makes.map((make) => (
                  <label key={make} className="flex items-center">
                    <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center mr-3">
                      {localFilters.makes.includes(make) && (
                        <Check size={14} className="text-amber-500" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={localFilters.makes.includes(make)}
                      onChange={() => toggleFilterItem('makes', make)}
                    />
                    <span className="text-sm">{make}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Filter actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 font-medium hover:text-gray-800"
            >
              Clear all
            </button>
            <span className="text-sm">
              {countActiveFilters()} filter{countActiveFilters() !== 1 ? 's' : ''} applied
            </span>
          </div>
          
          <button
            onClick={applyFilters}
            className="w-full bg-amber-500 text-white py-2 rounded-md font-medium hover:bg-amber-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;