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
  updates: {
    status?: "pending" | "available" | "rejected"
    make?: string
    model?: string
    year?: number
    color?: string
    license_plate?: string
    description?: string
    daily_rate?: string
    location?: string
    latitude?: number
    longitude?: number
    seats?: number
    transmission?: string
    fuel_type?: string
    auto_approve_bookings?: boolean
  }
}

interface UpdateCarResponse {
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

        if (!token) {
          throw new Error("No authentication token found")
        }

        const url = new URL(`${API_BASE_URL}/api/admin/cars/`)
        if (filters?.status) url.searchParams.append("status", filters.status)
        if (filters?.owner_id) url.searchParams.append("owner_id", String(filters.owner_id))
        if (filters?.search) url.searchParams.append("search", filters.search)

        console.log("Fetching cars from:", url.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Fetch cars error:", response.status, errorData)
          throw new Error(errorData.detail || `Failed to fetch cars. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Cars fetched successfully:", data)
        return data
      },
    })
  }

  // Update car - using PATCH method as specified in backend
  const updateCar = useMutation<UpdateCarResponse, Error, UpdateCarPayload>({
    mutationFn: async ({ car_id, updates }) => {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Clean up the updates object - remove undefined values and ensure proper types
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Convert string numbers to actual numbers for numeric fields
          if (["year", "seats", "latitude", "longitude"].includes(key) && typeof value === "string") {
            acc[key] = Number(value)
          } else if (key === "auto_approve_bookings" && typeof value === "string") {
            acc[key] = value === "true" || value === true
          } else {
            acc[key] = value
          }
        }
        return acc
      }, {} as Record<string, any>)

      console.log("Updating car:", car_id, "with cleaned updates:", cleanUpdates)

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(cleanUpdates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update car error:", response.status, errorData)

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
          throw new Error("You don't have permission to update this car")
        } else if (response.status === 404) {
          throw new Error("Car not found")
        } else {
          throw new Error(errorData.detail || `Failed to update car. Status: ${response.status}`)
        }
      }

      const data = await response.json()
      console.log("Car updated successfully:", data)
      return data
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

  // Delete car - improved error handling
  const deleteCar = useMutation<void, Error, number>({
    mutationFn: async (car_id) => {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Attempting to delete car:", car_id)

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Delete car error:", response.status, response.statusText, errorData)

        if (response.status === 405) {
          throw new Error(
            "Delete operation not supported. The DELETE method is not allowed on this endpoint. Please contact your backend developer to enable the DELETE method.",
          )
        } else if (response.status === 403) {
          throw new Error("You don't have permission to delete this car")
        } else if (response.status === 404) {
          throw new Error("Car not found or already deleted")
        } else {
          throw new Error(errorData.detail || `Failed to delete car. Status: ${response.status}`)
        }
      }

      console.log("Car deleted successfully")
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
