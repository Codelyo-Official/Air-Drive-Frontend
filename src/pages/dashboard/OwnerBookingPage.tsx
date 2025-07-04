"use client"

import {
  AlertCircle,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Search,
  User,
  X,
  DollarSign,
  MapPin,
  Users,
  Fuel,
  Settings,
  ImageIcon,
  CreditCard,
  Hash,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react"
import React, { useMemo, useState } from "react"
import { useBookingAndReport } from "../../api/bookingAndReport"

const statusOptions = [
  { label: "All Bookings", value: "", color: "bg-gray-100 text-gray-800", bgColor: "bg-gray-50" },
  { label: "Pending", value: "pending", color: "bg-yellow-100 text-yellow-800", bgColor: "bg-yellow-50" },
  { label: "Approved", value: "approved", color: "bg-green-100 text-green-800", bgColor: "bg-green-50" },
  { label: "Rejected", value: "rejected", color: "bg-red-100 text-red-800", bgColor: "bg-red-50" },
]

const OwnerBookingPage: React.FC = () => {
  const [status, setStatus] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [sortBy, setSortBy] = useState<"date" | "status" | "user" | "car" | "cost">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { useOwnerBookings, bookingApproval } = useBookingAndReport()
  const { data: bookings, isLoading, isError, error, refetch } = useOwnerBookings(status)

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!bookings) return { total: 0, totalRevenue: 0, totalPayout: 0, pending: 0, approved: 0, rejected: 0 }

    return {
      total: bookings.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + Number.parseFloat(booking.total_cost), 0),
      totalPayout: bookings.reduce((sum, booking) => sum + Number.parseFloat(booking.owner_payout), 0),
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    }
  }, [bookings])

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return []

    const filtered = bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        booking.id.toString().includes(searchLower) ||
        booking.car.make.toLowerCase().includes(searchLower) ||
        booking.car.model?.toLowerCase().includes(searchLower) ||
        booking.car.license_plate.toLowerCase().includes(searchLower) ||
        booking.user.toString().includes(searchLower) ||
        booking.car.location.toLowerCase().includes(searchLower) ||
        new Date(booking.start_date).toLocaleDateString().includes(searchLower)
      )
    })

    // Sort bookings
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "user":
          comparison = a.user.toString().localeCompare(b.user.toString())
          break
        case "car":
          comparison = a.car.make.localeCompare(b.car.make)
          break
        case "cost":
          comparison = Number.parseFloat(a.total_cost) - Number.parseFloat(b.total_cost)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [bookings, searchTerm, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredAndSortedBookings.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, status])

  const handleApproval = (booking_id: number, action: "approve" | "reject") => {
    bookingApproval.mutate({ booking_id, action })
  }

  const handleSort = (field: "date" | "status" | "user" | "car" | "cost") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getStatusBadge = (bookingStatus: string) => {
    const statusConfig = statusOptions.find((opt) => opt.value === bookingStatus) || statusOptions[0]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
        {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
      </span>
    )
  }

  const getStatusIcon = (bookingStatus: string) => {
    switch (bookingStatus) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <Check className="h-5 w-5 text-green-500" />
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  // Calculate booking duration
  const getBookingDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <span className="text-xl text-gray-700 font-medium">Loading bookings...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-red-800 font-semibold text-lg mb-2">Error loading bookings</div>
            <p className="text-red-600 mb-6">{(error as Error).message}</p>
            <button
              onClick={() => refetch()}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Management</h1>
              <p className="text-gray-600 text-lg">Manage bookings for your cars and approve rental requests</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-amber-600">{summaryStats.total}</div>
                <div className="text-xs text-gray-500">Total Bookings</div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">${summaryStats.totalPayout.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-900">{summaryStats.total}</p>
                <p className="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-sm border border-yellow-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{summaryStats.pending}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-900">{summaryStats.approved}</p>
                <p className="text-xs text-green-600 mt-1">Active rentals</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-purple-900">${summaryStats.totalPayout.toFixed(0)}</p>
                <p className="text-xs text-purple-600 mt-1">Owner payout</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search bookings, cars, users, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder]
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="cost-desc">Highest Cost</option>
                <option value="cost-asc">Lowest Cost</option>
                <option value="car-asc">Car A-Z</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {paginatedBookings.length} of {filteredAndSortedBookings.length} bookings
              {searchTerm && ` for "${searchTerm}"`}
            </span>
            {status && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                {statusOptions.find((s) => s.value === status)?.label} only
              </span>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden xl:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("car")}
                  >
                    Vehicle Information {sortBy === "car" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("user")}
                  >
                    Renter {sortBy === "user" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    Rental Period {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("cost")}
                  >
                    Financial Details {sortBy === "cost" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedBookings.map((booking) => {
                  const duration = getBookingDuration(booking.start_date, booking.end_date)
                  const primaryImage = booking.car.images.find((img) => img.is_primary) || booking.car.images[0]
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Hash size={16} className="text-gray-400 mr-2" />
                            <span className="font-bold text-gray-900">#{booking.id}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated: {new Date(booking.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-start space-x-4">
                          {/* <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {primaryImage ? (
                              <img
                                src={primaryImage.image || "/placeholder.svg"}
                                alt={`${booking.car.make} ${booking.car.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div> */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 mb-1">
                              {booking.car.make} {booking.car.model}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{booking.car.year}</div>
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded mb-1">
                              {booking.car.license_plate}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin size={12} className="mr-1" />
                              {booking.car.location}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {booking.car.seats} seats
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {booking.car.fuel_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">User #{booking.user}</div>
                            <div className="text-xs text-gray-500">Renter ID</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {new Date(booking.start_date).toLocaleDateString()}
                              </div>
                              <div className="text-gray-500">to {new Date(booking.end_date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                            {duration} day{duration > 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            <span className="font-bold text-gray-900">
                              ${Number.parseFloat(booking.total_cost).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Fee: ${Number.parseFloat(booking.platform_fee).toFixed(2)}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            Payout: ${Number.parseFloat(booking.owner_payout).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rate: ${Number.parseFloat(booking.car.daily_rate)}/day
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">{getStatusBadge(booking.status)}</td>
                      <td className="px-6 py-6">
                        {booking.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(booking.id, "approve")}
                              disabled={bookingApproval.isPending}
                              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproval(booking.id, "reject")}
                              disabled={bookingApproval.isPending}
                              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          // <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          //   <Eye className="h-4 w-4 mr-1" />
                          //   View
                          // </button>
                          <button></button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards View */}
        <div className="xl:hidden space-y-6 mb-8">
          {paginatedBookings.map((booking) => {
            const duration = getBookingDuration(booking.start_date, booking.end_date)
            const primaryImage = booking.car.images.find((img) => img.is_primary) || booking.car.images[0]
            const statusConfig = statusOptions.find((opt) => opt.value === booking.status) || statusOptions[0]
            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className={`${statusConfig.bgColor} px-6 py-4 border-b border-gray-100`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Hash className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">#{booking.id}</div>
                        <div className="text-sm text-gray-600">
                          Created {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                  {/* Vehicle Information */}
                  <div className="flex items-start space-x-4">
                    {/* <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {primaryImage ? (
                        <img
                          src={primaryImage.image || "/placeholder.svg"}
                          alt={`${booking.car.make} ${booking.car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div> */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {booking.car.make} {booking.car.model}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {booking.car.year}
                        </div>
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {booking.car.seats} seats
                        </div>
                        <div className="flex items-center">
                          <Fuel size={14} className="mr-1" />
                          {booking.car.fuel_type}
                        </div>
                        <div className="flex items-center">
                          <Settings size={14} className="mr-1" />
                          {booking.car.transmission}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs inline-block">
                          {booking.car.license_plate}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          {booking.car.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Renter Information */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                      <User className="h-5 w-5 text-amber-600 mr-2" />
                      Renter Information
                    </h4>
                    <div className="text-sm text-gray-700">
                      <div>User ID: #{booking.user}</div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        Rental Period
                      </h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {duration} day{duration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Check-in</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(booking.start_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Check-out</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(booking.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                      <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                      Financial Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-medium text-gray-900">
                          ${Number.parseFloat(booking.car.daily_rate).toFixed(2)}/day
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Cost</span>
                        <span className="font-bold text-lg text-gray-900">
                          ${Number.parseFloat(booking.total_cost).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium text-gray-900">
                          ${Number.parseFloat(booking.platform_fee).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-green-200 pt-2">
                        <span className="text-green-700 font-medium">Your Payout</span>
                        <span className="font-bold text-green-700">
                          ${Number.parseFloat(booking.owner_payout).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Car Features */}
                  {booking.car.features && booking.car.features.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                        <Star className="h-5 w-5 text-purple-600 mr-2" />
                        Car Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.car.features.slice(0, 4).map((feature, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium"
                          >
                            {feature.name}
                          </span>
                        ))}
                        {booking.car.features.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            +{booking.car.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Images Count */}
                  {booking.car.images.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ImageIcon size={16} className="mr-2" />
                      {booking.car.images.length} image{booking.car.images.length > 1 ? "s" : ""} available
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.status === "pending" && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleApproval(booking.id, "approve")}
                        disabled={bookingApproval.isPending}
                        className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve Booking
                      </button>
                      <button
                        onClick={() => handleApproval(booking.id, "reject")}
                        disabled={bookingApproval.isPending}
                        className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                        currentPage === pageNum
                          ? "bg-amber-500 text-white shadow-lg"
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
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!bookings || bookings.length === 0) && !isLoading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You don't have any bookings for your cars yet.</p>
          </div>
        )}

        {/* No Search Results */}
        {filteredAndSortedBookings.length === 0 && bookings && bookings.length > 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              No bookings match your search criteria
              {searchTerm && ` for "${searchTerm}"`}
              {status && ` with status "${statusOptions.find((s) => s.value === status)?.label}"`}
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setStatus("")
              }}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerBookingPage
