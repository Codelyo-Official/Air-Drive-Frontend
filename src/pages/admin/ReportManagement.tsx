"use client"

import { AlertTriangle, Car, Edit, Save, X } from "lucide-react"
import { useState } from "react"
import { useAdminReports } from "../../api/admin/adminReport"

// ✅ Minimal interface matching your backend
interface AdminReport {
  id: number
  report_type: "car"
  status: "pending" | "resolved" | "dismissed"
  // Optional fields that may or may not be present
  reason?: string
  reported_user_id?: number | null
  reported_car_id?: number | null
  admin_notes?: string
}

const ReportManagement = () => {
  const { useAdminReportsList, updateReport } = useAdminReports()

  // UI states
  const [editingReport, setEditingReport] = useState<AdminReport | null>(null)
  const [editForm, setEditForm] = useState({
    status: "pending" as "pending" | "resolved" | "dismissed",
    admin_notes: "",
  })

  // Fetch reports
  const { data: reports, isLoading, error, refetch } = useAdminReportsList()

  // Start editing report
  const startEdit = (report: AdminReport) => {
    console.log("Editing report:", report)
    setEditingReport(report)
    setEditForm({
      status: report.status || "pending",
      admin_notes: report.admin_notes || "",
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingReport(null)
    setEditForm({
      status: "pending",
      admin_notes: "",
    })
  }

  // Save report changes
  const saveReport = async () => {
    if (!editingReport?.reported_car_id) {
      alert("Error: No reported_car_id found")
      return
    }

    const payload = {
      status: editForm.status,
      ...(editForm.admin_notes.trim() && { admin_notes: editForm.admin_notes.trim() }),
    }

    console.log("Saving report with reported_car_id:", editingReport.reported_car_id, "with payload:", payload)

    updateReport.mutate({
      report_id: editingReport.reported_car_id,
      payload: payload,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error loading reports</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Report Management</h1>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports?.map((report) => (
                <tr key={report.reported_car_id
                } className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{report.reported_car_id
                  }</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Car className="w-3 h-3 mr-1" />
                      {report.report_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : report.status === "dismissed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.reason || "No reason provided"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => startEdit(report)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingReport && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Report #{editingReport.id}</h3>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value as "pending" | "resolved" | "dismissed",
                      }))
                    }
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Add your notes here..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveReport}
                    disabled={updateReport.isPending}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateReport.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!reports || reports.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">Reports will appear here when submitted by users.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ReportManagement
