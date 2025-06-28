// api/carManagement.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  description: string;
  daily_rate: string;
  location: string;
  latitude: number;
  longitude: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  status: string;
  auto_approve_bookings: boolean;
  image: string;
  availability: Array<{
    start_date: string;
    end_date: string;
  }>;
  features: string[];
}

interface CarImage {
  image: string;
  is_primary: boolean;
}

interface CarFeature {
  name: string;
}

interface CarAvailability {
  start_date: string; 
  end_date: string; 
}

interface CreateCarPayload {
  owner: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  description: string;
  daily_rate: number;
  location: string;
  latitude: number;
  longitude: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  status: string;
  auto_approve_bookings: boolean;
  images: CarImage[];
  features: CarFeature[];
  availability: CarAvailability[];
}

interface CreateCarResponse {
  message: string;
}

export const useCar = () => {
  const queryClient = useQueryClient();

  // Create Car with all nested data
  const createCar = useMutation<CreateCarResponse, Error, CreateCarPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data)?.[0]?.[0] || "Car creation failed.";
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Car created successfully!");
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] });
    },
    onError: (error) => {
      console.error("Create Car Error:", error);
      toast.error(error.message);
    },
  });

  // Get Owner Cars
  const useOwnerCars = () => {
    return useQuery<Car[], Error>({
      queryKey: ["ownerCars"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/owner-cars/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data?.detail || "Failed to fetch cars.";
          throw new Error(errorMsg);
        }

        return response.json();
      },
    });
  };

  // Get Available Cars
  const useAvailableCars = () => {
    return useQuery<Car[], Error>({
      queryKey: ["availableCars"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/available-cars/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data?.detail || "Failed to fetch available cars.";
          throw new Error(errorMsg);
        }

        return response.json();
      },
    });
  };

  return {
    createCar,
    useOwnerCars,
    useAvailableCars,
  };
};

// Helper function to create the payload structure
export const createCarPayload = (carData: {
  owner: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  description: string;
  daily_rate: number;
  location: string;
  latitude: number;
  longitude: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  status?: string;
  auto_approve_bookings?: boolean;
  images?: CarImage[];
  features?: CarFeature[];
  availability?: CarAvailability[];
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
  };
};