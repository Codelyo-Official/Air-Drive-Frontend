import { useState, useMemo, useEffect } from "react"
import {
  Calendar,
  Car,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Grid,
  List,
  Search,
  AlertTriangle,
} from "lucide-react"
import { useAdminBookings } from "../../api/admin/adminBooking"

interface AdminBooking {
  id: number
  user: number
  car: {
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
    features: Array<{ name: string }>
    availability: Array<{ start_date: string; end_date: string }>
    images: Array<{ id: number; image: string; is_primary: boolean }>
  }
  start_date: string
  end_date: string
  total_cost: string
  platform_fee: string
  owner_payout: string
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
  updated_at: string
}

const BookingManagement = () => {
  const { useAdminBookingsList, updateBooking } = useAdminBookings()

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status" | "car">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")

  const [confirmAction, setConfirmAction] = useState<{
    booking: AdminBooking
    action: "approved" | "rejected"
  } | null>(null)

  // Fetch bookings
  const { data: bookings, isLoading, error, refetch } = useAdminBookingsList({})

  // Sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return []

    // Filter by search term
    const filtered = bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        booking.id.toString().includes(searchLower) ||
        booking.user.toString().includes(searchLower) ||
        booking.car.make.toLowerCase().includes(searchLower) ||
        booking.car.model.toLowerCase().includes(searchLower) ||
        booking.car.license_plate.toLowerCase().includes(searchLower)
      )
    })

    // Sort bookings
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          break
        case "amount":
          comparison = Number.parseFloat(a.total_cost) - Number.parseFloat(b.total_cost)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "car":
          comparison = `${a.car.make} ${a.car.model}`.localeCompare(`${b.car.make} ${b.car.model}`)
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

  // Handle sorting
  const handleSort = (field: "date" | "amount" | "status" | "car") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Handle booking status update
  const handleStatusUpdate = (booking: AdminBooking, newStatus: "approved" | "rejected") => {
    setConfirmAction({ booking, action: newStatus })
  }

  const confirmStatusUpdate = () => {
    if (!confirmAction) return

    const updates = {
      status: confirmAction.action,
      start_date: confirmAction.booking.start_date,
      end_date: confirmAction.booking.end_date,
      total_cost: confirmAction.booking.total_cost,
      platform_fee: confirmAction.booking.platform_fee,
      owner_payout: confirmAction.booking.owner_payout,
      user: confirmAction.booking.user,
      car: confirmAction.booking.car.id,
    }

    updateBooking.mutate({
      booking_id: confirmAction.booking.id,
      updates: updates,
    })
    setConfirmAction(null)
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      case "completed":
        return <Check className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-lg text-gray-700">Loading bookings...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <div className="text-red-800 font-semibold mb-2">Error: {error.message}</div>
            <button
              onClick={() => refetch()}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">
            Manage car rental bookings, approve or reject requests, and track booking status
          </p>
        </div>

        {/* Stats Cards */}
        {bookings && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-amber-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {bookings.filter((booking) => booking.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {bookings.filter((booking) => booking.status === "approved").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    $
                    {bookings
                      .filter((b) => b.status === "completed")
                      .reduce((sum, booking) => sum + Number.parseFloat(booking.total_cost), 0)
                      .toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by booking ID, user ID, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {paginatedBookings.length} of {filteredAndSortedBookings.length} bookings
              </div>
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
        </div>

        {/* Bookings Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Booking Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.id}</h3>
                    <p className="text-sm text-gray-500">Created {formatDate(booking.created_at)}</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(booking.status)}
                    <span
                      className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Car Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.car.year} {booking.car.make} {booking.car.model}
                      </p>
                      <p className="text-xs text-gray-500">{booking.car.license_plate}</p>
                      <p className="text-xs text-gray-500">{booking.car.color}</p>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{booking.user}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">User ID: {booking.user}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">${booking.total_cost}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Platform Fee: ${booking.platform_fee} | Owner: ${booking.owner_payout}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking, "approved")}
                      disabled={updateBooking.isPending || booking.status === "approved"}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking, "rejected")}
                      disabled={updateBooking.isPending || booking.status === "rejected"}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
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
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("car")}
                    >
                      Car {sortBy === "car" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("date")}
                    >
                      Dates {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
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
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Booking #{booking.id}</div>
                          <div className="text-gray-500">${booking.total_cost}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-800">#{booking.user}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">User ID: {booking.user}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {booking.car.year} {booking.car.make} {booking.car.model}
                          </div>
                          <div className="text-gray-500">{booking.car.license_plate}</div>
                          <div className="text-gray-500">
                            ${booking.car.daily_rate}/day • {booking.car.color}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </div>
                          <div className="text-gray-500">Created: {formatDate(booking.created_at)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(booking, "approved")}
                            disabled={updateBooking.isPending || booking.status === "approved"}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking, "rejected")}
                            disabled={updateBooking.isPending || booking.status === "rejected"}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
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
        {(!bookings || filteredAndSortedBookings.length === 0) && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {bookings && bookings.length > 0 ? "No bookings found" : "No bookings available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {bookings && bookings.length > 0
                ? "Try adjusting your search criteria"
                : "Bookings will appear here once customers make reservations"}
            </p>
            {bookings && bookings.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-5 border border-gray-200 max-w-md shadow-lg rounded-lg bg-white">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                    confirmAction.action === "approved" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {confirmAction.action === "approved" ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <X className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {confirmAction.action === "approved" ? "Approve Booking" : "Reject Booking"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to {confirmAction.action === "approved" ? "approve" : "reject"} booking #
                  {confirmAction.booking.id}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    disabled={updateBooking.isPending}
                    className={`flex-1 px-4 py-2 text-white rounded-md transition-colors font-medium disabled:opacity-50 ${
                      confirmAction.action === "approved"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {updateBooking.isPending
                      ? "Processing..."
                      : confirmAction.action === "approved"
                        ? "Approve"
                        : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingManagement
