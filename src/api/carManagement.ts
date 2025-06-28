import type React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Car {
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
  image: string
  availability: Array<{
    start_date: string
    end_date: string
  }>
  features: string[]
}

interface CarImage {
  image: string
  is_primary: boolean
}

interface CarFeature {
  name: string
}

interface CarAvailability {
  start_date: string
  end_date: string
}

interface CreateCarPayload {
  owner: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  description: string
  daily_rate: number
  location: string
  latitude: number
  longitude: number
  seats: number
  transmission: string
  fuel_type: string
  status: string
  auto_approve_bookings: boolean
  images: File[] // Changed to File[] for FormData
  features: CarFeature[]
  availability: CarAvailability[]
}

interface CreateCarResponse {
  message: string
}

export const useCar = () => {
  const queryClient = useQueryClient()

  // Create Car with FormData format
  const createCar = useMutation<CreateCarResponse, Error, CreateCarPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken")

      // Create FormData object
      const formData = new FormData()

      // Append basic fields
      formData.append("make", payload.make)
      formData.append("model", payload.model)
      formData.append("year", payload.year.toString())
      formData.append("color", payload.color)
      formData.append("license_plate", payload.license_plate)
      formData.append("description", payload.description)
      formData.append("daily_rate", payload.daily_rate.toString())
      formData.append("location", payload.location)
      formData.append("latitude", payload.latitude.toString())
      formData.append("longitude", payload.longitude.toString())
      formData.append("seats", payload.seats.toString())
      formData.append("transmission", payload.transmission)
      formData.append("fuel_type", payload.fuel_type)
      formData.append("auto_approve_bookings", payload.auto_approve_bookings.toString())

      // Convert features to JSON string
      if (payload.features && payload.features.length > 0) {
        formData.append("features", JSON.stringify(payload.features))
      }

      // Convert availability to JSON string
      if (payload.availability && payload.availability.length > 0) {
        formData.append("availability", JSON.stringify(payload.availability))
      }

      // Append image files
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await fetch(`${API_BASE_URL}/api/create/`, {
        method: "POST",
        headers: {
          // Don't set Content-Type header - let browser set it automatically for FormData
          Authorization: `Token ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = Object.values(data)?.[0]?.[0] || "Car creation failed."
        throw new Error(errorMsg)
      }

      return data
    },
    onSuccess: () => {
      toast.success("Car created successfully!")
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] })
    },
    onError: (error) => {
      console.error("Create Car Error:", error)
      toast.error(error.message)
    },
  })

  // Get Owner Cars
  const useOwnerCars = () => {
    return useQuery<Car[], Error>({
      queryKey: ["ownerCars"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`${API_BASE_URL}/api/owner-cars/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMsg = data?.detail || "Failed to fetch cars."
          throw new Error(errorMsg)
        }

        return response.json()
      },
    })
  }

  // Get Available Cars
  const useAvailableCars = () => {
    return useQuery<Car[], Error>({
      queryKey: ["availableCars"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`${API_BASE_URL}/api/available-cars/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMsg = data?.detail || "Failed to fetch available cars."
          throw new Error(errorMsg)
        }

        return response.json()
      },
    })
  }

  return {
    createCar,
    useOwnerCars,
    useAvailableCars,
  }
}

// Updated helper function to create the payload structure
export const createCarPayload = (carData: {
  owner: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  description: string
  daily_rate: number
  location: string
  latitude: number
  longitude: number
  seats: number
  transmission: string
  fuel_type: string
  status?: string
  auto_approve_bookings?: boolean
  images?: File[] // Changed to File[]
  features?: CarFeature[]
  availability?: CarAvailability[]
}): CreateCarPayload => {
  return {
    owner: carData.owner,
    make: carData.make,
    model: carData.model,
    year: carData.year,
    color: carData.color,
    license_plate: carData.license_plate,
    description: carData.description,
    daily_rate: carData.daily_rate,
    location: carData.location,
    latitude: carData.latitude,
    longitude: carData.longitude,
    seats: carData.seats,
    transmission: carData.transmission,
    fuel_type: carData.fuel_type,
    status: carData.status || "pending_approval",
    auto_approve_bookings: carData.auto_approve_bookings || false,
    images: carData.images || [],
    features: carData.features || [],
    availability: carData.availability || [],
  }
}

// Utility function to convert file input to File objects
export const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>): File[] => {
  const files = event.target.files
  if (!files) return []

  return Array.from(files)
}

// Utility function to validate image files
export const validateImageFiles = (files: File[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`)
    }

    if (file.size > maxSize) {
      errors.push(`File ${index + 1}: File size must be less than 5MB`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
