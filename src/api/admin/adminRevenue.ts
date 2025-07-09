// adminRevenue.ts
import { useQuery } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface RevenueData {
  period: string
  total_revenue: string
  booking_count: number
  commission_earned: string
  average_booking_value: string
  growth_rate?: number
}

export interface RevenueStats {
  total_revenue: string
  total_bookings: number
  total_commission: string
  average_booking_value: string
  revenue_growth: number
  booking_growth: number
}

export interface RevenueResponse {
  stats: RevenueStats
  data: RevenueData[]
  period_type: "daily" | "weekly" | "monthly" | "yearly"
  start_date: string
  end_date: string
}

export const useAdminRevenue = () => {
  // Fetch revenue report with optional filters
  const useRevenueReport = (filters?: {
    type?: "daily" | "weekly" | "monthly" | "yearly"
    start_date?: string
    end_date?: string
  }) => {
    return useQuery<RevenueResponse, Error>({
      queryKey: ["adminRevenue", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const url = new URL(`${API_BASE_URL}/api/admin/revenue-report/`)
        if (filters?.type) url.searchParams.append("type", filters.type)
        if (filters?.start_date) url.searchParams.append("start_date", filters.start_date)
        if (filters?.end_date) url.searchParams.append("end_date", filters.end_date)

        console.log("Fetching revenue report from:", url.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Fetch revenue report error:", response.status, errorData)
          throw new Error(errorData.detail || `Failed to fetch revenue report. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Revenue report fetched successfully:", data)
        return data
      },
    })
  }

  return {
    useRevenueReport,
  }
}
