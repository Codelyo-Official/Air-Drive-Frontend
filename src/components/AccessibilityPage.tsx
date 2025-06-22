import type React from "react"

const AccessibilityPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                Air Drive is committed to ensuring digital accessibility for people with disabilities. We are
                continually improving the user experience for everyone and applying the relevant accessibility standards
                to ensure we provide equal access to all of our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Standards</h2>
              <p className="text-gray-600 mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These
                guidelines explain how to make web content more accessible for people with disabilities and
                user-friendly for everyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Keyboard Navigation</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Full keyboard accessibility</li>
                    <li>Logical tab order</li>
                    <li>Visible focus indicators</li>
                    <li>Skip navigation links</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Visual Design</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>High contrast color schemes</li>
                    <li>Scalable text and images</li>
                    <li>Clear visual hierarchy</li>
                    <li>Consistent navigation</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Screen Reader Support</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Semantic HTML markup</li>
                    <li>Alternative text for images</li>
                    <li>Descriptive link text</li>
                    <li>ARIA labels and roles</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">User Control</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Adjustable time limits</li>
                    <li>Pause/stop animations</li>
                    <li>Customizable preferences</li>
                    <li>Multiple input methods</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assistive Technologies</h2>
              <p className="text-gray-600 mb-4">
                Our website is designed to be compatible with assistive technologies, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Voice recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Switch navigation devices</li>
                <li>Magnification software</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>
              <p className="text-gray-600 mb-4">
                While we strive for full accessibility, we acknowledge that some areas may still need improvement:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Some third-party content may not be fully accessible</li>
                <li>Complex interactive maps may have limited accessibility features</li>
                <li>Some PDF documents may not be fully screen reader compatible</li>
              </ul>
              <p className="text-gray-600 mt-4">
                We are actively working to address these limitations and improve accessibility across all areas of our
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Testing</h2>
              <p className="text-gray-600 mb-4">We regularly test our website using:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with assistive technologies</li>
                <li>User testing with people with disabilities</li>
                <li>Regular accessibility audits by third-party experts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback and Support</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  We welcome your feedback on the accessibility of Air Drive. If you encounter any accessibility
                  barriers or have suggestions for improvement, please let us know:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:accessibility@airdrive.com" className="text-amber-600 hover:text-amber-700">
                      accessibility@airdrive.com
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Response Time:</strong> We aim to respond to accessibility feedback within 2 business days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h2>
              <p className="text-gray-600 mb-4">Accessibility is an ongoing effort. We are committed to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Regular accessibility training for our development team</li>
                <li>Incorporating accessibility considerations into our design process</li>
                <li>Staying updated with the latest accessibility standards and best practices</li>
                <li>Continuously monitoring and improving our accessibility features</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityPage
