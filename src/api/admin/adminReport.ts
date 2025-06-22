import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

interface UpdateReportPayload {
  report_id: number
  updates: {
    status?: "pending" | "resolved" | "dismissed"
    admin_notes?: string
    suspend_user?: boolean
    remove_car?: boolean
  }
}

interface UpdateReportResponse {
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

export const useAdminReports = () => {
  const queryClient = useQueryClient()

  // Fetch all reports with optional filters
  const useAdminReportsList = (filters?: {
    report_type?: string
    status?: string
  }) => {
    return useQuery<AdminReport[], Error>({
      queryKey: ["adminReports", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const url = new URL(`${API_BASE_URL}/api/admin/reports/`)
        if (filters?.report_type) url.searchParams.append("report_type", filters.report_type)
        if (filters?.status) url.searchParams.append("status", filters.status)

        console.log("Fetching reports from:", url.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Fetch reports error:", response.status, errorData)
          throw new Error(errorData.detail || `Failed to fetch reports. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Reports fetched successfully:", data)
        return data
      },
    })
  }

  // Update report - using PUT method as specified in backend
  const updateReport = useMutation<UpdateReportResponse, Error, UpdateReportPayload>({
    mutationFn: async ({ report_id, updates }) => {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Clean up the updates object - remove undefined values
      const cleanUpdates = Object.entries(updates).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>,
      )

      console.log("Updating report:", report_id, "with cleaned updates:", cleanUpdates)

      const response = await fetch(`${API_BASE_URL}/api/admin/reports/${report_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(cleanUpdates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update report error:", response.status, errorData)

        // Handle different types of errors
        if (response.status === 400) {
          const errorMessage = Object.entries(errorData)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(", ")}`
              } else if (typeof value === "object" && value !== null) {
                return `${key}: ${JSON.stringify(value)}`
              } else {
                return `${key}: ${value}`
              }
            })
            .join("; ")
          throw new Error(errorMessage || "Invalid data provided")
        } else if (response.status === 403) {
          throw new Error("You don't have permission to update this report")
        } else if (response.status === 404) {
          throw new Error("Report not found")
        } else {
          throw new Error(errorData.detail || `Failed to update report. Status: ${response.status}`)
        }
      }

      const data = await response.json()
      console.log("Report updated successfully:", data)
      return data
    },
    onSuccess: (data) => {
      toast.success("Report updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminReports"] })
    },
    onError: (error) => {
      console.error("Update Report Error:", error)
      toast.error(error.message)
    },
  })

  return {
    useAdminReportsList,
    updateReport,
  }
}
