import type React from "react"

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Air Drive</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-6">
              Air Drive is revolutionizing the car rental industry by connecting car owners with people who need
              reliable transportation.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  To make car sharing accessible, affordable, and convenient for everyone while helping car owners
                  monetize their unused vehicles.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600">
                  A world where transportation is shared, sustainable, and available to all, reducing the need for car
                  ownership while maximizing vehicle utilization.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Air Drive?</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Verified car owners and renters for your safety
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Comprehensive insurance coverage
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  24/7 customer support
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Competitive pricing and flexible rental periods
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
