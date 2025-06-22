"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAdminCars } from "../../api/admin/adminCarApproval"

interface AdminCar {
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
  status: "pending" | "available" | "rejected"
  auto_approve_bookings: boolean
  owner?: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

const CarManagement = () => {
  const { useAdminCarsList, updateCar, deleteCar } = useAdminCars()

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    owner_id: undefined as number | undefined,
    search: "",
  })

  // UI states
  const [selectedCar, setSelectedCar] = useState<AdminCar | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<AdminCar | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState<AdminCar | null>(null)
  const [editingCar, setEditingCar] = useState<AdminCar | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    make: "",
    model: "",
    year: "",
    color: "",
    license_plate: "",
    description: "",
    daily_rate: "",
    location: "",
    latitude: "",
    longitude: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    auto_approve_bookings: false,
  })

  // Fetch cars with current filters
  const { data: cars, isLoading, error, refetch } = useAdminCarsList(filters)

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.search, refetch])

  // Handle car status update (quick action)
  const handleStatusUpdate = (car: AdminCar, newStatus: "pending" | "available" | "rejected") => {
    updateCar.mutate({
      car_id: car.id,
      updates: { status: newStatus },
    })
  }

  // Handle delete car
  const handleDelete = (car: AdminCar) => {
    setShowDeleteModal(car)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (!showDeleteModal) return

    deleteCar.mutate(showDeleteModal.id, {
      onSuccess: () => {
        setShowDeleteModal(null)
      },
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      owner_id: undefined,
      search: "",
    })
  }

  // Start editing car - populate form with current values
  const startEdit = (car: AdminCar) => {
    setEditingCar(car)
    setEditForm({
      status: car.status,
      make: car.make,
      model: car.model,
      year: String(car.year),
      color: car.color,
      license_plate: car.license_plate,
      description: car.description,
      daily_rate: car.daily_rate,
      location: car.location,
      latitude: String(car.latitude),
      longitude: String(car.longitude),
      seats: String(car.seats),
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      auto_approve_bookings: car.auto_approve_bookings,
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingCar(null)
    setEditForm({
      status: "",
      make: "",
      model: "",
      year: "",
      color: "",
      license_plate: "",
      description: "",
      daily_rate: "",
      location: "",
      latitude: "",
      longitude: "",
      seats: "",
      transmission: "",
      fuel_type: "",
      auto_approve_bookings: false,
    })
  }

  // Save car changes - only send changed fields
  const saveCar = () => {
    if (!editingCar) return

    // Create updates object with only changed fields
    const updates: any = {}

    if (editForm.status !== editingCar.status) updates.status = editForm.status
    if (editForm.make !== editingCar.make) updates.make = editForm.make
    if (editForm.model !== editingCar.model) updates.model = editForm.model
    if (editForm.year !== String(editingCar.year)) updates.year = Number(editForm.year)
    if (editForm.color !== editingCar.color) updates.color = editForm.color
    if (editForm.license_plate !== editingCar.license_plate) updates.license_plate = editForm.license_plate
    if (editForm.description !== editingCar.description) updates.description = editForm.description
    if (editForm.daily_rate !== editingCar.daily_rate) updates.daily_rate = editForm.daily_rate
    if (editForm.location !== editingCar.location) updates.location = editForm.location
    if (editForm.latitude !== String(editingCar.latitude)) updates.latitude = Number(editForm.latitude)
    if (editForm.longitude !== String(editingCar.longitude)) updates.longitude = Number(editForm.longitude)
    if (editForm.seats !== String(editingCar.seats)) updates.seats = Number(editForm.seats)
    if (editForm.transmission !== editingCar.transmission) updates.transmission = editForm.transmission
    if (editForm.fuel_type !== editingCar.fuel_type) updates.fuel_type = editForm.fuel_type
    if (editForm.auto_approve_bookings !== editingCar.auto_approve_bookings)
      updates.auto_approve_bookings = editForm.auto_approve_bookings

    // Only proceed if there are changes
    if (Object.keys(updates).length === 0) {
      toast.error("No changes detected")
      return
    }

    updateCar.mutate(
      {
        car_id: editingCar.id,
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
      case "available":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Management</h1>
        <p className="text-gray-600">Review and approve car listings, manage car status and details</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Make, model, license plate..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

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
              <option value="pending_approval">Pending</option>
              <option value="available">Available</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Owner ID */}
          <div>
            <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700 mb-1">
              Owner ID
            </label>
            <input
              type="number"
              id="owner_id"
              placeholder="Filter by owner ID"
              value={filters.owner_id || ""}
              onChange={(e) =>
                handleFilterChange("owner_id", e.target.value ? Number.parseInt(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
          <div className="text-sm text-gray-500 flex items-center">{cars?.length || 0} cars found</div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car) => (
          <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Car Image Placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="p-4">
              {/* Car Title */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(car.status)}`}
                >
                  {car.status}
                </span>
              </div>

              {/* Car Details */}
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">License:</span> {car.license_plate}
                </p>
                <p>
                  <span className="font-medium">Color:</span> {car.color}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {car.location}
                </p>
                <p>
                  <span className="font-medium">Daily Rate:</span> ${car.daily_rate}
                </p>
                <p>
                  <span className="font-medium">Seats:</span> {car.seats} | <span className="font-medium">Fuel:</span>{" "}
                  {car.fuel_type}
                </p>
              </div>

              {/* Owner Info */}
              {car.owner && (
                <div className="mb-4 p-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {car.owner.first_name} {car.owner.last_name}
                  </p>
                  <p className="text-xs text-gray-500">@{car.owner.username}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Quick Status Update Buttons */}
                {editingCar?.id !== car.id && (
                  <>
                    {car.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(car, "available")}
                          disabled={updateCar.isPending}
                          className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          {updateCar.isPending ? "Updating..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(car, "rejected")}
                          disabled={updateCar.isPending}
                          className="flex-1 bg-red-100 text-red-800 px-3 py-2 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          {updateCar.isPending ? "Updating..." : "Reject"}
                        </button>
                      </div>
                    )}

                    {car.status === "available" && (
                      <button
                        onClick={() => handleStatusUpdate(car, "rejected")}
                        disabled={updateCar.isPending}
                        className="w-full bg-red-100 text-red-800 px-3 py-2 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {updateCar.isPending ? "Updating..." : "Reject"}
                      </button>
                    )}

                    {car.status === "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(car, "available")}
                        disabled={updateCar.isPending}
                        className="w-full bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {updateCar.isPending ? "Updating..." : "Approve"}
                      </button>
                    )}

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(car)}
                        className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDetailsModal(car)}
                        className="flex-1 bg-purple-100 text-purple-800 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

                {/* Full Edit Form */}
                {editingCar?.id === car.id && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="available">Available</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Daily Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.daily_rate}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, daily_rate: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Make</label>
                        <input
                          type="text"
                          value={editForm.make}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, make: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                        <input
                          type="text"
                          value={editForm.model}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, model: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="text"
                          value={editForm.color}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">License Plate</label>
                        <input
                          type="text"
                          value={editForm.license_plate}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, license_plate: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Seats</label>
                        <input
                          type="number"
                          value={editForm.seats}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, seats: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                        <select
                          value={editForm.transmission}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, transmission: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                        <select
                          value={editForm.fuel_type}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, fuel_type: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={editForm.auto_approve_bookings}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, auto_approve_bookings: e.target.checked }))
                          }
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Auto Approve Bookings
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveCar}
                        disabled={updateCar.isPending}
                        className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {updateCar.isPending ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!cars || cars.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        </div>
      )}

      {/* Car Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {showDetailsModal.year} {showDetailsModal.make} {showDetailsModal.model}
              </h3>
              <button
                onClick={() => setShowDetailsModal(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-900">License Plate:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.license_plate}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Color:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.color}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.location}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Daily Rate:</span>{" "}
                  <span className="text-gray-600">${showDetailsModal.daily_rate}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Seats:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.seats}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-900">Transmission:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.transmission}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Fuel Type:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.fuel_type}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Status:</span>{" "}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(showDetailsModal.status)}`}
                  >
                    {showDetailsModal.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Auto Approve:</span>{" "}
                  <span className="text-gray-600">{showDetailsModal.auto_approve_bookings ? "Yes" : "No"}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Coordinates:</span>{" "}
                  <span className="text-gray-600">
                    {showDetailsModal.latitude}, {showDetailsModal.longitude}
                  </span>
                </p>
              </div>
            </div>

            {showDetailsModal.description && (
              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">Description:</p>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{showDetailsModal.description}</p>
              </div>
            )}

            {showDetailsModal.owner && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900 mb-2">Owner Information:</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Name:</span> {showDetailsModal.owner.first_name}{" "}
                    {showDetailsModal.owner.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Username:</span> @{showDetailsModal.owner.username}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {showDetailsModal.owner.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Car</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-900">
                    {showDeleteModal.year} {showDeleteModal.make} {showDeleteModal.model}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteCar.isPending}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 transition-colors"
                >
                  {deleteCar.isPending ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
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

export default CarManagement
