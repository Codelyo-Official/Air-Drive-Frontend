import { useState, useEffect } from "react"
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
  })

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

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  // Handle search with debounce for date filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.start_date, filters.end_date, refetch])

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <strong>Error:</strong> {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">
          Manage car rental bookings, approve or reject requests, and track booking status
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="number"
              id="user_id"
              placeholder="Filter by user ID"
              value={filters.user_id || ""}
              onChange={(e) =>
                handleFilterChange("user_id", e.target.value ? Number.parseInt(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Car ID */}
          <div>
            <label htmlFor="car_id" className="block text-sm font-medium text-gray-700 mb-1">
              Car ID
            </label>
            <input
              type="number"
              id="car_id"
              placeholder="Filter by car ID"
              value={filters.car_id || ""}
              onChange={(e) =>
                handleFilterChange("car_id", e.target.value ? Number.parseInt(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
          <div className="text-sm text-gray-500 flex items-center">{bookings?.length || 0} bookings found</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings?.map((booking) => (
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
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
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
                    {editingBooking?.id === booking.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingBooking?.id === booking.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveBooking}
                          disabled={updateBooking.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {updateBooking.isPending ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking, "approved")}
                              disabled={updateBooking.isPending}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking, "rejected")}
                              disabled={updateBooking.isPending}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => startEdit(booking)} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDetailsModal(booking)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!bookings || bookings.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}
      </div>

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
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                      <p>
                        <span className="font-medium text-gray-900">Pickup:</span>{" "}
                        <span className="text-gray-600">{showDetailsModal.pickup_location}</span>
                      </p>
                    )}
                    {showDetailsModal.dropoff_location && (
                      <p>
                        <span className="font-medium text-gray-900">Dropoff:</span>{" "}
                        <span className="text-gray-600">{showDetailsModal.dropoff_location}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {showDetailsModal.notes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{showDetailsModal.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for Full Booking Details */}
      {editingBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-lg shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Booking #{editingBooking.id}</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editForm.pickup_location}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, pickup_location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pickup location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                <input
                  type="text"
                  value={editForm.dropoff_location}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, dropoff_location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dropoff location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes or comments"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveBooking}
                  disabled={updateBooking.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updateBooking.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
