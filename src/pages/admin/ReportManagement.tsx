import { useState } from "react"
import { useAdminReports } from "../../api/admin/adminReport"

interface AdminReport {
  id: number
  report_type: "user" | "car"
  status: "pending" | "resolved" | "dismissed"
  reporter: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  reported_user?: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  reported_car?: {
    id: number
    make: string
    model: string
    year: number
    license_plate: string
    owner: {
      id: number
      username: string
      first_name: string
      last_name: string
    }
  }
  reason: string
  description: string
  admin_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  resolved_by?: {
    id: number
    username: string
    first_name: string
    last_name: string
  }
}

const ReportManagement = () => {
  const { useAdminReportsList, updateReport } = useAdminReports()

  // Filter states
  const [filters, setFilters] = useState({
    report_type: "",
    status: "",
  })

  // UI states
  const [showDetailsModal, setShowDetailsModal] = useState<AdminReport | null>(null)
  const [editingReport, setEditingReport] = useState<AdminReport | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    admin_notes: "",
    suspend_user: false,
    remove_car: false,
  })

  // Fetch reports with current filters
  const { data: reports, isLoading, error, refetch } = useAdminReportsList(filters)

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  // Handle report status update (quick action)
  const handleStatusUpdate = (report: AdminReport, newStatus: "pending" | "resolved" | "dismissed") => {
    updateReport.mutate({
      report_id: report.id,
      updates: { status: newStatus },
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      report_type: "",
      status: "",
    })
  }

  // Start editing report
  const startEdit = (report: AdminReport) => {
    setEditingReport(report)
    setEditForm({
      status: report.status,
      admin_notes: report.admin_notes || "",
      suspend_user: false,
      remove_car: false,
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingReport(null)
    setEditForm({
      status: "",
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

    updateReport.mutate(
      {
        report_id: editingReport.id,
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
      case "resolved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
        <p className="text-gray-600">
          Review and manage user and car reports, take appropriate actions to maintain platform safety
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Report Type */}
          <div>
            <label htmlFor="report_type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="report_type"
              value={filters.report_type}
              onChange={(e) => handleFilterChange("report_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Types</option>
              <option value="user">User Reports</option>
              <option value="car">Car Reports</option>
            </select>
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
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
          <div className="text-sm text-gray-500 flex items-center">{reports?.length || 0} reports found</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports?.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
              {/* Report Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(report.report_type)}`}
                  >
                    {report.report_type}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">#{report.id}</span>
              </div>

              {/* Report Content */}
              <div className="space-y-3">
                {/* Reporter */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reported by</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {report.reporter.first_name?.[0]}
                          {report.reporter.last_name?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">
                        {report.reporter.first_name} {report.reporter.last_name}
                      </p>
                      <p className="text-xs text-gray-500">@{report.reporter.username}</p>
                    </div>
                  </div>
                </div>

                {/* Reported Subject */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {report.report_type === "user" ? "Reported User" : "Reported Car"}
                  </p>
                  {report.report_type === "user" && report.reported_user ? (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-red-700">
                            {report.reported_user.first_name?.[0]}
                            {report.reported_user.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">
                          {report.reported_user.first_name} {report.reported_user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">@{report.reported_user.username}</p>
                      </div>
                    </div>
                  ) : (
                    report.report_type === "car" &&
                    report.reported_car && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {report.reported_car.year} {report.reported_car.make} {report.reported_car.model}
                        </p>
                        <p className="text-xs text-gray-500">{report.reported_car.license_plate}</p>
                        <p className="text-xs text-gray-500">
                          Owner: {report.reported_car.owner.first_name} {report.reported_car.owner.last_name}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Reason */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reason</p>
                  <p className="text-sm font-medium text-gray-900">{report.reason}</p>
                </div>

                {/* Description Preview */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {report.description.length > 100
                      ? `${report.description.substring(0, 100)}...`
                      : report.description}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs text-gray-500">Reported on {formatDate(report.created_at)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {/* Quick Status Actions */}
                {report.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(report, "resolved")}
                      disabled={updateReport.isPending}
                      className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(report, "dismissed")}
                      disabled={updateReport.isPending}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Secondary Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(report)}
                    className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(report)}
                    className="flex-1 bg-purple-100 text-purple-800 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!reports || reports.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Report Details #{showDetailsModal.id}</h3>
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
              {/* Report Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Report Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Type:</span>{" "}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(showDetailsModal.report_type)}`}
                    >
                      {showDetailsModal.report_type}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Status:</span>{" "}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(showDetailsModal.status)}`}
                    >
                      {showDetailsModal.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Reason:</span>{" "}
                    <span className="text-gray-600">{showDetailsModal.reason}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Created:</span>{" "}
                    <span className="text-gray-600">{formatDate(showDetailsModal.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Reporter Information</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {showDetailsModal.reporter.first_name}{" "}
                      {showDetailsModal.reporter.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span> @{showDetailsModal.reporter.username}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {showDetailsModal.reporter.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reported Subject Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  {showDetailsModal.report_type === "user" ? "Reported User" : "Reported Car"}
                </h4>
                <div className="bg-red-50 p-3 rounded-md">
                  {showDetailsModal.report_type === "user" && showDetailsModal.reported_user ? (
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Name:</span> {showDetailsModal.reported_user.first_name}{" "}
                        {showDetailsModal.reported_user.last_name}
                      </p>
                      <p>
                        <span className="font-medium">Username:</span> @{showDetailsModal.reported_user.username}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {showDetailsModal.reported_user.email}
                      </p>
                    </div>
                  ) : (
                    showDetailsModal.report_type === "car" &&
                    showDetailsModal.reported_car && (
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Vehicle:</span> {showDetailsModal.reported_car.year}{" "}
                          {showDetailsModal.reported_car.make} {showDetailsModal.reported_car.model}
                        </p>
                        <p>
                          <span className="font-medium">License Plate:</span>{" "}
                          {showDetailsModal.reported_car.license_plate}
                        </p>
                        <p>
                          <span className="font-medium">Owner:</span> {showDetailsModal.reported_car.owner.first_name}{" "}
                          {showDetailsModal.reported_car.owner.last_name} (@
                          {showDetailsModal.reported_car.owner.username})
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{showDetailsModal.description}</p>
              </div>

              {/* Admin Notes */}
              {showDetailsModal.admin_notes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Admin Notes</h4>
                  <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-md">{showDetailsModal.admin_notes}</p>
                </div>
              )}

              {/* Resolution Info */}
              {showDetailsModal.status === "resolved" && showDetailsModal.resolved_at && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Resolution Information</h4>
                  <div className="bg-green-50 p-3 rounded-md text-sm">
                    <p>
                      <span className="font-medium">Resolved on:</span> {formatDate(showDetailsModal.resolved_at)}
                    </p>
                    {showDetailsModal.resolved_by && (
                      <p>
                        <span className="font-medium">Resolved by:</span> {showDetailsModal.resolved_by.first_name}{" "}
                        {showDetailsModal.resolved_by.last_name} (@{showDetailsModal.resolved_by.username})
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-200 max-w-lg shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Report #{editingReport.id}</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  disabled={updateReport.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updateReport.isPending ? "Saving..." : "Save Changes"}
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

export default ReportManagement
