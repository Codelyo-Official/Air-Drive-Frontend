// api/auth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define types for better type safety
interface SignupResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone_number: string | null;
    profile_picture: string | null;
    address: string | null;
    is_verified: boolean;
  };
  token: string;
}

interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone_number: string | null;
    profile_picture: string | null;
    address: string | null;
    is_verified: boolean;
  };
  token: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Signup Mutation
  const signUp = useMutation<SignupResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Extract first error message from any field
        const firstField = Object.keys(responseData)[0];
        const firstMessage = responseData[firstField]?.[0] || "Signup failed.";
        throw new Error(firstMessage);
      }

      return responseData;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(['user'], data.user);
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      console.error('Signup error:', error);
      toast.error(error.message);
    },
  });

  // Login Mutation - Made consistent with signup
  const login = useMutation<LoginResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg =
          typeof responseData === "object" && responseData !== null && "error" in responseData
            ? responseData.error
            : "Login failed.";
        throw new Error(errorMsg);
      }

      return responseData;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(['user'], data.user);
      toast.success("Login successful!");
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(error.message);
    }
  });

  // Logout Mutation
  const logout = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      // The API does not give a response, so just send the request and do not expect a response body
      await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    },
    onSuccess: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      queryClient.clear();
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      console.error('Logout error:', error);
      toast.error(error?.message || "Logout failed");
    }
  });

  // Helper function to get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };

  return {
    signUp,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
  };
};