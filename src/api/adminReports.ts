// api/adminReports.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AdminReport {
  id: number;
  report_type: "user" | "car";
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  admin_notes?: string;
  reported_user_id?: number;
  reported_car_id?: number;
  [key: string]: any;
}

interface UpdateReportPayload {
  report_id: number;
  updates: {
    status: "pending" | "resolved" | "dismissed";
    admin_notes: string;
    suspend_user?: boolean;
    remove_car?: boolean;
  };
}

export const useAdminReports = () => {
  const queryClient = useQueryClient();

  // Fetch reports with optional filters
  const useReports = (filters?: {
    report_type?: string;
    status?: string;
  }) => {
    return useQuery<AdminReport[], Error>({
      queryKey: ["adminReports", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");
        const url = new URL(`${API_BASE_URL}/api/admin/reports/`);

        if (filters?.report_type) url.searchParams.append("report_type", filters.report_type);
        if (filters?.status) url.searchParams.append("status", filters.status);

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to fetch reports.");
        }

        return response.json();
      },
    });
  };

  // Update a specific report
  const updateReport = useMutation<void, Error, UpdateReportPayload>({
    mutationFn: async ({ report_id, updates }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/reports/${report_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to update report.");
      }
    },
    onSuccess: () => {
      toast.success("Report updated successfully.");
      queryClient.invalidateQueries(["adminReports"]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Update Report Error:", error);
    },
  });

  return {
    useReports,
    updateReport,
  };
};
