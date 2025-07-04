"use client"

import {
  Loader2,
  Search,
  X,
  Menu,
  MapPin,
  Users,
  Fuel,
  Settings,
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useCar } from "../api/carManagement"
import CarCard from "../components/CarCard"

interface FilterState {
  searchTerm: string
  make: string
  location: string
  seats: string
  transmission: string
  fuelType: string
  priceRange: [number, number]
  year: [number, number]
  features: string[]
  startDate: string
  endDate: string
}

const SearchPage: React.FC = () => {
  const { useAvailableCars } = useCar()
  const { data: availableCars = [], isLoading, error } = useAvailableCars()
  const [searchParams] = useSearchParams()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    make: "",
    location: "",
    seats: "",
    transmission: "",
    fuelType: "",
    priceRange: [0, 1000],
    year: [1990, 2025],
    features: [],
    startDate: "",
    endDate: "",
  })

  // Extract unique values for filter options with dynamic price range
  const filterOptions = useMemo(() => {
    if (!availableCars.length) return {}

    const prices = availableCars.map((car) => Number.parseFloat(car.daily_rate))
    const minPrice = Math.floor(Math.min(...prices))
    const maxPrice = Math.ceil(Math.max(...prices))

    return {
      makes: [...new Set(availableCars.map((car) => car.make))].sort(),
      locations: [...new Set(availableCars.map((car) => car.location))].sort(),
      seats: [...new Set(availableCars.map((car) => car.seats))].sort((a, b) => a - b),
      transmissions: [...new Set(availableCars.map((car) => car.transmission))].sort(),
      fuelTypes: [...new Set(availableCars.map((car) => car.fuel_type))].sort(),
      features: [...new Set(availableCars.flatMap((car) => car.features))].sort(),
      maxPrice,
      minPrice,
      maxYear: Math.max(...availableCars.map((car) => car.year)),
      minYear: Math.min(...availableCars.map((car) => car.year)),
    }
  }, [availableCars])

  // Initialize filters from URL parameters with dynamic price range
  useEffect(() => {
    if (!filterOptions.maxPrice) return

    const urlLocation = searchParams.get("location") || ""
    const urlStartDate = searchParams.get("start_date") || ""
    const urlEndDate = searchParams.get("end_date") || ""
    const urlSeats = searchParams.get("seats") || ""
    const urlTransmission = searchParams.get("transmission") || ""
    const urlFuelType = searchParams.get("fuel_type") || ""
    const urlMake = searchParams.get("make") || ""
    const urlMinPrice = searchParams.get("min_price")
    const urlMaxPrice = searchParams.get("max_price")

    setFilters((prev) => ({
      ...prev,
      location: urlLocation,
      startDate: urlStartDate,
      endDate: urlEndDate,
      seats: urlSeats,
      transmission: urlTransmission,
      fuelType: urlFuelType,
      make: urlMake,
      priceRange: [
        urlMinPrice ? Number.parseInt(urlMinPrice) : filterOptions.minPrice,
        urlMaxPrice ? Number.parseInt(urlMaxPrice) : filterOptions.maxPrice,
      ],
    }))
  }, [searchParams, filterOptions.minPrice, filterOptions.maxPrice])

  // Check if car is available for the selected date range
  const isCarAvailable = (car: any, startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true

    const requestStart = new Date(startDate)
    const requestEnd = new Date(endDate)

    return car.availability.some((period: any) => {
      const availableStart = new Date(period.start_date)
      const availableEnd = new Date(period.end_date)
      return requestStart >= availableStart && requestEnd <= availableEnd
    })
  }

  // Filter cars based on current filters
  const filteredCars = useMemo(() => {
    return availableCars.filter((car) => {
      const matchesSearch =
        filters.searchTerm === "" ||
        `${car.make} ${car.model}`.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        car.location.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesMake = filters.make === "" || car.make === filters.make
      const matchesLocation =
        filters.location === "" || car.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesSeats = filters.seats === "" || car.seats.toString() === filters.seats
      const matchesTransmission = filters.transmission === "" || car.transmission === filters.transmission
      const matchesFuelType = filters.fuelType === "" || car.fuel_type === filters.fuelType

      const carPrice = Number.parseFloat(car.daily_rate)
      const matchesPrice = carPrice >= filters.priceRange[0] && carPrice <= filters.priceRange[1]

      const matchesYear = car.year >= filters.year[0] && car.year <= filters.year[1]

      const matchesFeatures =
        filters.features.length === 0 || filters.features.every((feature) => car.features.includes(feature))

      const matchesAvailability = isCarAvailable(car, filters.startDate, filters.endDate)

      return (
        matchesSearch &&
        matchesMake &&
        matchesLocation &&
        matchesSeats &&
        matchesTransmission &&
        matchesFuelType &&
        matchesPrice &&
        matchesYear &&
        matchesFeatures &&
        matchesAvailability
      )
    })
  }, [availableCars, filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCars = filteredCars.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [filters])

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      make: "",
      location: "",
      seats: "",
      transmission: "",
      fuelType: "",
      priceRange: [filterOptions.minPrice || 0, filterOptions.maxPrice || 1000],
      year: [filterOptions.minYear || 1990, filterOptions.maxYear || 2025],
      features: [],
      startDate: "",
      endDate: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "string") return value !== ""
    return false
  }).length

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              <span className="text-gray-600">Loading available cars...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Error loading cars: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="flex z-40">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 xl:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`z-50 fixed xl:static inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out xl:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } pt-16 xl:pt-0 border-r border-gray-200`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                  <p className="text-sm text-gray-500 mt-1">Refine your search</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Applied Filters from Home Page */}
              {(filters.location ||
                filters.startDate ||
                filters.endDate ||
                filters.seats ||
                filters.transmission ||
                filters.fuelType ||
                filters.make) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Applied from Home Search</h3>
                  <div className="space-y-1 text-xs text-blue-700">
                    {filters.location && <div>📍 Location: {filters.location}</div>}
                    {filters.startDate && <div>📅 From: {new Date(filters.startDate).toLocaleDateString()}</div>}
                    {filters.endDate && <div>📅 Until: {new Date(filters.endDate).toLocaleDateString()}</div>}
                    {filters.make && <div>🚗 Make: {filters.make}</div>}
                    {filters.seats && <div>👥 Seats: {filters.seats}</div>}
                    {filters.transmission && <div>⚙️ Transmission: {filters.transmission}</div>}
                    {filters.fuelType && <div>⛽ Fuel: {filters.fuelType}</div>}
                  </div>
                </div>
              )}

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-amber-800">
                        {activeFiltersCount} Active Filter{activeFiltersCount > 1 ? "s" : ""}
                      </span>
                      <p className="text-xs text-amber-600 mt-1">{filteredCars.length} cars match your criteria</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-xs bg-white text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors font-medium border border-amber-200"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Sections */}
              <div className="space-y-6">
                {/* Date Range Filters */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    Rental Period
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                        min={filters.startDate || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Make Filter */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="h-4 w-4 text-amber-600" />
                    </div>
                    Car Make
                  </label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters((prev) => ({ ...prev, make: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Makes</option>
                    {filterOptions.makes?.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Seats & Transmission Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-2">
                        <Users className="h-3 w-3 text-green-600" />
                      </div>
                      Seats
                    </label>
                    <select
                      value={filters.seats}
                      onChange={(e) => setFilters((prev) => ({ ...prev, seats: e.target.value }))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="">Any</option>
                      {filterOptions.seats?.map((seats) => (
                        <option key={seats} value={seats}>
                          {seats}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                        <Settings className="h-3 w-3 text-purple-600" />
                      </div>
                      Trans.
                    </label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="">Any</option>
                      {filterOptions.transmissions?.map((transmission) => (
                        <option key={transmission} value={transmission}>
                          {transmission}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <Fuel className="h-4 w-4 text-red-600" />
                    </div>
                    Fuel Type
                  </label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Fuel Types</option>
                    {filterOptions.fuelTypes?.map((fuelType) => (
                      <option key={fuelType} value={fuelType}>
                        {fuelType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range - Updated with dynamic values */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold text-sm">$</span>
                    </div>
                    Price Range
                  </label>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                    <div className="text-xs text-green-600 mb-2">
                      Available range: ${filterOptions.minPrice} - ${filterOptions.maxPrice}
                    </div>
                    <input
                      type="range"
                      min={filterOptions.minPrice || 0}
                      max={filterOptions.maxPrice || 1000}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number.parseInt(e.target.value)],
                        }))
                      }
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((filters.priceRange[1] - (filterOptions.minPrice || 0)) / ((filterOptions.maxPrice || 1000) - (filterOptions.minPrice || 0))) * 100}%, #d1fae5 ${((filters.priceRange[1] - (filterOptions.minPrice || 0)) / ((filterOptions.maxPrice || 1000) - (filterOptions.minPrice || 0))) * 100}%, #d1fae5 100%)`,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      min={filterOptions.minPrice}
                      max={filterOptions.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [
                            Number.parseInt(e.target.value) || filterOptions.minPrice || 0,
                            prev.priceRange[1],
                          ],
                        }))
                      }
                      className="w-full p-2 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      min={filterOptions.minPrice}
                      max={filterOptions.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            Number.parseInt(e.target.value) || filterOptions.maxPrice || 1000,
                          ],
                        }))
                      }
                      className="w-full p-2 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Year Range */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    </div>
                    Year Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={filters.year[0]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          year: [Number.parseInt(e.target.value), prev.year[1]],
                        }))
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {Array.from({ length: 36 }, (_, i) => 1990 + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filters.year[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          year: [prev.year[0], Number.parseInt(e.target.value)],
                        }))
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {Array.from({ length: 36 }, (_, i) => 1990 + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features Filter */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="h-4 w-4 text-yellow-600" />
                    </div>
                    Features
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.features?.map((feature) => (
                      <label
                        key={feature}
                        className="flex items-center p-2 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({ ...prev, features: [...prev.features, feature] }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                features: prev.features.filter((f) => f !== feature),
                              }))
                            }
                          }}
                          className="mr-3 text-amber-500 focus:ring-amber-500 rounded"
                        />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Same as before */}
        <div className="flex-1 xl:ml-0">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header with Search */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
  <div className="flex flex-col gap-4">
    {/* Mobile: Menu, Search, and View Toggle in same row */}
    <div className="flex items-center gap-3">
      {/* Menu Button - Only visible on mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="xl:hidden flex-shrink-0 p-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Input - Takes remaining space */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by car make, model, or location..."
          value={filters.searchTerm}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
        />
      </div>

      {/* View Toggle Buttons - Hidden on mobile, visible on tablet and up */}
      <div className="hidden sm:flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "grid" ? "bg-white shadow-sm text-amber-600" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Grid className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "list" ? "bg-white shadow-sm text-amber-600" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <List className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</div>

            {/* Results Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold text-gray-900">{filteredCars.length}</span> cars available
                  {filteredCars.length !== availableCars.length && (
                    <span className="text-amber-600 ml-2">
                      ({availableCars.length - filteredCars.length} filtered out)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} results
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number.parseInt(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>

            {/* Car Grid/List */}
            <div
              className={`mb-8 ${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {currentCars.map((car) => (
                <CarCard key={car.id} car={car} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex gap-1">
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
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-amber-500 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredCars.length === 0 && availableCars.length > 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {filteredCars.length === 0 && availableCars.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars available</h3>
                  <p className="text-gray-500">Please check back later for available cars</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
