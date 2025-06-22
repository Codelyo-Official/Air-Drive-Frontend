import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  Fuel, 
  Settings,
  MapPin,
  Shield,
  Heart,
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Clock,
  Loader2,
  ArrowLeft,
  Car,
  CreditCard
} from 'lucide-react';
import { useCar } from '../api/carManagement';

const CarDetailPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();
  
  // Find the specific car by ID (convert string to number)
  const car = useMemo(() => {
    return availableCars.find(car => car.id === parseInt(carId || '0', 10));
  }, [availableCars, carId]);
  
  // Create images array (using single image or placeholder)
  const carImages = useMemo(() => {
    const mainImage = car?.image_url || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    return [mainImage];
  }, [car?.image_url]);
  
  // Navigate through images (if multiple images exist)
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carImages.length - 1 : prevIndex - 1
    );
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading car details...</span>
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
              Error loading car details: {error.message}
            </p>
            <Link
              to="/search"
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Car not found
  if (!car) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Car size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the car you're looking for.</p>
            <Link 
              to="/search" 
              className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Browse all cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16 bg-gray-50">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/search"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to search
        </Link>
      </div>

      {/* Car photo */}
      <div className="relative h-96 md:h-[500px] bg-gray-200">
        <img
          src={carImages[currentImageIndex]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation buttons - only show if multiple images */}
        {carImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {carImages.length}
            </div>
          </>
        )}
        
        {/* Like button */}
        <button 
          onClick={toggleLike}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <Heart size={24} className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-700'} />
        </button>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{car.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">
                    ${parseFloat(car.daily_rate).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">per day</div>
                </div>
              </div>
              
              {/* Car specifications */}
              <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Seats</div>
                  <div className="font-medium flex items-center">
                    <Users size={16} className="mr-1" />
                    {car.seats}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Type</div>
                  <div className="font-medium flex items-center">
                    <Fuel size={16} className="mr-1" />
                    {car.fuel_type}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Transmission</div>
                  <div className="font-medium flex items-center">
                    <Settings size={16} className="mr-1" />
                    {car.transmission}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="font-medium">{car.year}</div>
                </div>
              </div>
              
              {/* Additional details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Color</div>
                  <div className="font-medium">{car.color}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">License Plate</div>
                  <div className="font-medium">{car.license_plate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className={`font-medium ${car.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                    {car.status}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              {car.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Description</h2>
                  <p className="text-gray-600">{car.description}</p>
                </div>
              )}
              
              {/* Auto approve booking info */}
              {car.auto_approve_bookings && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield size={20} className="text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Instant Booking</p>
                      <p className="text-xs text-green-600">This car has automatic booking approval enabled</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">${parseFloat(car.daily_rate).toFixed(0)}</div>
                <div className="text-gray-500">per day</div>
              </div>
              
              {/* Booking form */}
              <div className="mb-6">
                <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-2">
                    <div className="p-3 border-r border-b border-gray-300">
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <input 
                          type="date" 
                          className="w-full border-none p-0 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-3 border-b border-gray-300">
                      <label className="block text-xs text-gray-500 mb-1">Time</label>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <select className="w-full border-none p-0 focus:ring-0 text-sm bg-transparent">
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>12:00 PM</option>
                          <option>1:00 PM</option>
                          <option>2:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-3 border-r border-gray-300">
                      <label className="block text-xs text-gray-500 mb-1">Until</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <input 
                          type="date" 
                          className="w-full border-none p-0 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-3">
                      <label className="block text-xs text-gray-500 mb-1">Time</label>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <select className="w-full border-none p-0 focus:ring-0 text-sm bg-transparent">
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>12:00 PM</option>
                          <option>1:00 PM</option>
                          <option>2:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pricing breakdown */}
              <div className="mb-6 space-y-4">
                <div className="flex justify-between">
                  <span>${parseFloat(car.daily_rate).toFixed(0)} x 3 days</span>
                  <span>${(parseFloat(car.daily_rate) * 3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${Math.round(parseFloat(car.daily_rate) * 3 * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${Math.round(parseFloat(car.daily_rate) * 3 * 1.1)}</span>
                </div>
              </div>
              
              {/* Book button */}
              <button 
                className={`w-full py-3 rounded-md font-medium mb-4 transition-colors flex items-center justify-center ${
                  car.status === 'available' 
                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={car.status !== 'available'}
              >
                <CreditCard size={20} className="mr-2" />
                {car.status === 'available' ? 'Book now' : 'Not Available'}
              </button>
              
              <div className="text-center text-sm text-gray-500 mb-6">
                You won't be charged yet
              </div>
              
              {/* Insurance info */}
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <Shield size={20} className="text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Insurance included</p>
                  <p className="text-xs text-gray-600">
                    Every trip includes liability insurance and a damage protection plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;