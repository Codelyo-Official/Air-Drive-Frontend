import { useState } from "react"
import { useAdminRevenue } from "../../api/admin/adminRevenue"

interface RevenueData {
  period: string
  total_revenue: string
  booking_count: number
  commission_earned: string
  average_booking_value: string
  growth_rate?: number
}

interface RevenueStats {
  total_revenue: string
  total_bookings: number
  total_commission: string
  average_booking_value: string
  revenue_growth: number
  booking_growth: number
}

const Revenue = () => {
  const { useRevenueReport } = useAdminRevenue()

  // Filter states
  const [filters, setFilters] = useState({
    type: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    start_date: "",
    end_date: "",
  })

  // Fetch revenue data with current filters
  const { data: revenueData, isLoading, error, refetch } = useRevenueReport(filters)

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Clear date filters
  const clearDateFilters = () => {
    setFilters((prev) => ({
      ...prev,
      start_date: "",
      end_date: "",
    }))
  }

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  // Get growth indicator styling
  const getGrowthStyle = (value: number) => {
    if (value > 0) return "text-green-600"
    if (value < 0) return "text-red-600"
    return "text-gray-600"
  }

  // Format period label
  const formatPeriodLabel = (period: string, type: string) => {
    const date = new Date(period)
    switch (type) {
      case "daily":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "weekly":
        return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      case "monthly":
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
      case "yearly":
        return date.getFullYear().toString()
      default:
        return period
    }
  }

  // Calculate max value for chart scaling
  const getMaxRevenue = () => {
    if (!revenueData?.data) return 0
    return Math.max(...revenueData.data.map((item) => Number.parseFloat(item.total_revenue)))
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <strong>Error:</strong> {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const maxRevenue = getMaxRevenue()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Management</h1>
        <p className="text-gray-600">Track platform revenue, commission earnings, and booking performance</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearDateFilters}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Date Filters
          </button>
          {revenueData && (
            <div className="text-sm text-gray-500 flex items-center">
              Showing {revenueData.data?.length || 0} periods from {revenueData.start_date} to {revenueData.end_date}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {revenueData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(revenueData.stats.total_revenue)}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${getGrowthStyle(revenueData.stats.revenue_growth)}`}
                    >
                      {formatPercentage(revenueData.stats.revenue_growth)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {revenueData.stats.total_bookings.toLocaleString()}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${getGrowthStyle(revenueData.stats.booking_growth)}`}
                    >
                      {formatPercentage(revenueData.stats.booking_growth)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Commission Earned */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Commission Earned</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(revenueData.stats.total_commission)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Average Booking Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Booking Value</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(revenueData.stats.average_booking_value)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {revenueData?.data && revenueData.data.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="space-y-4">
            {revenueData.data.map((item, index) => {
              const revenue = Number.parseFloat(item.total_revenue)
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0

              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                    {formatPeriodLabel(item.period, revenueData.period_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(revenue)}</span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{item.booking_count} bookings</span>
                        {item.growth_rate !== undefined && (
                          <span className={getGrowthStyle(item.growth_rate)}>{formatPercentage(item.growth_rate)}</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Detailed Revenue Table */}
      {revenueData?.data && revenueData.data.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Revenue Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPeriodLabel(item.period, revenueData.period_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.total_revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.booking_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.commission_earned)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.average_booking_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.growth_rate !== undefined ? (
                        <span className={`font-medium ${getGrowthStyle(item.growth_rate)}`}>
                          {formatPercentage(item.growth_rate)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {(!revenueData?.data || revenueData.data.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No revenue data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your date range or report type to see revenue data.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Revenue
