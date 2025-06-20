import { useState, useEffect } from "react"
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

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.search, refetch])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          <strong>Error:</strong> {error.message}
        </div>
        <button onClick={() => refetch()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage users, their verification status, and permissions</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Username, email, name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User Type */}
          <div>
            <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              id="user_type"
              value={filters.user_type}
              onChange={(e) => handleFilterChange("user_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="owner">Owner</option>
              <option value="regular">Regular</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label htmlFor="is_verified" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Status
            </label>
            <select
              id="is_verified"
              value={filters.is_verified === undefined ? "" : String(filters.is_verified)}
              onChange={(e) =>
                handleFilterChange("is_verified", e.target.value === "" ? undefined : e.target.value === "true")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {/* Suspension Status */}
          <div>
            <label htmlFor="is_suspended" className="block text-sm font-medium text-gray-700 mb-1">
              Suspension Status
            </label>
            <select
              id="is_suspended"
              value={filters.is_suspended === undefined ? "" : String(filters.is_suspended)}
              onChange={(e) =>
                handleFilterChange("is_suspended", e.target.value === "" ? undefined : e.target.value === "true")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Suspended</option>
              <option value="false">Active</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
          <div className="text-sm text-gray-500 flex items-center">{users?.length || 0} users found</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
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
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <select
                        value={editForm.user_type}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, user_type: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="owner">Owner</option>
                        <option value="regular">Regular</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.user_type === "owner"
                            ? "bg-purple-100 text-purple-800"
                            : user.user_type === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.user_type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {editingUser?.id === user.id ? (
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_verified}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, is_verified: e.target.checked }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Verified</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_suspended}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, is_suspended: e.target.checked }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Suspended</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.is_verified ? "Verified" : "Unverified"}
                          </span>
                          <br />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.is_suspended ? "Suspended" : "Active"}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser?.id === user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveUser}
                          disabled={updateUser.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {updateUser.isPending ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(user)} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!users || users.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete User</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <strong>{showDeleteModal.username}</strong>? This action cannot be
                  undone.
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
  )
}

export default UserManagement
