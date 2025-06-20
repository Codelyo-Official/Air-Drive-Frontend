import {
  Calendar,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Phone,
  Shield,
  Star
} from 'lucide-react';
import React, { useState } from 'react';
import { useBecomeOwner } from '../api/become-owner';

const RentYourCarPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const { becomeOwner } = useBecomeOwner();

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="pt-16 bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Become a Car Owner Partner & Start Earning
              </h1>
              <p className="text-xl mb-8 text-amber-100">
                Rent out your car when you’re not using it and earn up to $800 every month — safely and easily.
              </p>

              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h2 className="text-lg font-semibold mb-4">How to get started:</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Create your car listing</p>
                      <p className="text-sm text-gray-600">Share your car’s details and upload photos — takes just 10 minutes.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Set your availability and rates</p>
                      <p className="text-sm text-gray-600">You choose when your car is available and how much to charge.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Get paid every month</p>
                      <p className="text-sm text-gray-600">Your earnings are deposited directly to your bank account.</p>
                    </div>
                  </div>
                </div>

                <button
                  className="mt-6 block w-full bg-amber-500 text-white text-center py-3 rounded-md font-medium hover:bg-amber-600 transition-colors disabled:opacity-60"
                  onClick={() => becomeOwner.mutate()}
                  disabled={becomeOwner.status === 'pending'}
                >
                  {becomeOwner.status === 'pending' ? 'Processing...' : 'Become a Car Owner'}
                </button>
              </div>
            </div>

            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Car owner giving keys"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Why Share Your Car Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why share your car on Air Drive?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of car owners who are already earning extra income and helping their community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn extra income</h3>
              <p className="text-gray-600">
                Make money with your car when you're not using it. The average active host earns $800 per month.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Insurance protection</h3>
              <p className="text-gray-600">
                Every trip includes up to $1M in liability insurance from Liberty Mutual and 24/7 roadside assistance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Full control</h3>
              <p className="text-gray-600">
                You decide when your car is available, how much to charge, and who can book your vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What car owners are saying</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from hosts who are already earning with Air Drive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Testimonial"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-600">Tesla Model 3 owner</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I've been sharing my Tesla on Air Drive for 6 months now, and it's been a great experience. I'm making enough to cover my car payment and then some."
              </p>
              <div className="flex">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Testimonial"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah L.</h4>
                  <p className="text-sm text-gray-600">Toyota RAV4 owner</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I was skeptical at first, but Air Drive has been a game-changer. My car sits in the driveway most weekdays, so why not make money with it? The insurance gives me peace of mind."
              </p>
              <div className="flex">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Testimonial"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">David R.</h4>
                  <p className="text-sm text-gray-600">Ford Mustang owner</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I share my Mustang convertible on weekends and make enough extra cash to fund my vacation every year. The Air Drive team has been super helpful throughout the process."
              </p>
              <div className="flex">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <Star size={20} className="text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about sharing your car
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium"
                onClick={() => toggleFaq('faq1')}
              >
                <span>How does insurance work?</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedFaq === 'faq1' ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedFaq === 'faq1' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">
                    Every trip includes up to $1 million in liability insurance from Liberty Mutual. Your car is also protected against physical damage during trips, up to its actual cash value. We also offer 24/7 roadside assistance and customer support.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium"
                onClick={() => toggleFaq('faq2')}
              >
                <span>What happens if my car is damaged?</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedFaq === 'faq2' ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedFaq === 'faq2' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">
                    If your car is damaged during a trip, our insurance policy will cover repairs, subject to a deductible. You'll need to report the damage immediately after the trip ends, and our team will guide you through the claims process.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium"
                onClick={() => toggleFaq('faq3')}
              >
                <span>How do I get paid?</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedFaq === 'faq3' ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedFaq === 'faq3' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">
                    You'll receive your earnings via direct deposit to your bank account on a monthly basis. Payments are typically processed within the first 5 business days of each month for the previous month's completed trips.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium"
                onClick={() => toggleFaq('faq4')}
              >
                <span>What cars qualify?</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedFaq === 'faq4' ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedFaq === 'faq4' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">
                    Most cars 15 years old or newer with fewer than 150,000 miles qualify. Your car needs to be in good condition, have a clean title (no salvage or rebuilt titles), and pass a safety inspection. Luxury and specialty vehicles may have additional requirements.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium"
                onClick={() => toggleFaq('faq5')}
              >
                <span>How much control do I have over who rents my car?</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedFaq === 'faq5' ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedFaq === 'faq5' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">
                    You have complete control over your car's availability. You can set your own schedule, pricing, and even approve or decline trip requests. All renters are verified with their driver's license and have a rating system, so you can see reviews from previous hosts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start earning with your car?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of car owners who are already making extra income with Air Drive.
          </p>
          <div className="inline-block bg-white text-amber-500 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            List your car now
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-12 space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <CheckCircle size={24} className="mr-2" />
              <span>Free to list</span>
            </div>
            <div className="flex items-center">
              <CheckCircle size={24} className="mr-2" />
              <span>$1M insurance included</span>
            </div>
            <div className="flex items-center">
              <CheckCircle size={24} className="mr-2" />
              <span>24/7 customer support</span>
            </div>
          </div>

          <div className="mt-12">
            <p className="mb-2">Have questions? We're here to help.</p>
            <div className="flex items-center justify-center">
              <Phone size={20} className="mr-2" />
              <span>Call us at 1-800-555-0123</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentYourCarPage;