import type React from "react"

const TermsPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Air Drive's services, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-600 mb-4">
                Air Drive is a peer-to-peer car sharing platform that connects car owners with individuals seeking to
                rent vehicles. Our platform facilitates these connections but does not own or operate the vehicles
                listed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <div className="text-gray-600 space-y-3">
                <h3 className="text-lg font-medium text-gray-800">For Car Owners:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ensure your vehicle is properly maintained and safe for operation</li>
                  <li>Maintain valid insurance coverage</li>
                  <li>Provide accurate vehicle descriptions and photos</li>
                  <li>Comply with all local laws and regulations</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mt-6">For Renters:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Possess a valid driver's license</li>
                  <li>Use vehicles responsibly and return them in the same condition</li>
                  <li>Report any incidents or damages immediately</li>
                  <li>Pay all fees and charges on time</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment and Fees</h2>
              <p className="text-gray-600 mb-4">
                Air Drive charges service fees for facilitating rentals. All fees are clearly disclosed before booking
                confirmation. Payment processing is handled through secure third-party providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Insurance and Liability</h2>
              <p className="text-gray-600 mb-4">
                While Air Drive provides insurance coverage during active rentals, users are responsible for
                understanding their coverage limits and maintaining appropriate personal insurance policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Uses</h2>
              <div className="text-gray-600">
                <p className="mb-3">You may not use our service for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Illegal activities or purposes</li>
                  <li>Commercial transportation services (rideshare, delivery, etc.)</li>
                  <li>Racing or off-road driving</li>
                  <li>Transporting hazardous materials</li>
                  <li>Subletting or transferring rental agreements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
              <p className="text-gray-600 mb-4">
                Air Drive reserves the right to terminate or suspend accounts that violate these terms or engage in
                fraudulent or harmful behavior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@airdrive.com" className="text-amber-600 hover:text-amber-700">
                  legal@airdrive.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
