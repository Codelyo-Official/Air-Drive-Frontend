"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Crown,
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Mail,
  MoreVertical,
} from "lucide-react"
import { useAdmin } from "../../api/admin/adminUser"

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

const UserManagement = () => {
  const { useAdminUsers, updateUser, deleteUser } = useAdmin()

  // Filter states
  const [filters, setFilters] = useState({
    user_type: "",
    is_verified: undefined as boolean | undefined,
    is_suspended: undefined as boolean | undefined,
    search: "",
  })

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"name" | "email" | "type" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // UI states
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState({
    user_type: "",
    is_verified: false,
    is_suspended: false,
  })

  // Fetch users with current filters
  const { data: users, isLoading, error, refetch } = useAdminUsers(filters)

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return []

    const sorted = [...users].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          break
        case "email":
          comparison = a.email.localeCompare(b.email)
          break
        case "type":
          comparison = a.user_type.localeCompare(b.user_type)
          break
        case "status":
          comparison = Number(a.is_verified) - Number(b.is_verified)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [users, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage)

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
    setCurrentPage(1)
  }

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.search, refetch])

  // Handle sorting
  const handleSort = (field: "name" | "email" | "type" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Start editing user
  const startEdit = (user: AdminUser) => {
    setEditingUser(user)
    setEditForm({
      user_type: user.user_type,
      is_verified: user.is_verified,
      is_suspended: user.is_suspended,
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({
      user_type: "",
      is_verified: false,
      is_suspended: false,
    })
  }

  // Save user changes
  const saveUser = () => {
    if (!editingUser) return

    updateUser.mutate(
      {
        user_id: editingUser.id,
        updates: editForm,
      },
      {
        onSuccess: () => {
          cancelEdit()
        },
      },
    )
  }

  // Handle delete user
  const handleDelete = (user: AdminUser) => {
    setShowDeleteModal(user)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (!showDeleteModal) return

    deleteUser.mutate(showDeleteModal.id, {
      onSuccess: () => {
        setShowDeleteModal(null)
      },
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      user_type: "",
      is_verified: undefined,
      is_suspended: undefined,
      search: "",
    })
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "admin":
        return <Crown className="h-4 w-4 text-red-500" />
      case "owner":
        return <Shield className="h-4 w-4 text-purple-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "owner":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-lg text-gray-700">Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <div className="text-red-800 font-semibold mb-2">Error: {error.message}</div>
            <button
              onClick={() => refetch()}
              className="mt-2 bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users, their verification status, and permissions</p>
        </div>

        {/* Stats Cards */}
        {users && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-amber-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Verified</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter((user) => user.is_verified).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Suspended</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter((user) => user.is_suspended).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Car Owners</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter((user) => user.user_type === "owner").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by username, email, or name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={filters.user_type}
                onChange={(e) => handleFilterChange("user_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Types</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            {/* Verification Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                value={filters.is_verified === undefined ? "" : String(filters.is_verified)}
                onChange={(e) =>
                  handleFilterChange("is_verified", e.target.value === "" ? undefined : e.target.value === "true")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>

            {/* Suspension Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <select
                value={filters.is_suspended === undefined ? "" : String(filters.is_suspended)}
                onChange={(e) =>
                  handleFilterChange("is_suspended", e.target.value === "" ? undefined : e.target.value === "true")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All</option>
                <option value="false">Active</option>
                <option value="true">Suspended</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
            <div className="text-sm text-gray-600">
              Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("name")}
                  >
                    User {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("type")}
                  >
                    Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("status")}
                  >
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-800">
                              {user.first_name?.[0]}
                              {user.last_name?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editForm.user_type}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, user_type: e.target.value }))}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                          <option value="regular">Regular</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          {getUserTypeIcon(user.user_type)}
                          <span
                            className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.user_type)}`}
                          >
                            {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_verified}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, is_verified: e.target.checked }))}
                              className="mr-2 text-amber-500 focus:ring-amber-500"
                            />
                            <span className="text-sm">Verified</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_suspended}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, is_suspended: e.target.checked }))}
                              className="mr-2 text-amber-500 focus:ring-amber-500"
                            />
                            <span className="text-sm">Suspended</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {user.is_verified ? (
                              <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                            )}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.is_verified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {user.is_suspended ? (
                              <UserX className="h-4 w-4 text-red-500 mr-2" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.is_suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.is_suspended ? "Suspended" : "Active"}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveUser}
                            disabled={updateUser.isPending}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {updateUser.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="More options">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? "bg-amber-500 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!users || filteredAndSortedUsers.length === 0) && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {users && users.length > 0 ? "No users found" : "No users available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {users && users.length > 0
                ? "Try adjusting your search or filter criteria"
                : "Users will appear here once they register"}
            </p>
            {users && users.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete User</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <strong>
                      {showDeleteModal.first_name} {showDeleteModal.last_name} (@{showDeleteModal.username})
                    </strong>
                    ? This action cannot be undone.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={confirmDelete}
                    disabled={deleteUser.isPending}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                  >
                    {deleteUser.isPending ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
