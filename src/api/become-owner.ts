import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BecomeOwnerResponse {
  detail: string;
}

export const useBecomeOwner = () => {
  const becomeOwner = useMutation<BecomeOwnerResponse, Error, void>({
    mutationFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_BASE_URL}/api/become-owner/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.detail || "Failed to become owner.";
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.detail || "User type updated to owner successfully.");
      // Logout user after success
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Become Owner Error:", error);
      toast.error(error.message);
    },
  });

  return { becomeOwner };
};
