import type React from "react"

const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="text-gray-600 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Driver's license information</li>
                  <li>Payment and billing information</li>
                  <li>Profile photos and vehicle photos</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800">Usage Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Location data (with your permission)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Communication records</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="text-gray-600">
                <p className="mb-3">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Facilitate car rentals and bookings</li>
                  <li>Process payments and prevent fraud</li>
                  <li>Provide customer support</li>
                  <li>Send important service updates</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal requirements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">We share your information only as necessary to provide our services:</p>
              <div className="text-gray-600">
                <ul className="list-disc pl-6 space-y-2">
                  <li>With other users to facilitate rentals (limited contact information)</li>
                  <li>With service providers (payment processors, insurance companies)</li>
                  <li>When required by law or to protect safety</li>
                  <li>In case of business transfers or mergers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures to protect your personal information, including
                encryption, secure servers, and regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <div className="text-gray-600">
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>File complaints with data protection authorities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibent text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to improve your experience, analyze usage, and provide
                personalized content. You can manage cookie preferences in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for users under 18 years of age. We do not knowingly collect personal
                information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-600">
                For privacy-related questions or requests, contact us at{" "}
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

export default PrivacyPage
