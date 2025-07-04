"use client"

import { Calendar, MapPin, Search, Settings, Car } from "lucide-react"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import { useCar } from "../api/carManagement"

const SearchForm: React.FC = () => {
  const navigate = useNavigate()
  const { useAvailableCars } = useCar()
  const { data: availableCars = [], isLoading } = useAvailableCars()

  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [seats, setSeats] = useState("")
  const [transmission, setTransmission] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [make, setMake] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Extract dynamic options from car data
  const dynamicOptions = useMemo(() => {
    if (!availableCars.length)
      return {
        makes: [],
        locations: [],
        seats: [],
        transmissions: [],
        fuelTypes: [],
        minPrice: 0,
        maxPrice: 1000,
        totalCars: 0,
      }

    const makes = [...new Set(availableCars.map((car) => car.make))].sort()
    const locations = [...new Set(availableCars.map((car) => car.location))].sort()
    const seats = [...new Set(availableCars.map((car) => car.seats))].sort((a, b) => a - b)
    const transmissions = [...new Set(availableCars.map((car) => car.transmission))].sort()
    const fuelTypes = [...new Set(availableCars.map((car) => car.fuel_type))].sort()
    const prices = availableCars.map((car) => Number.parseFloat(car.daily_rate))
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return {
      makes,
      locations,
      seats,
      transmissions,
      fuelTypes,
      minPrice: Math.floor(minPrice),
      maxPrice: Math.ceil(maxPrice),
      totalCars: availableCars.length,
    }
  }, [availableCars])

  // Update price range when data loads
  useEffect(() => {
    if (dynamicOptions.maxPrice > 0) {
      setPriceRange([dynamicOptions.minPrice, dynamicOptions.maxPrice])
    }
  }, [dynamicOptions.minPrice, dynamicOptions.maxPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format dates for URL
    const formattedStartDate = startDate ? startDate.toISOString().split("T")[0] : ""
    const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : ""

    // Create search query with all filters
    const searchParams = new URLSearchParams()

    if (location) searchParams.set("location", location)
    if (formattedStartDate) searchParams.set("start_date", formattedStartDate)
    if (formattedEndDate) searchParams.set("end_date", formattedEndDate)
    if (seats) searchParams.set("seats", seats)
    if (transmission) searchParams.set("transmission", transmission)
    if (fuelType) searchParams.set("fuel_type", fuelType)
    if (make) searchParams.set("make", make)
    if (priceRange[0] > dynamicOptions.minPrice || priceRange[1] < dynamicOptions.maxPrice) {
      searchParams.set("min_price", priceRange[0].toString())
      searchParams.set("max_price", priceRange[1].toString())
    }

    // Navigate to search page with params
    navigate(`/search?${searchParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-32 sm:h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-500"></div>
            <span className="text-gray-600 text-sm sm:text-lg">Loading search options...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3">
          <div className="bg-amber-500 p-2 rounded-lg shadow-sm">
            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">Find Your Perfect Car</h2>
          <span className="bg-amber-100 text-amber-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {dynamicOptions.totalCars} Available
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Primary Row - Location and Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Location */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <MapPin size={12} className="inline mr-1 text-amber-500" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm"
            >
              <option value="">Select location</option>
              {dynamicOptions.locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Calendar size={12} className="inline mr-1 text-amber-500" />
              Pick-up Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              dateFormat="MMM dd, yyyy"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Calendar size={12} className="inline mr-1 text-amber-500" />
              Return Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Select date"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              dateFormat="MMM dd, yyyy"
            />
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <Search size={16} className="mr-2" />
              Search Cars
            </button>
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="h-4 w-4 text-amber-500 mr-2" />
              Advanced Filters
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span>
                💰 ${dynamicOptions.minPrice} - ${dynamicOptions.maxPrice}
              </span>
              <span>📍 {dynamicOptions.locations.length} locations</span>
              <span>🚗 {dynamicOptions.makes.length} brands</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {/* Car Make */}
            <div className="sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Make</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-xs sm:text-sm"
              >
                <option value="">Any</option>
                {dynamicOptions.makes.map((makeOption) => (
                  <option key={makeOption} value={makeOption}>
                    {makeOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Seats */}
            <div className="sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Seats</label>
              <select
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-xs sm:text-sm"
              >
                <option value="">Any</option>
                {dynamicOptions.seats.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat} seats
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-xs sm:text-sm"
              >
                <option value="">Any</option>
                {dynamicOptions.transmissions.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div className="sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Fuel</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-xs sm:text-sm"
              >
                <option value="">Any</option>
                {dynamicOptions.fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range - Mobile Optimized */}
            <div className="sm:col-span-2 xl:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                {/* Range Slider */}
                <input
                  type="range"
                  min={dynamicOptions.minPrice}
                  max={dynamicOptions.maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                />
                {/* Min/Max Inputs */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    min={dynamicOptions.minPrice}
                    max={dynamicOptions.maxPrice}
                    onChange={(e) =>
                      setPriceRange([Number.parseInt(e.target.value) || dynamicOptions.minPrice, priceRange[1]])
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-500 text-xs">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    min={dynamicOptions.minPrice}
                    max={dynamicOptions.maxPrice}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number.parseInt(e.target.value) || dynamicOptions.maxPrice])
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
