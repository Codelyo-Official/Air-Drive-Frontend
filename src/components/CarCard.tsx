import { Calendar, Fuel, MapPin, Users, Zap, Settings, Palette } from "lucide-react"
import type React from "react"
import { Link } from "react-router-dom"

interface Car {
  id: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  daily_rate: string
  location: string
  seats: number
  transmission: string
  fuel_type: string
  image: string
  availability: Array<{
    start_date: string
    end_date: string
  }>
  features: string[]
}

interface CarCardProps {
  car: Car
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTransmissionIcon = (transmission: string) => {
    return <Settings size={16} className="mr-1" />
  }

  const getFuelIcon = (fuelType: string) => {
    if (fuelType.toLowerCase() === "electric") {
      return <Zap size={16} className="mr-1 text-green-500" />
    }
    return <Fuel size={16} className="mr-1" />
  }

  return (
    <Link to={`/cars/${car.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-gray-100">
        {/* Car Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={car.image || "/placeholder.svg"}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Year Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800 shadow-sm">
            {car.year}
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium">
            Available
          </div>
        </div>

        {/* Car Details */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Palette size={14} className="mr-1" />
              <span className="capitalize">{car.color}</span>
              <span className="mx-2">•</span>
              <span>{car.license_plate}</span>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users size={16} className="mr-2 text-amber-500" />
              <span className="font-medium">{car.seats} seats</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {getFuelIcon(car.fuel_type)}
              <span className="font-medium">{car.fuel_type}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {getTransmissionIcon(car.transmission)}
              <span className="font-medium">{car.transmission}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-amber-500" />
              <span className="font-medium">{car.location}</span>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Zap size={16} className="mr-2 text-amber-500" />
                <span className="font-medium">Features</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {car.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-medium border border-amber-200"
                  >
                    {feature}
                  </span>
                ))}
                {car.features.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                    +{car.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Availability */}
          {car.availability && car.availability.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar size={16} className="mr-2 text-amber-500" />
                <span className="font-medium">Next Available</span>
              </div>
              <div className="text-sm text-gray-500">
                {car.availability.slice(0, 1).map((period, index) => (
                  <div key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded-md inline-block">
                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                  </div>
                ))}
                {car.availability.length > 1 && (
                  <span className="ml-2 text-xs text-amber-600 font-medium">
                    +{car.availability.length - 1} more periods
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">${car.daily_rate}</span>
              <span className="text-gray-500 text-sm ml-1">/ day</span>
            </div>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform group-hover:scale-105 shadow-sm hover:shadow-md">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarCard
