import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
interface AdminBooking {
  id: number
  user: number
  car: {
    id: number
    make: string
    model: string
    year: number
    color: string
    license_plate: string
    description: string
    daily_rate: string
    location: string
    latitude: number
    longitude: number
    seats: number
    transmission: string
    fuel_type: string
    status: string
    auto_approve_bookings: boolean
    features: Array<{ name: string }>
    availability: Array<{ start_date: string; end_date: string }>
    images: Array<{ id: number; image: string; is_primary: boolean }>
  }
  start_date: string
  end_date: string
  total_cost: string
  platform_fee: string
  owner_payout: string
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
  updated_at: string
}

interface UpdateBookingPayload {
  booking_id: number
  updates: {
    status?: "pending" | "approved" | "rejected" | "completed"
    pickup_location?: string
    dropoff_location?: string
    notes?: string
    total_amount?: string
  }
}

interface UpdateBookingResponse {
  id: number
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  car: {
    id: number
    make: string
    model: string
    year: number
    license_plate: string
    daily_rate: string
  }
  start_date: string
  end_date: string
  total_amount: string
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
  updated_at: string
  pickup_location?: string
  dropoff_location?: string
  notes?: string
}

export const useAdminBookings = () => {
  const queryClient = useQueryClient()

  // Fetch all bookings with optional filters
  const useAdminBookingsList = (filters?: {
    status?: string
    user_id?: number
    car_id?: number
    start_date?: string
    end_date?: string
  }) => {
    return useQuery<AdminBooking[], Error>({
      queryKey: ["adminBookings", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const url = new URL(`${API_BASE_URL}/api/admin/bookings/`)
        if (filters?.status) url.searchParams.append("status", filters.status)
        if (filters?.user_id) url.searchParams.append("user_id", String(filters.user_id))
        if (filters?.car_id) url.searchParams.append("car_id", String(filters.car_id))
        if (filters?.start_date) url.searchParams.append("start_date", filters.start_date)
        if (filters?.end_date) url.searchParams.append("end_date", filters.end_date)

        console.log("Fetching bookings from:", url.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Fetch bookings error:", response.status, errorData)
          throw new Error(errorData.detail || `Failed to fetch bookings. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Bookings fetched successfully:", data)
        return data
      },
    })
  }

  // Update booking - using PUT method as specified in backend
  const updateBooking = useMutation<UpdateBookingResponse, Error, UpdateBookingPayload>({
    mutationFn: async ({ booking_id, updates }) => {
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

      console.log("Updating booking:", booking_id, "with cleaned updates:", cleanUpdates)

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${booking_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(cleanUpdates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update booking error:", response.status, errorData)

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
          throw new Error("You don't have permission to update this booking")
        } else if (response.status === 404) {
          throw new Error("Booking not found")
        } else {
          throw new Error(errorData.detail || `Failed to update booking. Status: ${response.status}`)
        }
      }

      const data = await response.json()
      console.log("Booking updated successfully:", data)
      return data
    },
    onSuccess: () => {
      toast.success("Booking updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] })
    },
    onError: (error) => {
      console.error("Update Booking Error:", error)
      toast.error(error.message)
    },
  })

  return {
    useAdminBookingsList,
    updateBooking,
  }
}
