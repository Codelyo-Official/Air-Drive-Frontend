import type React from "react"

const CookiePage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us
                provide you with a better experience by remembering your preferences and analyzing how you use our
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Essential Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are necessary for the website to function properly. They enable core functionality
                    such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Authentication and login status</li>
                    <li>Shopping cart and booking information</li>
                    <li>Security and fraud prevention</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Performance Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting
                    information anonymously.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Page load times and performance metrics</li>
                    <li>Error tracking and debugging</li>
                    <li>Usage analytics and statistics</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Functional Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your
                    preferences and settings.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Language and region preferences</li>
                    <li>User interface customizations</li>
                    <li>Remember me functionality</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Marketing Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are used to deliver relevant advertisements and track the effectiveness of our
                    marketing campaigns.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Targeted advertising</li>
                    <li>Social media integration</li>
                    <li>Campaign performance tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">We may also use third-party services that set cookies on our behalf:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> For website analytics and performance monitoring
                </li>
                <li>
                  <strong>Payment Processors:</strong> For secure payment processing
                </li>
                <li>
                  <strong>Social Media Platforms:</strong> For social sharing and login functionality
                </li>
                <li>
                  <strong>Customer Support:</strong> For chat and support services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <div className="text-gray-600 space-y-4">
                <p>You can control and manage cookies in several ways:</p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Browser Settings</h3>
                  <p className="text-amber-700">
                    Most browsers allow you to view, delete, and block cookies. Check your browser's help section for
                    specific instructions.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Cookie Consent</h3>
                  <p className="text-blue-700">
                    You can update your cookie preferences at any time using our cookie consent banner or by contacting
                    us directly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-600 mb-4">
                While you can disable cookies, please note that this may affect your experience on our website:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Some features may not work properly</li>
                <li>You may need to re-enter information frequently</li>
                <li>Personalized content and recommendations may not be available</li>
                <li>Website performance may be reduced</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time. We will notify you of any significant changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@airdrive.com" className="text-amber-600 hover:text-amber-700">
                  privacy@airdrive.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePage
