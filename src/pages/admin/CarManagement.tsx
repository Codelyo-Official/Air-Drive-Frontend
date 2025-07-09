"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Search,
  Car,
  MapPin,
  Users,
  DollarSign,
  Settings,
  Fuel,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Save,
  User,
  Mail,
  Calendar,
  Grid,
  List,
} from "lucide-react"
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
  images?: {
    id: number
    image: string
    is_primary: boolean
  }[]
  features?: {
    name: string
  }[]
  availability?: {
    start_date: string
    end_date: string
  }[]
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
    search: "",
  })

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [sortBy, setSortBy] = useState<"name" | "rate" | "year" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // UI states
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

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    if (!cars) return []
    const sorted = [...cars].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
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
    return sorted
  }, [cars, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCars = filteredAndSortedCars.slice(startIndex, startIndex + itemsPerPage)

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
    setCurrentPage(1)
  }

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.search, refetch])

  // Handle sorting
  const handleSort = (field: "name" | "rate" | "year" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

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
      search: "",
    })
  }

  // Start editing car
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
  }

  // Save car changes
  const saveCar = () => {
    if (!editingCar) return
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-lg text-gray-700">Loading cars...</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Management</h1>
          <p className="text-gray-600">Review and approve car listings, manage car status and details</p>
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
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {cars.filter((car) => car.status === "pending").length}
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
                    {cars.filter((car) => car.status === "available").length}
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

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by make, model, license plate..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            {/* Controls */}
            <div className="flex items-center gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="available">Available</option>
                <option value="rejected">Rejected</option>
              </select>
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
              Showing {paginatedCars.length} of {filteredAndSortedCars.length} cars
            </div>
          </div>
        </div>

        {/* Cars Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Car Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images.find((img) => img.is_primary)?.image || car.images[0]?.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center ${car.images && car.images.length > 0 ? "hidden" : "flex"}`}
                  >
                    <Car className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  {/* Car Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-500">{car.license_plate}</p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(car.status)}
                      <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(car.status)}`}>
                        {car.status}
                      </span>
                    </div>
                  </div>
                  {/* Car Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">${car.daily_rate}/day</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{car.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {car.seats}
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-1" />
                        {car.transmission}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-1" />
                        {car.fuel_type}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Quick Status Actions */}
                    {car.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(car, "available")}
                          disabled={updateCar.isPending}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(car, "rejected")}
                          disabled={updateCar.isPending}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDetailsModal(car)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => startEdit(car)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("name")}
                    >
                      Car {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("rate")}
                    >
                      Daily Rate {sortBy === "rate" && (sortOrder === "asc" ? "↑" : "↓")}
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
                          <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <img
                                src={car.images.find((img) => img.is_primary)?.image || car.images[0]?.image}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                  e.currentTarget.nextElementSibling.style.display = "flex"
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full flex items-center justify-center ${car.images && car.images.length > 0 ? "hidden" : "flex"}`}
                            >
                              <Car className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {car.year} {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500">{car.license_plate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="font-medium text-gray-900">${car.daily_rate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(car.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(car.status)}`}
                          >
                            {car.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {car.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(car, "available")}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(car, "rejected")}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setShowDetailsModal(car)}
                            className="text-amber-600 hover:text-amber-900"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => startEdit(car)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit car"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(car)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete car"
                          >
                            <Trash2 className="h-4 w-4" />
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
        {(!cars || filteredAndSortedCars.length === 0) && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {cars && cars.length > 0 ? "No cars found" : "No cars available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {cars && cars.length > 0
                ? "Try adjusting your search or filter criteria"
                : "Cars will appear here once owners submit them for approval"}
            </p>
            {cars && cars.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Edit Car Modal */}
        {editingCar && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit {editingCar.year} {editingCar.make} {editingCar.model}
                </h3>
                <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="available">Available</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.daily_rate}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, daily_rate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                      type="text"
                      value={editForm.make}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, make: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      value={editForm.model}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      value={editForm.year}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={editForm.color}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                      type="text"
                      value={editForm.license_plate}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, license_plate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={editForm.seats}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, seats: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select
                      value={editForm.transmission}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, transmission: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select
                      value={editForm.fuel_type}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, fuel_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={editForm.latitude}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, latitude: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={editForm.longitude}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, longitude: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.auto_approve_bookings}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, auto_approve_bookings: e.target.checked }))}
                      className="mr-2 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Auto-approve bookings</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={saveCar}
                  disabled={updateCar.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCar.isPending ? "Saving..." : "Save Changes"}
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
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Car Images Gallery */}
              {showDetailsModal.images && showDetailsModal.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {showDetailsModal.images.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image || "/placeholder.svg"}
                          alt={`${showDetailsModal.make} ${showDetailsModal.model} - Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                        {image.is_primary && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1 py-0.5 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">License:</span>
                    <span className="ml-2">{showDetailsModal.license_plate}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">Year:</span>
                    <span className="ml-2">{showDetailsModal.year}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{showDetailsModal.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Daily Rate:</span>
                    <span className="ml-2">${showDetailsModal.daily_rate}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">Seats:</span>
                    <span className="ml-2">{showDetailsModal.seats}</span>
                  </div>
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">Transmission:</span>
                    <span className="ml-2">{showDetailsModal.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">Fuel Type:</span>
                    <span className="ml-2">{showDetailsModal.fuel_type}</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(showDetailsModal.status)}
                    <span className="font-medium ml-2">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(showDetailsModal.status)}`}
                    >
                      {showDetailsModal.status}
                    </span>
                  </div>
                </div>
              </div>
              {showDetailsModal.description && (
                <div className="mb-6">
                  <p className="font-medium text-gray-900 mb-2">Description:</p>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{showDetailsModal.description}</p>
                </div>
              )}
              {showDetailsModal.owner && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium text-gray-900 mb-3">Owner Information:</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {showDetailsModal.owner.first_name} {showDetailsModal.owner.last_name}
                      </div>
                      <div className="text-sm text-gray-500">@{showDetailsModal.owner.username}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {showDetailsModal.owner.email}
                      </div>
                    </div>
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
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
    </div>
  )
}

export default CarManagement
