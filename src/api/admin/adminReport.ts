// adminReport.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interface based on your actual API response
interface AdminReport {
  report_type: "car";
  reason: string;
  reported_user_id: number | null;
  reported_car_id: number | null;
}

interface UpdateReportPayload {
  status?: "pending" | "resolved" | "dismissed";
  admin_notes?: string;
}

// Based on backend documentation - simplified response
interface UpdateReportResponse {
  id: number;
  report_type: "car";
  status: "pending" | "resolved" | "dismissed";
}

export const useAdminReports = () => {
  const queryClient = useQueryClient();

  // Fetch all reports
  const useAdminReportsList = () => {
    return useQuery<AdminReport[], Error>({
      queryKey: ["adminReports"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const url = `${API_BASE_URL}/api/admin/reports/`;

        console.log("Fetching reports from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Fetch reports error:", response.status, errorData);
          throw new Error(
            errorData.detail ||
              `Failed to fetch reports. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Reports fetched successfully:", data);
        return data;
      },
    });
  };

  // Update report - using PUT method as specified in backend
  const updateReport = useMutation<
    UpdateReportResponse,
    Error,
    { report_id: number; payload: UpdateReportPayload }
  >({
    mutationFn: async ({ report_id, payload }) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating report:", report_id, "with payload:", payload);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reports/${report_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update report error:", response.status, errorData);
        throw new Error(
          errorData.detail ||
            `Failed to update report. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Report updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast.success("Report updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
    onError: (error) => {
      console.error("Update Report Error:", error);
      toast.error(error.message);
    },
  });

  return {
    useAdminReportsList,
    updateReport,
  };
};