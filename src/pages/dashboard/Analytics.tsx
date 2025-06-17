import type React from "react"
interface AnalyticsData {
  title: string
  value: string
  change: string
  period: string
  color: string
}

interface TopPerformer {
  car: string
  bookings: number
  revenue: string
}

const Analytics: React.FC = () => {
  const analyticsData: AnalyticsData[] = [
    {
      title: "Total Bookings",
      value: "2,847",
      change: "+18.2%",
      period: "vs last month",
      color: "amber",
    },
    {
      title: "Revenue Growth",
      value: "$127,450",
      change: "+24.8%",
      period: "vs last month",
      color: "blue",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      period: "vs last month",
      color: "green",
    },
    {
      title: "Fleet Utilization",
      value: "78%",
      change: "+5.2%",
      period: "vs last month",
      color: "purple",
    },
  ]

  const topPerformers: TopPerformer[] = [
    { car: "Tesla Model 3", bookings: 89, revenue: "$12,450" },
    { car: "BMW X5", bookings: 76, revenue: "$15,200" },
    { car: "Audi A4", bookings: 65, revenue: "$9,750" },
    { car: "Mercedes C-Class", bookings: 58, revenue: "$11,600" },
    { car: "Toyota Camry", bookings: 52, revenue: "$7,800" },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 lg:ml-0 ml-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-12 lg:pt-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Detailed insights into your car rental performance</p>
        </div>
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
          <select className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm sm:text-base">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
          <button className="px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {analyticsData.map((metric, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">{metric.title}</h3>
              <div className={`w-3 h-3 rounded-full bg-${metric.color}-500`}></div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-medium text-green-600">{metric.change}</span>
                <span className="text-xs sm:text-sm text-gray-500">{metric.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Revenue Trend</h3>
          <div className="h-64 sm:h-80 bg-gradient-to-t from-amber-50 to-transparent rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Revenue trend chart</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Interactive chart would be displayed here</p>
            </div>
          </div>
        </div>

        {/* Booking Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Booking Distribution</h3>
          <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Pie chart visualization</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Booking distribution by car type</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Performing Cars</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {topPerformers.map((car, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg shadow-card hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-amber-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{car.car}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{car.bookings} bookings this month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{car.revenue}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Average Rental Duration</h4>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">4.2</p>
            <p className="text-xs sm:text-sm text-gray-500">days per rental</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Customer Return Rate</h4>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">68%</p>
            <p className="text-xs sm:text-sm text-gray-500">customers return</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Average Rating</h4>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">4.8</p>
            <p className="text-xs sm:text-sm text-gray-500">out of 5 stars</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
