
import type React from "react"
import { useState } from "react"
import { useUsers } from "../../api/user"

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  company: string
  website: string
  bio: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profileVisible: boolean
    showEmail: boolean
    showPhone: boolean
  }
}

interface Tab {
  id: string
  name: string
  icon: string
}

const Profile = () => {
  const { getUserProfile } = useUsers()
  const { data: profile, isLoading, error } = getUserProfile

  const [activeTab, setActiveTab] = useState<string>("personal")
  const [formData, setFormData] = useState<FormData>({
    name:
      profile?.first_name && profile?.last_name
        ? `${profile.first_name} ${profile.last_name}`
        : (profile?.username ?? ""),
    email: profile?.email ?? "",
    phone: profile?.phone_number ?? "",
    address: profile?.address ?? "",
    company: profile?.user_type === "owner" ? "Car Rental Business" : "",
    website: "",
    bio:
      profile?.user_type === "owner"
        ? "Car rental business owner managing fleet operations and customer services."
        : "",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof FormData] as object),
          [field]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log("Profile updated:", formData)
    alert("Profile updated successfully!")
  }

  const tabs: Tab[] = [
    { id: "personal", name: "Personal Info", icon: "👤" },
    { id: "business", name: "Business", icon: "🏢" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "🛡️" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 pt-8 sm:pt-12 lg:pt-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md lg:shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-6">
              <div className="relative flex-shrink-0">
                <img
                  src={
                    profile?.profile_picture ||
                    "https://img.freepik.com/free-vector/smiling-young-man-glasses_1308-174702.jpg?ga=GA1.1.60525944.1740324934&semt=ais_items_boosted&w=740"
                  }
                  alt={profile?.username}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 sm:border-4 border-white shadow-lg"
                />
                <button className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-white text-center lg:text-left flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.username}
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm lg:text-base truncate">{profile?.email}</p>
                <p className="text-amber-100 text-xs sm:text-sm mt-1 flex items-center justify-center lg:justify-start">
                  <span className="truncate">
                    {profile?.user_type === "owner" ? "Car Rental Business Owner" : "User"}
                  </span>
                  {profile?.is_verified && (
                    <span className="ml-2 inline-flex items-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-1 hidden sm:inline">Verified</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="overflow-x-auto">
              <nav className="flex px-3 sm:px-4 lg:px-6 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-2 sm:px-4 lg:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center ${
                      activeTab === tab.id
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="mr-1 sm:mr-2 text-sm sm:text-base">{tab.icon}</span>
                    <span className="hidden xs:inline sm:inline">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 lg:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "personal" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">Business Statistics</h4>
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-amber-600">248</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Cars</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">1,429</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Customers</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-green-600">$45,280</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Change Password</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Update your password to keep your account secure
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex-shrink-0">
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Two-Factor Authentication</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex-shrink-0">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Login Sessions</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your active login sessions</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex-shrink-0">
                          View Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notification Preferences</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Email Notifications</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={formData.notifications.email}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">SMS Notifications</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={formData.notifications.sms}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Push Notifications</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive push notifications in browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="notifications.push"
                          checked={formData.notifications.push}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Privacy Settings</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Profile Visibility</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="privacy.profileVisible"
                          checked={formData.privacy.profileVisible}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Show Email</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Display your email address on your profile
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="privacy.showEmail"
                          checked={formData.privacy.showEmail}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Show Phone</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Display your phone number on your profile
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          name="privacy.showPhone"
                          checked={formData.privacy.showPhone}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row justify-end pt-4 sm:pt-6 border-t border-gray-200 mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
