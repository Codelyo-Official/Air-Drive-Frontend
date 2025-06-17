import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, MapPin } from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  rating: number;
  seats: number;
  fuelType: string;
  pricePerDay: number;
  location: string;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Link to={`/cars/${car.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
            {car.year} {car.make}
          </div>
        </div>
        
        {/* Car Details */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{car.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Users size={16} className="mr-1" />
            <span className="mr-3">{car.seats} seats</span>
            <Fuel size={16} className="mr-1" />
            <span>{car.fuelType}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span>{car.location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">${car.pricePerDay}</span> / day
            </p>
            <span className="text-sm text-amber-600 font-medium group-hover:text-amber-500">
              View details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;