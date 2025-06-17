// api/adminBooking.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AdminBooking {
  id: number;
  user: number;
  car: number;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected" | "completed";
  [key: string]: any; // For any additional fields
}

interface UpdateBookingPayload {
  booking_id: number;
  updates: Partial<AdminBooking>;
}

export const useAdminBooking = () => {
  const queryClient = useQueryClient();

  // Get all bookings (with filters)
  const useAdminBookings = (filters?: {
    status?: string;
    user_id?: string | number;
    car_id?: string | number;
    start_date?: string;
    end_date?: string;
  }) => {
    return useQuery<AdminBooking[], Error>({
      queryKey: ["adminBookings", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");
        const url = new URL(`${API_BASE_URL}/api/admin/bookings/`);

        if (filters?.status) url.searchParams.append("status", filters.status);
        if (filters?.user_id) url.searchParams.append("user_id", String(filters.user_id));
        if (filters?.car_id) url.searchParams.append("car_id", String(filters.car_id));
        if (filters?.start_date) url.searchParams.append("start_date", filters.start_date);
        if (filters?.end_date) url.searchParams.append("end_date", filters.end_date);

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

  // Update booking status or fields
  const updateBooking = useMutation<void, Error, UpdateBookingPayload>({
    mutationFn: async ({ booking_id, updates }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${booking_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to update booking.");
      }
    },
    onSuccess: () => {
      toast.success("Booking updated successfully.");
      queryClient.invalidateQueries(["adminBookings"]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Update Booking Error:", error);
    },
  });

  return {
    useAdminBookings,
    updateBooking,
  };
};
