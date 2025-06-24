import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface AdminUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  is_verified: boolean
  is_suspended: boolean
}

interface UpdateUserPayload {
  user_id: number
  updates: Partial<Pick<AdminUser, "is_verified" | "is_suspended" | "user_type">> & Record<string, any>
}

interface UpdateUserResponse {
  message: string
  user: AdminUser
}

interface DeleteUserResponse {
  message: string
}

interface CreateSupportUserPayload {
  username: string
  email: string
  password: string
}

interface CreateSupportUserResponse {
  message: string
  user: {
    id: number
    username: string
    email: string
    user_type: string
  }
}

export const useAdmin = () => {
  const queryClient = useQueryClient()

  // Fetch all users with optional filters
  const useAdminUsers = (filters?: {
    user_type?: string
    is_verified?: boolean
    is_suspended?: boolean
    search?: string
  }) => {
    return useQuery<AdminUser[], Error>({
      queryKey: ["adminUsers", filters],
      queryFn: async () => {
        const token = localStorage.getItem("authToken")

        const url = new URL(`${API_BASE_URL}/api/admin/users/`)
        if (filters?.user_type) url.searchParams.append("user_type", filters.user_type)
        if (filters?.is_verified !== undefined) url.searchParams.append("is_verified", String(filters.is_verified))
        if (filters?.is_suspended !== undefined) url.searchParams.append("is_suspended", String(filters.is_suspended))
        if (filters?.search) url.searchParams.append("search", filters.search)

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail || "Failed to fetch admin users.")
        }

        return response.json()
      },
    })
  }

  // Update user info (suspension, verification, user_type, etc.)
  const updateUser = useMutation<UpdateUserResponse, Error, UpdateUserPayload>({
    mutationFn: async ({ user_id, updates }) => {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${user_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to update user.")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "User updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
    },
    onError: (error) => {
      console.error("Update User Error:", error)
      toast.error(error.message)
    },
  })

  // Delete user
  const deleteUser = useMutation<DeleteUserResponse, Error, number>({
    mutationFn: async (user_id) => {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${user_id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Failed to delete user.")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
    },
    onError: (error) => {
      console.error("Delete User Error:", error)
      toast.error(error.message)
    },
  })

  // Create support user
  const createSupportUser = useMutation<CreateSupportUserResponse, Error, CreateSupportUserPayload>({
    mutationFn: async ({ username, email, password }) => {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_BASE_URL}/api/admin/create-support-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(Object.values(data)?.[0]?.[0] || "Failed to create support user.")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "Support user created successfully.")
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
    },
    onError: (error) => {
      console.error("Create Support User Error:", error)
      toast.error(error.message)
    },
  })

  return {
    useAdminUsers,
    updateUser,
    deleteUser,
    createSupportUser,
  }
}