import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface AdminCar {
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
  status: "pending" | "available" | "rejected"
  auto_approve_bookings: boolean
  owner?: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

interface UpdateCarPayload {
  car_id: number
  updates: Partial<Pick<AdminCar, "status">> & Record<string, any>
}

export const useAdminCars = () => {
  const queryClient = useQueryClient()

  // Fetch all cars with optional filters
  const useAdminCarsList = (filters?: {
    status?: string
    owner_id?: number
    search?: string
  }) => {
    return useQuery<AdminCar[], Error>({
      queryKey: ["adminCars", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")

        const url = new URL(`${API_BASE_URL}/api/admin/cars/`)
        if (filters?.status) url.searchParams.append("status", filters.status)
        if (filters?.owner_id) url.searchParams.append("owner_id", String(filters.owner_id))
        if (filters?.search) url.searchParams.append("search", filters.search)

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail || "Failed to fetch cars.")
        }

        return response.json()
      },
    })
  }

  // Update car status and other fields
  const updateCar = useMutation<AdminCar, Error, UpdateCarPayload>({
    mutationFn: async ({ car_id, updates }) => {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to update car.")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success("Car updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminCars"] })
    },
    onError: (error) => {
      console.error("Update Car Error:", error)
      toast.error(error.message)
    },
  })

  // Delete car
  const deleteCar = useMutation<void, Error, number>({
    mutationFn: async (car_id) => {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Failed to delete car.")
      }
    },
    onSuccess: () => {
      toast.success("Car deleted successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminCars"] })
    },
    onError: (error) => {
      console.error("Delete Car Error:", error)
      toast.error(error.message)
    },
  })

  return {
    useAdminCarsList,
    updateCar,
    deleteCar,
  }
}
