import type React from "react"

import { useState } from "react"
import { useCar } from "../../api/carManagement"
import { useNavigate } from 'react-router-dom';

type CarWithExtras = {
  id: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  description: string
  daily_rate: string
  location: string
  latitude: number
  longitude: number
  seats: number
  transmission: string
  fuel_type: string
  status: string
  auto_approve_bookings: boolean
  images?: { image: string; is_primary: boolean }[]
  features?: { name: string }[]
}

const CarList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const { useOwnerCars } = useCar()
  const { data: ownerCars, isLoading: isLoadingOwner, error: errorOwner } = useOwnerCars()

  // Use only owner cars
  const cars: CarWithExtras[] | undefined = ownerCars

  // Filtering logic
  const filteredCars = (cars || []).filter((car: CarWithExtras) => {
    const matchesSearch =
      (car.make + " " + car.model).toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || car.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700"
      case "rented":
        return "bg-blue-100 text-blue-700"
      case "maintenance":
        return "bg-red-100 text-red-700"
      case "pending_approval":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  // Loading State
  if (isLoadingOwner) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your fleet...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (errorOwner) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-red-600">Error loading cars. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 lg:ml-0 ml-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-12 lg:pt-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              My Car Fleet
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">Manage your premium rental collection</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/create-car")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base self-start lg:self-auto flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Car
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border-0">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                placeholder="Search by make, model, or license plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2 sm:py-3 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base bg-white transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="pending_approval">Pending</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {cars && (
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-amber-600">{filteredCars.length}</span> of{" "}
              <span className="font-semibold text-amber-600">{cars.length}</span> cars
            </p>
          </div>
        )}

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="relative">
                <img
                  src={
                    Array.isArray(car.images) && car.images.length > 0 && car.images[0]?.image
                      ? import.meta.env.VITE_API_BASE_URL + car.images[0].image
                      : "/placeholder.svg?height=200&width=300"
                  }
                  alt={car.make + " " + car.model}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(car.status)}`}>
                    {formatStatus(car.status)}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-2xl font-bold">${car.daily_rate}</div>
                  <div className="text-sm opacity-90">per day</div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {car.year} • {car.license_plate}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {car.seats}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {car.transmission}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {car.fuel_type}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {car.location}
                </div>

                {car.features && car.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded"
                      >
                        {typeof feature === "object" && feature !== null && "name" in feature
                          ? feature.name
                          : String(feature)}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded">
                        +{car.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 pt-2">
                  <button className="flex-1 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                  <button className="flex-1 xs:flex-none px-3 sm:px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {cars && filteredCars.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new car to your fleet</p>
            <button onClick={() => navigate("/dashboard/create-car")} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Car
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarList