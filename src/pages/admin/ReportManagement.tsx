"use client"

import {
  AlertTriangle,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Grid,
  List,
  Save,
  Search,
  User,
  UserX,
  X,
} from "lucide-react"
import React, { useMemo, useState } from "react"
import { useAdminReports } from "../../api/admin/adminReport"

// Updated interface to match actual API response
interface AdminReport {
  report_type: "user" | "car"
  reason: string
  reported_user_id: number | null
  reported_car_id: number | null
}

const ReportManagement = () => {
  const { useAdminReportsList, updateReport } = useAdminReports()

  // Filter states
  const [filters, setFilters] = useState({
    report_type: "",
    search: "",
  })

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [sortBy, setSortBy] = useState<"type" | "reason">("type")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // UI states
  const [showDetailsModal, setShowDetailsModal] = useState<AdminReport | null>(null)
  const [editingReport, setEditingReport] = useState<AdminReport | null>(null)
  const [editForm, setEditForm] = useState({
    status: "pending",
    admin_notes: "",
    suspend_user: false,
    remove_car: false,
  })

  // Fetch reports with current filters
  const { data: reports, isLoading, error, refetch } = useAdminReportsList(filters)

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    if (!reports || !Array.isArray(reports)) return []

    const filtered = reports.filter((report) => {
      // Add null checks for report properties
      if (!report || typeof report !== "object") return false

      const searchLower = filters.search?.toLowerCase() || ""
      const reason = report.reason?.toString().toLowerCase() || ""
      const reportType = report.report_type?.toString().toLowerCase() || ""

      const matchesSearch = !searchLower || reason.includes(searchLower) || reportType.includes(searchLower)
      const matchesType = !filters.report_type || report.report_type === filters.report_type

      return matchesSearch && matchesType
    })

    // Sort reports
    filtered.sort((a, b) => {
      let comparison = 0

      try {
        switch (sortBy) {
          case "type":
            const typeA = a.report_type?.toString() || ""
            const typeB = b.report_type?.toString() || ""
            comparison = typeA.localeCompare(typeB)
            break
          case "reason":
            const reasonA = a.reason?.toString() || ""
            const reasonB = b.reason?.toString() || ""
            comparison = reasonA.localeCompare(reasonB)
            break
          default:
            comparison = 0
        }
      } catch (error) {
        console.error("Error sorting reports:", error)
        comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [reports, filters.search, filters.report_type, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredAndSortedReports.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  React.useEffect(() => {
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

  // Handle sorting
  const handleSort = (field: "type" | "reason") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Handle report status update (mock function since status isn't in API)
  const handleStatusUpdate = (report: AdminReport, newStatus: "resolved" | "dismissed") => {
    if (!report) return
    console.log(`Updating report "${report.reason}" to ${newStatus}`)
    // You would implement the actual API call here
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      report_type: "",
      search: "",
    })
  }

  // Start editing report
  const startEdit = (report: AdminReport) => {
    if (!report) return
    setEditingReport(report)
    setEditForm({
      status: "pending",
      admin_notes: "",
      suspend_user: false,
      remove_car: false,
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingReport(null)
    setEditForm({
      status: "pending",
      admin_notes: "",
      suspend_user: false,
      remove_car: false,
    })
  }

  // Save report changes
  const saveReport = () => {
    if (!editingReport) return

    // Create updates object
    const updates: any = {
      status: editForm.status,
      admin_notes: editForm.admin_notes,
    }

    // Add conditional fields based on report type and status
    if (editForm.status === "resolved") {
      if (editingReport.report_type === "user" && editForm.suspend_user) {
        updates.suspend_user = true
      }
      if (editingReport.report_type === "car" && editForm.remove_car) {
        updates.remove_car = true
      }
    }

    console.log("Saving report updates:", updates)
    cancelEdit()
  }

  // Get report type badge styling
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-800"
      case "car":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "car":
        return <Car className="h-4 w-4 text-purple-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  // Safe report count calculations
  const totalReports = reports?.length || 0
  const userReports = reports?.filter((report) => report?.report_type === "user").length || 0
  const carReports = reports?.filter((report) => report?.report_type === "car").length || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-lg text-gray-700">Loading reports...</span>
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
            <div className="text-red-800 font-semibold mb-2">Error: {error?.message || "Failed to load reports"}</div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
          <p className="text-gray-600">
            Review and manage user and car reports, take appropriate actions to maintain platform safety
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reports</p>
                <p className="text-2xl font-semibold text-gray-900">{totalReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">User Reports</p>
                <p className="text-2xl font-semibold text-gray-900">{userReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Car Reports</p>
                <p className="text-2xl font-semibold text-gray-900">{carReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by reason or type..."
                value={filters.search || ""}
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
                  className={`p-2 ${viewMode === "grid" ? "bg-amber-500 text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-amber-500 text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={filters.report_type || ""}
                onChange={(e) => handleFilterChange("report_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Types</option>
                <option value="user">User Reports</option>
                <option value="car">Car Reports</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder]
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="type-asc">Type A-Z</option>
                <option value="type-desc">Type Z-A</option>
                <option value="reason-asc">Reason A-Z</option>
                <option value="reason-desc">Reason Z-A</option>
              </select>
            </div>

            <div></div>
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
              Showing {paginatedReports.length} of {filteredAndSortedReports.length} reports
            </div>
          </div>
        </div>

        {/* Reports Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReports.map((report, index) => {
              if (!report) return null

              return (
                <div
                  key={`${report.reason}-${index}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Report Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {getTypeIcon(report.report_type || "")}
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(report.report_type || "")}`}
                        >
                          {report.report_type || "Unknown"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">#{startIndex + index + 1}</span>
                    </div>

                    {/* Report Content */}
                    <div className="space-y-4">
                      {/* Reason */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Reason</p>
                        <p className="text-sm font-medium text-gray-900">{report.reason || "No reason provided"}</p>
                      </div>

                      {/* Reported Subject */}
                      <div className="p-3 bg-red-50 rounded-md">
                        <p className="text-xs text-gray-500 mb-2">
                          {report.report_type === "user" ? "Reported User ID" : "Reported Car ID"}
                        </p>
                        <div className="flex items-center">
                          {report.report_type === "user" ? (
                            <UserX className="h-5 w-5 text-red-500 mr-2" />
                          ) : (
                            <Car className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <p className="text-sm font-medium text-gray-900">
                            {report.report_type === "user"
                              ? report.reported_user_id?.toString() || "N/A"
                              : report.reported_car_id?.toString() || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-2">
                      {/* Quick Status Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(report, "resolved")}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(report, "dismissed")}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </button>
                      </div>

                      {/* Secondary Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDetailsModal(report)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => startEdit(report)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("type")}
                    >
                      Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort("reason")}
                    >
                      Reason {sortBy === "reason" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReports.map((report, index) => {
                    if (!report) return null

                    return (
                      <tr key={`${report.reason}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{startIndex + index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(report.report_type || "")}
                            <span
                              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(report.report_type || "")}`}
                            >
                              {report.report_type || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reason || "No reason provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.report_type === "user"
                            ? report.reported_user_id?.toString() || "N/A"
                            : report.reported_car_id?.toString() || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(report, "resolved")}
                              className="text-green-600 hover:text-green-900"
                              title="Resolve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(report, "dismissed")}
                              className="text-gray-600 hover:text-gray-900"
                              title="Dismiss"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDetailsModal(report)}
                              className="text-amber-600 hover:text-amber-900"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => startEdit(report)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit report"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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
                      className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNum
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
        {(!reports || filteredAndSortedReports.length === 0) && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <AlertTriangle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {reports && reports.length > 0 ? "No reports found" : "No reports available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {reports && reports.length > 0
                ? "Try adjusting your search or filter criteria"
                : "Reports will appear here when users submit them"}
            </p>
            {reports && reports.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Report Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Report Details</h3>
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Report Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Report Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Type:</span>{" "}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(showDetailsModal.report_type || "")}`}
                      >
                        {showDetailsModal.report_type || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Reason:</span>{" "}
                      <span className="text-gray-600">{showDetailsModal.reason || "No reason provided"}</span>
                    </div>
                  </div>
                </div>

                {/* Reported Subject Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    {showDetailsModal.report_type === "user" ? "Reported User" : "Reported Car"}
                  </h4>
                  <div className="bg-red-50 p-3 rounded-md">
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">
                          {showDetailsModal.report_type === "user" ? "User ID:" : "Car ID:"}
                        </span>{" "}
                        {showDetailsModal.report_type === "user"
                          ? showDetailsModal.reported_user_id?.toString() || "N/A"
                          : showDetailsModal.reported_car_id?.toString() || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Report Modal */}
        {editingReport && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-lg shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Edit Report</h3>
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
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, admin_notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    placeholder="Add notes about your decision or actions taken"
                  />
                </div>

                {/* Conditional Actions */}
                {editForm.status === "resolved" && (
                  <div className="space-y-3 p-3 bg-yellow-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900">Resolution Actions</h4>
                    {editingReport.report_type === "user" && (
                      <div>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={editForm.suspend_user}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, suspend_user: e.target.checked }))}
                            className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-red-700 font-medium">Suspend reported user</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6">
                          This will suspend the reported user's account immediately
                        </p>
                      </div>
                    )}
                    {editingReport.report_type === "car" && (
                      <div>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={editForm.remove_car}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, remove_car: e.target.checked }))}
                            className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-red-700 font-medium">Remove reported car</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6">
                          This will remove the reported car from the platform immediately
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveReport}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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

export default ReportManagement
