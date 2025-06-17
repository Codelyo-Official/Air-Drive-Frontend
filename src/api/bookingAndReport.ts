// api/bookingAndReport.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Booking {
  id: number;
  user: number;
  car: number;
  status: string;
  // Add other fields as needed
}

interface BookingApprovalPayload {
  booking_id: number;
  action: "approve" | "reject";
}

interface ReportPayload {
  report_type: "user" | "car";
  reason: string;
  reported_user_id?: number;
  reported_car_id?: number;
}

export const useBookingAndReport = () => {
  const queryClient = useQueryClient();

  // Get Owner Bookings
  const useOwnerBookings = (status?: string) => {
    return useQuery<Booking[], Error>({
      queryKey: ["ownerBookings", status],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");
        const url = new URL(`${API_BASE_URL}/api/owner-bookings/`);
        if (status) url.searchParams.append("status", status);

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to fetch bookings.");
        }

        return response.json();
      },
    });
  };

  // Booking Approval (Approve/Reject)
  const bookingApproval = useMutation<void, Error, BookingApprovalPayload>({
    mutationFn: async ({ booking_id, action }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/booking-approval/${booking_id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data)?.[0]?.[0] || "Booking action failed.");
      }
    },
    onSuccess: () => {
      toast.success("Booking action completed.");
      queryClient.invalidateQueries(["ownerBookings"]);
    },
    onError: (error) => {
      console.error("Booking Approval Error:", error);
      toast.error(error.message);
    },
  });

  // Create Report
  const createReport = useMutation<void, Error, ReportPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data)?.[0]?.[0] || "Report creation failed.");
      }
    },
    onSuccess: () => {
      toast.success("Report submitted successfully.");
    },
    onError: (error) => {
      console.error("Report Error:", error);
      toast.error(error.message);
    },
  });

  return {
    useOwnerBookings,
    bookingApproval,
    createReport,
  };
};
