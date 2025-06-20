import { useAdminBookings } from "../../api/admin/adminBooking"
import { useAdminCars } from "../../api/admin/adminCarApproval"
import { useAdminReports } from "../../api/admin/adminReport"
import { useAdminRevenue } from "../../api/admin/adminRevenue"
import { useAdmin } from "../../api/admin/adminUser"

const AdminDashboard = () => {
  // Fetch data from all management systems
  const { useAdminUsers } = useAdmin()
  const { useAdminCarsList } = useAdminCars()
  const { useAdminBookingsList } = useAdminBookings()
  const { useAdminReportsList } = useAdminReports()
  const { useRevenueReport } = useAdminRevenue()

  // Fetch overview data
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: cars, isLoading: carsLoading } = useAdminCarsList()
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookingsList()
  const { data: reports, isLoading: reportsLoading } = useAdminReportsList()
  const { data: revenueData, isLoading: revenueLoading } = useRevenueReport({ type: "monthly" })

  // Calculate key metrics
  const totalUsers = users?.length || 0
  const verifiedUsers = users?.filter((user) => user.is_verified).length || 0
  const suspendedUsers = users?.filter((user) => user.is_suspended).length || 0

  const totalCars = cars?.length || 0
  const availableCars = cars?.filter((car) => car.status === "available").length || 0
  const pendingCars = cars?.filter((car) => car.status === "pending").length || 0

  const totalBookings = bookings?.length || 0
  const pendingBookings = bookings?.filter((booking) => booking.status === "pending").length || 0
  const approvedBookings = bookings?.filter((booking) => booking.status === "approved").length || 0

  const totalReports = reports?.length || 0
  const pendingReports = reports?.filter((report) => report.status === "pending").length || 0

  const monthlyRevenue = revenueData?.stats?.total_revenue || "0"
  const monthlyBookings = revenueData?.stats?.total_bookings || 0

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  // Get current date info
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const isLoading = usersLoading || carsLoading || bookingsLoading || reportsLoading || revenueLoading

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin panel. Here's an overview of your platform's performance and key metrics.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-green-100 truncate">Monthly Revenue</dt>
                    <dd className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</dd>
                    <dd className="text-sm text-green-100">{currentMonth}</dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-100 truncate">Total Users</dt>
                    <dd className="text-2xl font-bold">{totalUsers.toLocaleString()}</dd>
                    <dd className="text-sm text-blue-100">{verifiedUsers} verified</dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Cars Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-purple-100 truncate">Total Cars</dt>
                    <dd className="text-2xl font-bold">{totalCars.toLocaleString()}</dd>
                    <dd className="text-sm text-purple-100">{availableCars} available</dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Bookings Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-orange-100 truncate">Monthly Bookings</dt>
                    <dd className="text-2xl font-bold">{monthlyBookings.toLocaleString()}</dd>
                    <dd className="text-sm text-orange-100">{pendingBookings} pending</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Manage Users</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Approve Cars</span>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingCars}
                  </span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Review Bookings</span>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingBookings}
                  </span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">View Revenue</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
              <div className="space-y-3">
                {pendingReports > 0 && (
                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {pendingReports} pending report{pendingReports !== 1 ? "s" : ""} need review
                      </p>
                      <p className="text-xs text-red-600">Review and take action on user/car reports</p>
                    </div>
                  </div>
                )}

                {pendingCars > 0 && (
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        {pendingCars} car{pendingCars !== 1 ? "s" : ""} awaiting approval
                      </p>
                      <p className="text-xs text-yellow-600">Review and approve new car listings</p>
                    </div>
                  </div>
                )}

                {suspendedUsers > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-800">
                        {suspendedUsers} suspended user{suspendedUsers !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-orange-600">Monitor suspended accounts</p>
                    </div>
                  </div>
                )}

                {pendingReports === 0 && pendingCars === 0 && suspendedUsers === 0 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">All systems running smoothly</p>
                      <p className="text-xs text-green-600">No urgent actions required</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium text-gray-900">{totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Users</span>
                  <span className="text-sm font-medium text-green-600">{verifiedUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Suspended Users</span>
                  <span className="text-sm font-medium text-red-600">{suspendedUsers}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Verification Rate</span>
                    <span>{totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Cars</span>
                  <span className="text-sm font-medium text-gray-900">{totalCars}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-medium text-green-600">{availableCars}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Approval</span>
                  <span className="text-sm font-medium text-yellow-600">{pendingCars}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Approval Rate</span>
                    <span>{totalCars > 0 ? Math.round((availableCars / totalCars) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${totalCars > 0 ? (availableCars / totalCars) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="text-sm font-medium text-gray-900">{totalBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-green-600">{approvedBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">{pendingBookings}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Approval Rate</span>
                    <span>{totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${totalBookings > 0 ? (approvedBookings / totalBookings) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
