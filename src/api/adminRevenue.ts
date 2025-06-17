// api/adminRevenue.ts
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RevenueReport {
  total_revenue: number;
  bookings_count: number;
  period: string; // e.g., date or month string depending on type
  [key: string]: any;
}

interface RevenueFilters {
  type?: "daily" | "weekly" | "monthly" | "yearly";
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string;   // Format: YYYY-MM-DD
}

export const useAdminRevenueReport = (filters?: RevenueFilters) => {
  return useQuery<RevenueReport[], Error>({
    queryKey: ["adminRevenueReport", filters],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const url = new URL(`${API_BASE_URL}/api/admin/revenue-report/`);

      url.searchParams.append("type", filters?.type || "monthly");
      if (filters?.start_date) url.searchParams.append("start_date", filters.start_date);
      if (filters?.end_date) url.searchParams.append("end_date", filters.end_date);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to fetch revenue report.");
      }

      return response.json();
    },
  });
};
