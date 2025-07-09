import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface AdminReport {
  id: number
  report_type: "car"
  status: "pending" | "resolved" | "dismissed"
  reason?: string
  reported_user_id?: number | null
  reported_car_id?: number | null
  admin_notes?: string
  created_at?: string
  updated_at?: string
}

// Payload for updating a report
interface UpdateReportPayload {
  status?: "pending" | "resolved" | "dismissed"
  admin_notes?: string
}

// Response from PUT /api/admin/reports/{report_id}/
interface UpdateReportResponse {
  id: number
  report_type: "car"
  status: "pending" | "resolved" | "dismissed"
  admin_notes?: string
}

export const useAdminReports = () => {
  const queryClient = useQueryClient()

  // Fetch all admin reports
  const useAdminReportsList = () => {
    return useQuery<AdminReport[], Error>({
      queryKey: ["adminReports"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")
        if (!token) throw new Error("No authentication token found")

        const url = `${API_BASE_URL}/api/admin/reports/`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail || "Failed to fetch admin users.")
        }

        return response.json()
      },
    })
  }

  // Update a report (PUT /api/admin/reports/{report_id}/)
  const updateReport = useMutation<UpdateReportResponse, Error, { report_id: number; payload: UpdateReportPayload }>({
    mutationFn: async ({ report_id, payload }) => {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("No authentication token found")
      if (!report_id || report_id <= 0) throw new Error(`Invalid report ID: ${report_id}`)

      const url = `${API_BASE_URL}/api/admin/reports/${report_id}/`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Failed to fetch admin users.")
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success("Report updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminReports"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    useAdminReportsList,
    updateReport,
  }
}
