// CarDetailsPages.tsx 
import {
  ArrowLeft,
  Bluetooth,
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Fuel,
  Heart,
  Loader2,
  MapPin,
  Navigation,
  Settings,
  Shield,
  Users,
  Wifi
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBookingAndReport } from '../api/bookingAndReport';
import { useCar } from '../api/carManagement';

const CarDetailPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  // Get available cars from API
  const { useAvailableCars } = useCar();
  const { data: availableCars = [], isLoading, error } = useAvailableCars();

  // Get booking functions
  const { createBooking } = useBookingAndReport();

  console.log("availableCars-------------", availableCars)

  // Find the specific car by ID (convert string to number)
  const car = useMemo(() => {
    return availableCars.find(car => car.id === parseInt(carId || '0', 10));
  }, [availableCars, carId]);

  // Create images array (using single image or placeholder)
  const carImages = useMemo(() => {
    const mainImage = car?.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    return [mainImage];
  }, [car?.image]);

  // Calculate rental duration and pricing
  const rentalDays = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [selectedStartDate, selectedEndDate]);

  const totalCost = useMemo(() => {
    if (!car) return 0;
    const basePrice = parseFloat(car.daily_rate) * rentalDays;
    const serviceFee = basePrice * 0.1;
    return basePrice + serviceFee;
  }, [car, rentalDays]);

  // Check if dates are valid for booking
  const isBookingValid = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return startDate >= today && endDate > startDate;
  }, [selectedStartDate, selectedEndDate]);

  // Handle booking submission
  const handleBooking = async () => {
    if (!car || !isBookingValid) return;

    try {
      await createBooking.mutateAsync({
        car: car.id,
        start_date: selectedStartDate,
        end_date: selectedEndDate
      });
      // Reset form after successful booking
      setSelectedStartDate('');
      setSelectedEndDate('');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  // Feature icon mapping
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'gps':
      case 'navigation':
        return <Navigation size={16} className="text-blue-600" />;
      case 'bluetooth':
        return <Bluetooth size={16} className="text-blue-600" />;
      case 'wifi':
        return <Wifi size={16} className="text-blue-600" />;
      default:
        return <CheckCircle size={16} className="text-green-600" />;
    }
  };

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

  // Format availability dates
  const formatAvailabilityPeriods = (availability: Array<{ start_date: string, end_date: string }>) => {
    return availability.map((period, index) => {
      const startDate = new Date(period.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const endDate = new Date(period.end_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${startDate} - ${endDate}`;
    });
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

        {/* Status badge */}
        <div className="absolute bottom-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${car.status === 'available'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
            {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main car info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={18} className="mr-2" />
                    <span className="text-lg">{car.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      License: {car.license_plate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-600">
                    ${parseFloat(car.daily_rate).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">per day</div>
                </div>
              </div>

              {/* Car specifications grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-500">Seats</div>
                  <div className="font-semibold text-lg">{car.seats}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Fuel size={24} className="text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-500">Fuel Type</div>
                  <div className="font-semibold text-lg">{car.fuel_type}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Settings size={24} className="text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-500">Transmission</div>
                  <div className="font-semibold text-lg">{car.transmission}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Calendar size={24} className="text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="font-semibold text-lg">{car.year}</div>
                </div>
              </div>

              {/* Additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Color</h3>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2"
                      style={{ backgroundColor: car.color.toLowerCase() }}
                    ></div>
                    <span className="text-gray-600">{car.color}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">License Plate</h3>
                  <span className="text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                    {car.license_plate}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {getFeatureIcon(feature)}
                      <span className="ml-2 text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {car.availability && car.availability.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Availability Periods</h2>
                <div className="space-y-3">
                  {formatAvailabilityPeriods(car.availability).map((period, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Calendar size={20} className="text-green-600 mr-3" />
                      <span className="text-green-800 font-medium">{period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto approve booking info */}
            {car.auto_approve_bookings && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Shield size={24} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Instant Booking Available</p>
                    <p className="text-sm text-green-600">
                      This car has automatic booking approval enabled. Your reservation will be confirmed immediately upon booking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-3xl font-bold text-amber-600">
                  ${parseFloat(car.daily_rate).toFixed(0)}
                </div>
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
                          value={selectedStartDate}
                          onChange={(e) => setSelectedStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border-none p-0 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-3 border-b border-gray-300">
                      <label className="block text-xs text-gray-500 mb-1">Until</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <input
                          type="date"
                          value={selectedEndDate}
                          onChange={(e) => setSelectedEndDate(e.target.value)}
                          min={selectedStartDate || new Date().toISOString().split('T')[0]}
                          className="w-full border-none p-0 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span>${parseFloat(car.daily_rate).toFixed(0)} x {rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                  <span>${(parseFloat(car.daily_rate) * rentalDays).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${Math.round(parseFloat(car.daily_rate) * rentalDays * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-gray-200 text-lg">
                  <span>Total</span>
                  <span>${Math.round(totalCost)}</span>
                </div>
              </div>

              {/* Book button */}
              <button
                onClick={handleBooking}
                disabled={!isBookingValid || car.status !== 'available' || createBooking.isPending}
                className={`w-full py-3 rounded-md font-medium mb-4 transition-colors flex items-center justify-center ${isBookingValid && car.status === 'available' && !createBooking.isPending
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} className="mr-2" />
                    {car.status === 'available'
                      ? (isBookingValid ? 'Book now' : 'Select valid dates')
                      : 'Not Available'
                    }
                  </>
                )}
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