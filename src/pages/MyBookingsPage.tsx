"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  Calendar,
  Car,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Hash,
  CreditCard,
} from "lucide-react"
import { useBookingAndReport } from "../api/bookingAndReport"
import { Link } from "react-router-dom"

const MyBookingsPage: React.FC = () => {
  const { useMyBookings } = useBookingAndReport()
  const { data: bookings, isLoading, error } = useMyBookings()

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [sortBy, setSortBy] = useState<"date" | "cost" | "car" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected" | "completed">("all")

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          icon: <CheckCircle size={14} className="mr-1" />,
        }
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: <Clock size={14} className="mr-1" />,
        }
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: <XCircle size={14} className="mr-1" />,
        }
      case "completed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: <CheckCircle size={14} className="mr-1" />,
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: <AlertCircle size={14} className="mr-1" />,
        }
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

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return []

    const filtered = bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        booking.booking_id.toString().includes(searchLower) ||
        booking.car.make.toLowerCase().includes(searchLower) ||
        booking.car.model?.toLowerCase().includes(searchLower) ||
        booking.car.license_plate.toLowerCase().includes(searchLower) ||
        new Date(booking.start_date).toLocaleDateString().includes(searchLower)

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort bookings
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          break
        case "cost":
          comparison = Number.parseFloat(a.total_cost) - Number.parseFloat(b.total_cost)
          break
        case "car":
          comparison = a.car.make.localeCompare(b.car.make)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [bookings, searchTerm, sortBy, sortOrder, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredAndSortedBookings.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!bookings) return { total: 0, totalSpent: 0, pending: 0, approved: 0 }

    return {
      total: bookings.length,
      totalSpent: bookings.reduce((sum, booking) => sum + Number.parseFloat(booking.total_cost), 0),
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
    }
  }, [bookings])

  const handleSort = (field: "date" | "cost" | "car" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <span className="text-xl text-gray-700 font-medium">Loading your bookings...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-600" />
            </div>
            <div className="text-red-800 font-semibold text-lg mb-2">Error loading bookings</div>
            <p className="text-red-600 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookings yet</h3>
              <p className="text-gray-600 mb-8">Start your journey by booking your first car rental.</p>
              <Link
                to="/search"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center"
              >
                <Car className="mr-2" size={20} />
                Find Cars to Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600 text-lg">Manage and track all your car rentals</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-amber-600">{summaryStats.total}</div>
                <div className="text-xs text-gray-500">Total Bookings</div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">${summaryStats.totalSpent.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>

          {/* Summary Cards - Mobile */}
          <div className="md:hidden grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Hash size={20} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{summaryStats.total}</div>
                  <div className="text-xs text-gray-500">Total Bookings</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">${summaryStats.totalSpent.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">Total Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{summaryStats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {bookings.filter((b) => b.status === "rejected").length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
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
                placeholder="Search bookings, cars, or dates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Options */}
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
                <option value="car-desc">Car Z-A</option>
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
            {statusFilter !== "all" && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                {statusFilter} only
              </span>
            )}
          </div>
        </div>

        {/* Bookings Grid - Desktop Table View */}
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
                    Vehicle {sortBy === "car" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    Rental Period {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleSort("cost")}
                  >
                    Financial Details {sortBy === "cost" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedBookings.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status)
                  const duration = getBookingDuration(booking.start_date, booking.end_date)
                  return (
                    <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Hash size={16} className="text-gray-400 mr-2" />
                            <span className="font-bold text-gray-900">#{booking.booking_id}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Booked: {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                            <Car className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {booking.car.make} {booking.car.model}
                            </div>
                            <div className="text-sm text-gray-600">{booking.car.year}</div>
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                              {booking.car.license_plate}
                            </div>
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
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.icon}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
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
                          <div className="text-xs text-gray-500">
                            Payout: ${Number.parseFloat(booking.owner_payout).toFixed(2)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Link
                          to={`/cars/${booking.car.id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          <Eye size={16} className="mr-1" />
                          View Car
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookings Cards - Mobile/Tablet View */}
        <div className="xl:hidden space-y-6 mb-8">
          {paginatedBookings.map((booking) => {
            const statusBadge = getStatusBadge(booking.status)
            const duration = getBookingDuration(booking.start_date, booking.end_date)
            return (
              <div
                key={booking.booking_id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">#{booking.booking_id}</div>
                        <div className="text-sm text-gray-600">
                          Booked {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                    >
                      {statusBadge.icon}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                  {/* Vehicle Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {booking.car.make} {booking.car.model}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {booking.car.year}
                        </span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {booking.car.license_plate}
                        </span>
                      </div>
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
                        <span className="text-gray-600">Total Cost</span>
                        <span className="font-bold text-xl text-green-600">
                          ${Number.parseFloat(booking.total_cost).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium text-gray-900">
                          ${Number.parseFloat(booking.platform_fee).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Owner Payout</span>
                        <span className="font-medium text-gray-900">
                          ${Number.parseFloat(booking.owner_payout).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/cars/${booking.car.id}`}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Eye size={18} className="mr-2" />
                    View Car Details
                  </Link>
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

        {/* No Results Message */}
        {filteredAndSortedBookings.length === 0 && (searchTerm || statusFilter !== "all") && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? `No bookings match your search for "${searchTerm}"` : `No ${statusFilter} bookings found`}
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
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

export default MyBookingsPage
