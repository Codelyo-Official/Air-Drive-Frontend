import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Fuel, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Shield,
  Heart
} from 'lucide-react';
import { mockSearchResults, mockReviews, featureIcons } from '../data/mockData';

const CarDetailPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Find the car data
  const car = mockSearchResults.find(car => car.id === carId);
  
  // If car not found
  if (!car) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
        <p className="mb-8">Sorry, we couldn't find the car you're looking for.</p>
        <Link 
          to="/search" 
          className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
        >
          Browse all cars
        </Link>
      </div>
    );
  }
  
  // Get car reviews
  const carReviews = mockReviews.filter(review => review.carId === carId);
  
  // For demo purposes, create multiple car images from the single one we have
  const carImages = [
    car.image,
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];
  
  // Navigate through images
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

  return (
    <div className="pt-16 pb-16 bg-gray-50">
      {/* Car photos gallery */}
      <div className="relative h-96 md:h-[500px] bg-gray-200">
        <img
          src={carImages[currentImageIndex]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image navigation */}
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
                <div className="flex items-center">
                  <Star size={20} className="text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{car.rating}</span>
                  <span className="text-gray-500 ml-1">({carReviews.length} reviews)</span>
                </div>
              </div>
              
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
                    {car.fuelType}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="font-medium">{car.year}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">License Plate</div>
                  <div className="font-medium">***{Math.floor(Math.random() * 1000)}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-600">
                  {car.description}
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.features?.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                        {/* We'd use actual icons for each feature in a real implementation */}
                        <Star size={16} className="text-amber-600" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-3">About the host</h2>
                <div className="flex items-center">
                  <img 
                    src={car.owner?.image} 
                    alt={car.owner?.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-medium">{car.owner?.name}</div>
                    <div className="flex items-center text-sm">
                      <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{car.owner?.rating}</span>
                      <span className="mx-2">•</span>
                      <span>Response time: {car.owner?.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <Star size={20} className="text-yellow-500 fill-yellow-500 mr-2" />
                {car.rating} · {carReviews.length} reviews
              </h2>
              
              <div className="space-y-6">
                {carReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center mb-3">
                      <img 
                        src={review.user.image} 
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="ml-auto flex items-center">
                        <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">${car.pricePerDay}</div>
                <div className="text-gray-500">per day</div>
              </div>
              
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
              
              <div className="mb-6 space-y-4">
                <div className="flex justify-between">
                  <span>$89 x 3 days</span>
                  <span>$267</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>$27</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance & protection</span>
                  <span>$45</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>$339</span>
                </div>
              </div>
              
              <button className="w-full bg-amber-500 text-white py-3 rounded-md font-medium hover:bg-amber-600 transition-colors mb-4">
                Book now
              </button>
              
              <div className="text-center text-sm text-gray-500">
                You won't be charged yet
              </div>
              
              <div className="mt-6 flex items-start p-4 bg-blue-50 rounded-lg">
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