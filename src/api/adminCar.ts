// api/adminCar.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AdminCar {
  id: number;
  make: string;
  model: string;
  license_plate: string;
  owner: number;
  status: string; // "pending", "available", or "rejected"
  [key: string]: any; // For other optional fields
}

interface UpdateCarPayload {
  car_id: number;
  updates: Partial<AdminCar>;
}

export const useAdminCar = () => {
  const queryClient = useQueryClient();

  // Fetch all cars with optional filters
  const useAdminCars = (filters?: {
    status?: string;
    owner_id?: string | number;
    search?: string;
  }) => {
    return useQuery<AdminCar[], Error>({
      queryKey: ["adminCars", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");
        const url = new URL(`${API_BASE_URL}/api/admin/cars/`);

        if (filters?.status) url.searchParams.append("status", filters.status);
        if (filters?.owner_id) url.searchParams.append("owner_id", String(filters.owner_id));
        if (filters?.search) url.searchParams.append("search", filters.search);

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to fetch admin cars.");
        }

        return response.json();
      },
    });
  };

  // Update car status or other fields
  const updateCar = useMutation<void, Error, UpdateCarPayload>({
    mutationFn: async ({ car_id, updates }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to update car.");
      }
    },
    onSuccess: () => {
      toast.success("Car updated successfully.");
      queryClient.invalidateQueries(["adminCars"]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Update Car Error:", error);
    },
  });

  // Delete car
  const deleteCar = useMutation<void, Error, number>({
    mutationFn: async (car_id) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/cars/${car_id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete car.");
      }
    },
    onSuccess: () => {
      toast.success("Car deleted successfully.");
      queryClient.invalidateQueries(["adminCars"]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Delete Car Error:", error);
    },
  });

  return {
    useAdminCars,
    updateCar,
    deleteCar,
  };
};
