import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Calendar,
  Car,
  User,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Eye,
  Edit,
  Save,
  RefreshCw,
  AlertTriangle,
  MapPin,
  FileText,
  Grid,
  List,
} from "lucide-react"
import { useAdminBookings } from "../../api/admin/adminBooking"
import { toast } from "react-toastify"

interface AdminBooking {
  id: number
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  car: {
    id: number
    make: string
    model: string
    year: number
    license_plate: string
    daily_rate: string
  }
  start_date: string
  end_date: string
  total_amount: string
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
  updated_at: string
  pickup_location?: string
  dropoff_location?: string
  notes?: string
}

const BookingManagement = () => {
  const { useAdminBookingsList, updateBooking } = useAdminBookings()

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    user_id: undefined as number | undefined,
    car_id: undefined as number | undefined,
    start_date: "",
    end_date: "",
    search: "",
  })

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status" | "user" | "car">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // UI states
  const [showDetailsModal, setShowDetailsModal] = useState<AdminBooking | null>(null)
  const [editingBooking, setEditingBooking] = useState<AdminBooking | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    pickup_location: "",
    dropoff_location: "",
    notes: "",
    total_amount: "",
  })

  // Fetch bookings with current filters
  const { data: bookings, isLoading, error, refetch } = useAdminBookingsList(filters)

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return []

    const filtered = bookings.filter((booking) => {
      const searchLower = filters.search.toLowerCase()
      return (
        booking.id.toString().includes(searchLower) ||
        booking.user.username.toLowerCase().includes(searchLower) ||
        booking.user.first_name.toLowerCase().includes(searchLower) ||
        booking.user.last_name.toLowerCase().includes(searchLower) ||
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
          comparison = Number.parseFloat(a.total_amount) - Number.parseFloat(b.total_amount)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "user":
          comparison = `${a.user.first_name} ${a.user.last_name}`.localeCompare(
            `${b.user.first_name} ${b.user.last_name}`,
          )
          break
        case "car":
          comparison = `${a.car.make} ${a.car.model}`.localeCompare(`${b.car.make} ${b.car.model}`)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [bookings, filters.search, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredAndSortedBookings.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filters.search])

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
    setCurrentPage(1)
  }

  // Handle search with debounce for date filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.start_date, filters.end_date, refetch])

  // Handle sorting
  const handleSort = (field: "date" | "amount" | "status" | "user" | "car") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Handle booking status update (quick action)
  const handleStatusUpdate = (booking: AdminBooking, newStatus: "pending" | "approved" | "rejected" | "completed") => {
    updateBooking.mutate({
      booking_id: booking.id,
      updates: { status: newStatus },
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      user_id: undefined,
      car_id: undefined,
      start_date: "",
      end_date: "",
      search: "",
    })
  }

  // Start editing booking
  const startEdit = (booking: AdminBooking) => {
    setEditingBooking(booking)
    setEditForm({
      status: booking.status,
      pickup_location: booking.pickup_location || "",
      dropoff_location: booking.dropoff_location || "",
      notes: booking.notes || "",
      total_amount: booking.total_amount,
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingBooking(null)
    setEditForm({
      status: "",
      pickup_location: "",
      dropoff_location: "",
      notes: "",
      total_amount: "",
    })
  }

  // Save booking changes - only send changed fields
  const saveBooking = () => {
    if (!editingBooking) return

    // Create updates object with only changed fields
    const updates: any = {}
    if (editForm.status !== editingBooking.status) updates.status = editForm.status
    if (editForm.pickup_location !== (editingBooking.pickup_location || ""))
      updates.pickup_location = editForm.pickup_location
    if (editForm.dropoff_location !== (editingBooking.dropoff_location || ""))
      updates.dropoff_location = editForm.dropoff_location
    if (editForm.notes !== (editingBooking.notes || "")) updates.notes = editForm.notes
    if (editForm.total_amount !== editingBooking.total_amount) updates.total_amount = editForm.total_amount

    // Only proceed if there are changes
    if (Object.keys(updates).length === 0) {
      toast.error("No changes detected")
      return
    }

    updateBooking.mutate(
      {
        booking_id: editingBooking.id,
        updates: updates,
      },
      {
        onSuccess: () => {
          cancelEdit()
        },
      },
    )
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

  // Calculate booking duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

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
                      .reduce((sum, booking) => sum + Number.parseFloat(booking.total_amount), 0)
                      .toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by booking ID, user, or car..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => refetch()}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

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

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="number"
                placeholder="Filter by user ID"
                value={filters.user_id || ""}
                onChange={(e) =>
                  handleFilterChange("user_id", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Car ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car ID</label>
              <input
                type="number"
                placeholder="Filter by car ID"
                value={filters.car_id || ""}
                onChange={(e) =>
                  handleFilterChange("car_id", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange("start_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
            <div className="text-sm text-gray-600">
              Showing {paginatedBookings.length} of {filteredAndSortedBookings.length} bookings
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

                {/* Customer Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.user.first_name} {booking.user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">@{booking.user.username}</p>
                    </div>
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
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateDuration(booking.start_date, booking.end_date)} days</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">${booking.total_amount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking, "approved")}
                        disabled={updateBooking.isPending}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking, "rejected")}
                        disabled={updateBooking.isPending}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDetailsModal(booking)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => startEdit(booking)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
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
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("user")}
                    >
                      User {sortBy === "user" && (sortOrder === "asc" ? "↑" : "↓")}
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
                          <div className="text-gray-500">${booking.total_amount}</div>
                          <div className="text-gray-500">
                            {calculateDuration(booking.start_date, booking.end_date)} days
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-amber-800">
                                {booking.user.first_name?.[0]}
                                {booking.user.last_name?.[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user.first_name} {booking.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">@{booking.user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {booking.car.year} {booking.car.make} {booking.car.model}
                          </div>
                          <div className="text-gray-500">{booking.car.license_plate}</div>
                          <div className="text-gray-500">${booking.car.daily_rate}/day</div>
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
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(booking, "approved")}
                                disabled={updateBooking.isPending}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking, "rejected")}
                                disabled={updateBooking.isPending}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setShowDetailsModal(booking)}
                            className="text-amber-600 hover:text-amber-900"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => startEdit(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit booking"
                          >
                            <Edit className="h-4 w-4" />
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
                ? "Try adjusting your search or filter criteria"
                : "Bookings will appear here once customers make reservations"}
            </p>
            {bookings && bookings.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details #{showDetailsModal.id}</h3>
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Booking Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Booking Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Status:</span>{" "}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(showDetailsModal.status)}`}
                      >
                        {showDetailsModal.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total Amount:</span>{" "}
                      <span className="text-gray-600">${showDetailsModal.total_amount}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Duration:</span>{" "}
                      <span className="text-gray-600">
                        {calculateDuration(showDetailsModal.start_date, showDetailsModal.end_date)} days
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Created:</span>{" "}
                      <span className="text-gray-600">{formatDate(showDetailsModal.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Name:</span> {showDetailsModal.user.first_name}{" "}
                        {showDetailsModal.user.last_name}
                      </p>
                      <p>
                        <span className="font-medium">Username:</span> @{showDetailsModal.user.username}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {showDetailsModal.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Car Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Car Information</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Vehicle:</span> {showDetailsModal.car.year}{" "}
                        {showDetailsModal.car.make} {showDetailsModal.car.model}
                      </p>
                      <p>
                        <span className="font-medium">License Plate:</span> {showDetailsModal.car.license_plate}
                      </p>
                      <p>
                        <span className="font-medium">Daily Rate:</span> ${showDetailsModal.car.daily_rate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Rental Period</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Start Date:</span>{" "}
                      <span className="text-gray-600">{formatDate(showDetailsModal.start_date)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">End Date:</span>{" "}
                      <span className="text-gray-600">{formatDate(showDetailsModal.end_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                {(showDetailsModal.pickup_location || showDetailsModal.dropoff_location) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Locations</h4>
                    <div className="text-sm space-y-2">
                      {showDetailsModal.pickup_location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">Pickup:</span>{" "}
                          <span className="text-gray-600 ml-2">{showDetailsModal.pickup_location}</span>
                        </div>
                      )}
                      {showDetailsModal.dropoff_location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">Dropoff:</span>{" "}
                          <span className="text-gray-600 ml-2">{showDetailsModal.dropoff_location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {showDetailsModal.notes && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md flex-1">{showDetailsModal.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editingBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-lg shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Edit Booking #{editingBooking.id}</h3>
                <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_amount}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, total_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={editForm.pickup_location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, pickup_location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter pickup location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                  <input
                    type="text"
                    value={editForm.dropoff_location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, dropoff_location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter dropoff location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    placeholder="Add any notes or comments"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveBooking}
                    disabled={updateBooking.isPending}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateBooking.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
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
