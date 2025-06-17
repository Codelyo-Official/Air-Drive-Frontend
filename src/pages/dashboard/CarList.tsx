import type React from "react"

import { useState } from "react"
import type { Car } from "../../types"

const CarList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const cars: Car[] = [
    {
      id: 1,
      name: "Tesla Model 3",
      brand: "Tesla",
      year: 2023,
      price: 89,
      status: "available",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop",
      features: ["Electric", "Autopilot", "Premium Interior"],
      mileage: "15,420 miles",
    },
    {
      id: 2,
      name: "BMW X5",
      brand: "BMW",
      year: 2022,
      price: 120,
      status: "rented",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
      features: ["AWD", "Luxury", "Navigation"],
      mileage: "28,750 miles",
    },
    {
      id: 3,
      name: "Audi A4",
      brand: "Audi",
      year: 2023,
      price: 95,
      status: "available",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop",
      features: ["Quattro", "Premium Plus", "Virtual Cockpit"],
      mileage: "12,100 miles",
    },
    {
      id: 4,
      name: "Mercedes C-Class",
      brand: "Mercedes",
      year: 2022,
      price: 110,
      status: "maintenance",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop",
      features: ["AMG Line", "MBUX", "Premium Audio"],
      mileage: "22,890 miles",
    },
    {
      id: 5,
      name: "Toyota Camry",
      brand: "Toyota",
      year: 2023,
      price: 65,
      status: "available",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
      features: ["Hybrid", "Safety Sense", "Apple CarPlay"],
      mileage: "8,450 miles",
    },
    {
      id: 6,
      name: "Ford Mustang",
      brand: "Ford",
      year: 2023,
      price: 85,
      status: "rented",
      image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=300&h=200&fit=crop",
      features: ["V8 Engine", "Performance Pack", "Manual"],
      mileage: "5,200 miles",
    },
  ]

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || car.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: Car["status"]): string => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "rented":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 lg:ml-0 ml-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-12 lg:pt-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Car Fleet</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your car rental inventory</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base self-start sm:self-auto">
          Add New Car
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-full lg:max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={car.image || "/placeholder.svg?height=200&width=300"}
                alt={car.name}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(car.status)}`}>
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{car.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {car.brand} • {car.year}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-base sm:text-lg font-bold text-amber-600">${car.price}</p>
                  <p className="text-xs sm:text-sm text-gray-500">per day</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Mileage: {car.mileage}</p>
                <div className="flex flex-wrap gap-1">
                  {car.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
                <button className="flex-1 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm">
                  View Details
                </button>
                <button className="flex-1 xs:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default CarList
