// api/carManagement.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Car {
  id: number;
  name: string;
  model: string;
  brand: string;
  year: number;
  // Add more fields if needed
}

interface CreateCarResponse {
  id: number;
  // Add other car fields you receive in response
}

interface CarImagePayload {
  car: number;
  image: File;
  is_primary: boolean;
}

interface CarFeaturePayload {
  car: number;
  name: string;
}

interface CarAvailabilityPayload {
  car: number;
  start_date: string;
  end_date: string;
}

export const useCar = () => {
  const queryClient = useQueryClient();

  // Create Car
  const createCar = useMutation<CreateCarResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/car-create/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
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
      queryClient.invalidateQueries(["ownerCars"]);
    },
    onError: (error) => {
      console.error("Create Car Error:", error);
      toast.error(error.message);
    },
  });

  // Add Car Image
  const addCarImage = useMutation<void, Error, FormData>({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/car-images/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = Object.values(data)?.[0]?.[0] || "Image upload failed.";
        throw new Error(errorMsg);
      }
    },
    onSuccess: () => {
      toast.success("Car image added successfully!");
    },
    onError: (error) => {
      console.error("Add Car Image Error:", error);
      toast.error(error.message);
    },
  });

  // Add Car Feature
  const addCarFeature = useMutation<void, Error, CarFeaturePayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/car-features/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = Object.values(data)?.[0]?.[0] || "Adding feature failed.";
        throw new Error(errorMsg);
      }
    },
    onSuccess: () => {
      toast.success("Car feature added successfully!");
    },
    onError: (error) => {
      console.error("Add Car Feature Error:", error);
      toast.error(error.message);
    },
  });

  // Add Car Availability
  const addCarAvailability = useMutation<void, Error, CarAvailabilityPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/car-availability/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = Object.values(data)?.[0]?.[0] || "Adding availability failed.";
        throw new Error(errorMsg);
      }
    },
    onSuccess: () => {
      toast.success("Car availability added!");
    },
    onError: (error) => {
      console.error("Add Car Availability Error:", error);
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

  return {
    createCar,
    addCarImage,
    addCarFeature,
    addCarAvailability,
    useOwnerCars,
  };
};
