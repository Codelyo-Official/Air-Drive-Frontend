import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UserProfile {
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
}

export const useUsers = () => {
  const getUserProfile = useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      // if (!token) throw new Error("No auth token found");

      // const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Token ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch user profile");
      // }

      // const data = await response.json();
      // return data;
      return {
        id: 1,
        username: "john_doe",
      }
    },
    retry: false,
  });

  // Handle errors outside of the query options
  if (getUserProfile.error) {
    console.error("Profile fetch error:", getUserProfile.error);
    toast.error(getUserProfile.error.message);
  }

  return {
    getUserProfile,
  };
};
