// CarCard.tsx 
import { Calendar, Fuel, MapPin, Star, Users, Zap } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  daily_rate: string;
  location: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  image: string;
  availability: Array<{
    start_date: string;
    end_date: string;
  }>;
  features: string[];
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  console.log("Car-------------------", car);

  const rating = 4.5; 

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
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          </div>

          <div className='flex justify-between items-center'>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Users size={16} className="mr-1" />
              <span className="mr-3">{car.seats} seats</span>
              <Fuel size={16} className="mr-1" />
              <span>{car.fuel_type}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin size={16} className="mr-1" />
              <span>{car.location}</span>
            </div>
          </div>



          <div className='flex justify-between items-center'>
            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Zap size={16} className="mr-1" />
                  <span className="font-medium">Features:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                      +{car.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Availability */}
            {car.availability && car.availability.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar size={16} className="mr-1" />
                  <span className="font-medium">Available:</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {car.availability.slice(0, 2).map((period, index) => (
                    <div key={index}>
                      {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                    </div>
                  ))}
                  {car.availability.length > 2 && (
                    <div className="text-amber-600">+{car.availability.length - 2} more periods</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">${car.daily_rate}</span> / day
          </p>

          <div className='flex justify-center items-center'>

            <button className="text-sm text-amber-600 font-medium group-hover:text-amber-500 border border-amber-600 group-hover:border-amber-500 rounded-md px-3 py-1 mt-3 transition-colors duration-200 hover:bg-amber-50">
              View details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;