"use client"

import { ArrowLeft, Bluetooth, Calendar, Car, CheckCircle, ChevronLeft, ChevronRight, CreditCard, Fuel, Loader2, MapPin, Navigation, Settings, Shield, Users, Wifi, X, AlertTriangle, Clock, Star, Info } from 'lucide-react'
import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useBookingAndReport } from "../api/bookingAndReport"
import { useCar } from "../api/carManagement"
import { useAuth } from "../api/auth"

interface Booking {
  booking_id: number
  car: {
    id: number
    make: string
    model: string
    year: number
    license_plate: string
  }
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected" | "completed"
  total_cost: string
  platform_fee: string
  owner_payout: string
  created_at: string
}

const CarDetailPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedStartDate, setSelectedStartDate] = useState("")
  const [selectedEndDate, setSelectedEndDate] = useState("")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalType, setAuthModalType] = useState<"booking" | "report">("booking")
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [bookingError, setBookingError] = useState("")

  const { createBooking, createReport, useMyBookings } = useBookingAndReport()
  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings()
  const { useAvailableCars } = useCar()
  const { data: availableCars = [], isLoading } = useAvailableCars()
  const { isAuthenticated, getCurrentUser } = useAuth()

  // Check if user is authenticated and is regular user
  const user = getCurrentUser()
  const isRegularUser = isAuthenticated() && user?.user_type === "regular"

  // Find the specific car by ID
  const car = useMemo(() => {
    return availableCars.find((car) => car.id === parseInt(carId || "0", 10))
  }, [availableCars, carId])

  // Create images array
  const carImages = useMemo(() => {
    const mainImage =
      car?.image ||
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    return [mainImage]
  }, [car?.image])

  // Calculate rental duration and pricing
  const rentalDays = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return 1
    const start = new Date(selectedStartDate)
    const end = new Date(selectedEndDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }, [selectedStartDate, selectedEndDate])

  const totalCost = useMemo(() => {
    if (!car) return 0
    const basePrice = parseFloat(car.daily_rate) * rentalDays
    const serviceFee = basePrice * 0.1
    return basePrice + serviceFee
  }, [car, rentalDays])

  // Check if user has existing booking for this car
  const hasExistingBooking = useMemo(() => {
    if (!car || !bookings.length) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.some((booking: Booking) => {
      const isThisCar = booking.car.id === car.id
      const endDate = new Date(booking.end_date)
      const isNotPast = endDate >= today
      const isActiveStatus = ["pending", "approved"].includes(booking.status)
      
      return isThisCar && isNotPast && isActiveStatus
    })
  }, [car, bookings])

  // Check if selected dates conflict with existing bookings
  const hasDateConflict = useMemo(() => {
    if (!car || !selectedStartDate || !selectedEndDate || !bookings.length) return false
    
    const selectedStart = new Date(selectedStartDate)
    const selectedEnd = new Date(selectedEndDate)
    
    return bookings.some((booking: Booking) => {
      if (booking.car.id !== car.id || !["pending", "approved"].includes(booking.status)) return false
      
      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)
      
      // Check for date overlap
      return selectedStart <= bookingEnd && selectedEnd >= bookingStart
    })
  }, [car, selectedStartDate, selectedEndDate, bookings])

  // Check if dates are within available periods
  const isDateAvailable = useMemo(() => {
    if (!car || !selectedStartDate || !selectedEndDate) return false
    
    const selectedStart = new Date(selectedStartDate)
    const selectedEnd = new Date(selectedEndDate)
    
    return car.availability?.some((period) => {
      const availableStart = new Date(period.start_date)
      const availableEnd = new Date(period.end_date)
      return selectedStart >= availableStart && selectedEnd <= availableEnd
    }) || false
  }, [car, selectedStartDate, selectedEndDate])

  // Check if booking is valid
  const isBookingValid = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return false
    const startDate = new Date(selectedStartDate)
    const endDate = new Date(selectedEndDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return (
      startDate >= today &&
      endDate > startDate &&
      isDateAvailable &&
      !hasDateConflict &&
      !hasExistingBooking
    )
  }, [selectedStartDate, selectedEndDate, isDateAvailable, hasDateConflict, hasExistingBooking])

  // Get booking error message
  const getBookingErrorMessage = () => {
    if (!selectedStartDate || !selectedEndDate) return "Please select both start and end dates"
    if (hasExistingBooking) return "You already have an active booking for this car"
    if (hasDateConflict) return "Selected dates conflict with existing bookings"
    if (!isDateAvailable) return "Selected dates are not within available periods"
    if (car?.status !== "available") return "This car is currently not available"
    return ""
  }

  // Handle authentication check
  const handleAuthCheck = (action: "booking" | "report") => {
    if (!isAuthenticated()) {
      setAuthModalType(action)
      setIsAuthModalOpen(true)
      return false
    }
    
    if (user?.user_type !== "regular") {
      setAuthModalType(action)
      setIsAuthModalOpen(true)
      return false
    }
    
    return true
  }

  // Handle booking attempt
  const handleBookingAttempt = () => {
    if (!handleAuthCheck("booking")) return
    
    const errorMessage = getBookingErrorMessage()
    if (errorMessage) {
      setBookingError(errorMessage)
      return
    }
    
    setBookingError("")
    setIsBookingModalOpen(true)
  }

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!car || !isBookingValid) return

    try {
      await createBooking.mutateAsync({
        car: car.id,
        start_date: selectedStartDate,
        end_date: selectedEndDate,
      })
      setIsBookingModalOpen(false)
      setSelectedStartDate("")
      setSelectedEndDate("")
    } catch (error) {
      console.error("Booking failed:", error)
    }
  }

  // Handle report attempt
  const handleReportAttempt = () => {
    if (!handleAuthCheck("report")) return
    setIsReportModalOpen(true)
  }

  // Handle report submit
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!car || !reportReason) return

    try {
      await createReport.mutateAsync({
        report_type: "car",
        reason: reportReason,
        reported_car_id: car.id,
        ...(reportDescription ? { description: reportDescription } : {}),
      })
      setIsReportModalOpen(false)
      setReportReason("")
      setReportDescription("")
    } catch (error) {
      console.error("Report failed:", error)
    }
  }

  // Feature icon mapping
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "gps":
      case "navigation":
        return <Navigation size={16} className="text-blue-600" />
      case "bluetooth":
        return <Bluetooth size={16} className="text-blue-600" />
      case "wifi":
        return <Wifi size={16} className="text-blue-600" />
      default:
        return <CheckCircle size={16} className="text-green-600" />
    }
  }

  // Navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === carImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? carImages.length - 1 : prevIndex - 1))
  }

  // Format availability periods
  const formatAvailabilityPeriods = (availability: Array<{ start_date: string; end_date: string }>) => {
    return availability.map((period) => {
      const startDate = new Date(period.start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      const endDate = new Date(period.end_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      return `${startDate} - ${endDate}`
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              <span className="text-gray-600">Loading car details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Car not found
  if (!car) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Car size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Car Not Found</h2>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the car you're looking for.</p>
            <Link
              to="/search"
              className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors inline-flex items-center font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              Browse all cars
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 pb-16 bg-gray-50 min-h-screen">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/search"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to search
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Cars</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {car.make} {car.model}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-64 md:h-96 lg:h-[500px] bg-gray-200">
        <img
          src={carImages[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {carImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {carImages.length}
            </div>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
              car.status === "available"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
          </span>
        </div>

        {/* Car Rating (if available) */}
        {/* <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-1"> */}
          {/* <Star size={16} className="text-yellow-500 fill-yellow-500" /> */}
          {/* <span className="text-sm font-semibold">4.8</span>
          <span className="text-xs text-gray-600">(24 reviews)</span> */}
        {/* </div> */}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Car Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2 text-amber-500" />
                      <span className="font-medium">{car.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full font-mono">
                        {car.license_plate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl lg:text-4xl font-bold text-amber-600">
                    ${parseFloat(car.daily_rate).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">per day</div>
                </div>
              </div>

              {/* Report Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleReportAttempt}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                >
                  Report this car
                </button>
              </div>

              {/* Car Specifications */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-amber-600" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Seats</div>
                  <div className="font-bold text-lg text-gray-900">{car.seats}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Fuel size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Fuel Type</div>
                  <div className="font-bold text-lg text-gray-900">{car.fuel_type}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Settings size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Transmission</div>
                  <div className="font-bold text-lg text-gray-900">{car.transmission}</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Year</div>
                  <div className="font-bold text-lg text-gray-900">{car.year}</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 shadow-sm"
                      style={{ backgroundColor: car.color.toLowerCase() }}
                    ></div>
                    <span className="text-gray-700 font-medium capitalize">{car.color}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">License Plate</h3>
                  <span className="text-gray-700 font-mono bg-gray-100 px-3 py-2 rounded-lg border">
                    {car.license_plate}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="mr-3">{getFeatureIcon(feature)}</div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {car.availability && car.availability.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Availability Periods</h2>
                <div className="space-y-3">
                  {formatAvailabilityPeriods(car.availability).map((period, index) => (
                    <div key={index} className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                      <Calendar size={20} className="text-green-600 mr-3" />
                      <span className="text-green-800 font-medium">{period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto Approve Info */}
            {car.auto_approve_bookings && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 mb-2">Instant Booking Available</h3>
                    <p className="text-sm text-green-700">
                      This car has automatic booking approval enabled. Your reservation will be confirmed immediately upon booking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Booking Warning */}
            {hasExistingBooking && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">Active Booking</h3>
                    <p className="text-sm text-yellow-700">
                      You already have an active booking for this car. You cannot book the same car multiple times.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Widget */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-3xl font-bold text-amber-600">
                  ${parseFloat(car.daily_rate).toFixed(0)}
                </div>
                <div className="text-gray-500 font-medium">per day</div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-300">
                      <label className="block text-xs text-gray-500 mb-2 font-medium">Check-in</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <input
                          type="date"
                          value={selectedStartDate}
                          onChange={(e) => setSelectedStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border-none p-0 focus:ring-0 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <label className="block text-xs text-gray-500 mb-2 font-medium">Check-out</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <input
                          type="date"
                          value={selectedEndDate}
                          onChange={(e) => setSelectedEndDate(e.target.value)}
                          min={selectedStartDate || new Date().toISOString().split("T")[0]}
                          className="w-full border-none p-0 focus:ring-0 text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>
                    ${parseFloat(car.daily_rate).toFixed(0)} × {rentalDays} day{rentalDays > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">${(parseFloat(car.daily_rate) * rentalDays).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service fee</span>
                  <span className="font-medium">${Math.round(parseFloat(car.daily_rate) * rentalDays * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-gray-200 text-lg text-gray-900">
                  <span>Total</span>
                  <span>${Math.round(totalCost)}</span>
                </div>
              </div>

              {/* Error Message */}
              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={16} className="text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm text-red-700 font-medium">{bookingError}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookingAttempt}
                disabled={createBooking.isPending}
                className={`w-full py-4 rounded-xl font-semibold mb-4 transition-all flex items-center justify-center ${
                  createBooking.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl"
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
                    Reserve now
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</div>

              {/* Insurance Info */}
              <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Shield size={20} className="text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Insurance included</p>
                  <p className="text-xs text-blue-700">
                    Every trip includes liability insurance and a damage protection plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsBookingModalOpen(false)}
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h2>
              <p className="text-gray-600">
                {car.make} {car.model} for {rentalDays} day{rentalDays > 1 ? "s" : ""}
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Dates:</span>
                <span className="font-medium">
                  {new Date(selectedStartDate).toLocaleDateString()} - {new Date(selectedEndDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-bold text-lg">${Math.round(totalCost)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingConfirm}
                disabled={createBooking.isPending}
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {createBooking.isPending ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsAuthModalOpen(false)}
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                {!isAuthenticated()
                  ? `Please log in to ${authModalType} this car.`
                  : `Only regular users can ${authModalType} cars. Please contact support if you need assistance.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {!isAuthenticated() && (
                  <Link
                    to="/login"
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors text-center"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsReportModalOpen(false)}
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report this car</h2>
              <p className="text-gray-600">Help us maintain quality by reporting issues</p>
            </div>
            
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  placeholder="e.g., inappropriate content, damaged vehicle"
                  disabled={createReport.isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide additional details..."
                  disabled={createReport.isPending}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={createReport.isPending || !reportReason}
                >
                  {createReport.isPending ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarDetailPage
