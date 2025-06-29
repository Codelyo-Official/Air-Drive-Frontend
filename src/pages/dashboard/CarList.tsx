"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  Car,
  MapPin,
  Users,
  Fuel,
  Settings,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  List,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import { useCar } from "../../api/carManagement"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "rate" | "year" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  const { useOwnerCars } = useCar()
  const { data: ownerCars, isLoading: isLoadingOwner, error: errorOwner } = useOwnerCars()

  const cars: CarWithExtras[] | undefined = ownerCars

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    if (!cars) return []

    const filtered = cars.filter((car: CarWithExtras) => {
      const matchesSearch =
        (car.make + " " + car.model).toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.location?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterStatus === "all" || car.status === filterStatus

      return matchesSearch && matchesFilter
    })

    // Sort cars
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = (a.make + " " + a.model).localeCompare(b.make + " " + b.model)
          break
        case "rate":
          comparison = Number.parseFloat(a.daily_rate) - Number.parseFloat(b.daily_rate)
          break
        case "year":
          comparison = a.year - b.year
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [cars, searchTerm, filterStatus, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCars = filteredAndSortedCars.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "rented":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Car className="h-4 w-4 text-green-500" />
      case "rented":
        return <Users className="h-4 w-4 text-blue-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-red-500" />
      case "pending_approval":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Car className="h-4 w-4 text-gray-500" />
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  const handleSort = (field: "name" | "rate" | "year" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Loading State
  if (isLoadingOwner) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-lg text-gray-700">Loading your fleet...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (errorOwner) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <div className="text-red-800 font-semibold mb-2">Error loading cars. Please try again.</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Car Fleet</h1>
              <p className="text-gray-600">Manage your premium rental collection</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/create-car")}
              className="flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Car
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {cars && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-amber-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Cars</p>
                  <p className="text-2xl font-semibold text-gray-900">{cars.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">{getStatusIcon("available")}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {cars.filter((car) => car.status === "available").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">{getStatusIcon("rented")}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rented</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {cars.filter((car) => car.status === "rented").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Daily Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    $
                    {cars.length > 0
                      ? Math.round(cars.reduce((sum, car) => sum + Number.parseFloat(car.daily_rate), 0) / cars.length)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by make, model, license plate, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Status:</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="pending_approval">Pending</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder]
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rate-asc">Price Low-High</option>
                <option value="rate-desc">Price High-Low</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-amber-500 text-white" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-amber-500 text-white" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedCars.length} of {filteredAndSortedCars.length} cars
            {searchTerm && ` for "${searchTerm}"`}
            {filterStatus !== "all" && ` with status "${formatStatus(filterStatus)}"`}
          </div>
        </div>

        {/* Car Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={
                      Array.isArray(car.images) && car.images.length > 0 && car.images[0]?.image
                        ? import.meta.env.VITE_API_BASE_URL + car.images[0].image
                        : "/placeholder.svg?height=200&width=300"
                    }
                    alt={car.make + " " + car.model}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(car.status)}`}>
                      {formatStatus(car.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded">
                    <div className="text-lg font-bold">${car.daily_rate}</div>
                    <div className="text-xs">per day</div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {car.year} • {car.license_plate}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {car.seats}
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      {car.fuel_type}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{car.location}</span>
                  </div>

                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {car.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded"
                        >
                          {typeof feature === "object" && feature !== null && "name" in feature
                            ? feature.name
                            : String(feature)}
                        </span>
                      ))}
                      {car.features.length > 2 && (
                        <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded">
                          +{car.features.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("year")}
                    >
                      Year {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("rate")}
                    >
                      Daily Rate {sortBy === "rate" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("status")}
                    >
                      Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              Array.isArray(car.images) && car.images.length > 0 && car.images[0]?.image
                                ? import.meta.env.VITE_API_BASE_URL + car.images[0].image
                                : "/placeholder.svg?height=40&width=60"
                            }
                            alt={car.make + " " + car.model}
                            className="h-10 w-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500">{car.license_plate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="font-medium text-gray-900">${car.daily_rate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {car.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(car.status)}`}>
                          {formatStatus(car.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-amber-600 hover:text-amber-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? "bg-amber-500 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {cars && filteredAndSortedCars.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all" ? "No cars found" : "No cars in your fleet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Add your first car to start earning with rentals"}
            </p>
            <button
              onClick={() => {
                if (searchTerm || filterStatus !== "all") {
                  setSearchTerm("")
                  setFilterStatus("all")
                } else {
                  navigate("/dashboard/create-car")
                }
              }}
              className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
            >
              {searchTerm || filterStatus !== "all" ? "Clear Filters" : "Add Your First Car"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarList
