import { Camera, Edit2, Mail, MapPin, Phone, Save, Shield, User, X } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useAuth } from "../api/auth"

const ProfilePage: React.FC = () => {
  const { getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user || {})

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No User Data Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedUser(user)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser(user)
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    // For now, we'll just update localStorage
    localStorage.setItem("user", JSON.stringify(editedUser))
    setIsEditing(false)
    // You might want to show a success toast here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: typeof editedUser) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "owner":
        return "bg-amber-100 text-amber-800"
      case "regular":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "admin":
        return "Administrator"
      case "owner":
        return "Car Owner"
      case "regular":
        return "Regular User"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 mb-2">@{user.username}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUserTypeColor(user.user_type)}`}>
                    {getUserTypeLabel(user.user_type)}
                  </span>
                  {user.is_verified && (
                    <div className="flex items-center text-green-600">
                      <Shield size={16} className="mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editedUser.first_name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.first_name || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editedUser.last_name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.last_name || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.username}</p>
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">#{user.id}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-1" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={editedUser.phone_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {user.phone_number || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={16} className="inline mr-1" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedUser.address || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user.address || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Status</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${getUserTypeColor(user.user_type)}`}
                >
                  <User size={24} />
                </div>
                <h4 className="font-semibold text-gray-900">Account Type</h4>
                <p className="text-sm text-gray-600">{getUserTypeLabel(user.user_type)}</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${user.is_verified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  <Shield size={24} />
                </div>
                <h4 className="font-semibold text-gray-900">Verification Status</h4>
                <p className={`text-sm ${user.is_verified ? "text-green-600" : "text-red-600"}`}>
                  {user.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <Mail size={24} />
                </div>
                <h4 className="font-semibold text-gray-900">Profile Completion</h4>
                <p className="text-sm text-gray-600">
                  {Math.round(
                    (Object.values(user).filter((value) => value !== null && value !== "").length /
                      Object.keys(user).length) *
                    100,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h3>

            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                Change Password
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Download Data
              </button>
              {!user.is_verified && (
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                  Verify Account
                </button>
              )}
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Delete Account
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
