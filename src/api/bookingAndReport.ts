// api/bookingAndReport.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Updated interfaces based on API documentation
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

interface User {
  id: number;
  username: string;
}

interface Booking {
  id: number;
  car: Car;
  user: User;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface MyBooking {
  booking_id: number;
  car: Car;
  start_date: string;
  end_date: string;
  status: string;
  total_cost: string;
  platform_fee: string;
  owner_payout: string;
  created_at: string;
}

interface CreateBookingPayload {
  car: number;
  start_date: string;
  end_date: string;
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

interface BookingApprovalResponse {
  message: string;
}

interface ReportResponse {
  message: string;
}

export const useBookingAndReport = () => {
  const queryClient = useQueryClient();

  // Create Booking
  const createBooking = useMutation<Booking, Error, CreateBookingPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          Object.values(data)?.[0]?.[0] || "Booking creation failed."
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Booking created successfully.");
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Create Booking Error:", error);
      toast.error(error.message);
    },
  });

  // Get My Bookings
  const useMyBookings = () => {
    return useQuery<MyBooking[], Error>({
      queryKey: ["myBookings"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/my-bookings/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to fetch my bookings.");
        }

        return response.json();
      },
    });
  };

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
          throw new Error(data.detail || "Failed to fetch owner bookings.");
        }

        return response.json();
      },
    });
  };

  // Booking Approval (Approve/Reject)
  const bookingApproval = useMutation<
    BookingApprovalResponse,
    Error,
    BookingApprovalPayload
  >({
    mutationFn: async ({ booking_id, action }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_BASE_URL}/api/booking-approval/${booking_id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          Object.values(data)?.[0]?.[0] || "Booking action failed."
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Booking action completed.");
      queryClient.invalidateQueries({ queryKey: ["ownerBookings"] });
    },
    onError: (error) => {
      console.error("Booking Approval Error:", error);
      toast.error(error.message);
    },
  });

  // Create Report
  const createReport = useMutation<ReportResponse, Error, ReportPayload>({
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
        throw new Error(
          Object.values(data)?.[0]?.[0] || "Report creation failed."
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Report submitted successfully.");
    },
    onError: (error) => {
      console.error("Report Error:", error);
      toast.error(error.message);
    },
  });

  return {
    createBooking,
    useMyBookings,
    useOwnerBookings,
    bookingApproval,
    createReport,
  };
};
