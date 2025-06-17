import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, DollarSign, CheckCircle } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import FeaturedCars from '../components/FeaturedCars';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
            }}
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative w-full mt-[80px] my-[40%] sm:my-[8%] lg:my-[5%]">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Text */}
            <div className="mb-8 lg:mb-12 space-y-4 lg:space-y-6">
              <div className="space-y-2 pt-[80px]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  <span className="block text-white drop-shadow-2xl mb-2">
                    Find the perfect car
                  </span>
                  <span className="block text-amber-300 drop-shadow-lg animate-pulse">
                    for your next adventure
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
                Book premium cars from trusted local hosts around the world.
                <span className="block sm:inline"> Experience freedom, comfort, and reliability.</span>
              </p>
            </div>

            {/* Search Form Card */}
            <div className="max-w-5xl mx-auto mb-8 lg:mb-12">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:bg-white/100 hover:shadow-3xl transition-all duration-300 mx-4 sm:mx-0">
                <SearchForm />
              </div>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  15K+
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Cars Available</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  60+
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Countries</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  250K+
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Happy Customers</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  4.9★
                </div>
                <div className="text-xs sm:text-sm text-amber-400 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Air Drive Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Find the perfect car</h3>
              <p className="text-gray-600">
                Choose from a wide selection of cars with verified reviews, flexible pickup options, and affordable prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Book instantly</h3>
              <p className="text-gray-600">
                Book directly on our platform with instant confirmation. No waiting for host approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Drive with peace of mind</h3>
              <p className="text-gray-600">
                Every trip includes insurance coverage and 24/7 roadside assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Cars</h2>
          <p className="text-gray-600 text-center mb-12">Discover our most popular vehicles</p>

          <FeaturedCars />

          <div className="text-center mt-12">
            <Link to="/search" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors">
              View all cars
            </Link>
          </div>
        </div>
      </section>

      {/* Rent Your Car Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Make money renting your car</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Turn your car into a second paycheck and earn income on your own schedule.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <DollarSign size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Earn up to $1,000 per month renting your car</span>
                </li>
                <li className="flex items-start">
                  <Shield size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>$1M insurance protection for every trip</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={24} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Set your own availability and pricing</span>
                </li>
              </ul>

              <Link to="/rent-your-car" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors">
                Get started
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4549414/pexels-photo-4549414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Earn money with your car"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white text-black p-6 rounded-lg shadow-lg md:max-w-xs">
                <p className="font-bold text-lg mb-2">Average monthly earnings</p>
                <p className="text-3xl font-bold text-amber-500">$850</p>
                <p className="text-gray-600 mt-2">Based on 15 days of rental per month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Renter</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I needed a car for a weekend trip and Air Drive made it super easy. The booking process was smooth and the car was exactly as described. Will definitely use again!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-gray-600 text-sm">Car Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been renting my car on Air Drive for 6 months now and it's been a great experience. The extra income helps pay for my car expenses, and the platform is easy to use."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src="https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer Lee</h4>
                  <p className="text-gray-600 text-sm">Renter</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Air Drive saved my trip when my car broke down last minute. I found a great replacement in minutes and was able to pick it up just a few blocks away. Lifesaver!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already saving money and earning income with Air Drive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/search" >
              <button className="bg-white text-amber-500 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Find a car
              </button>
            </Link>
            <Link to="/rent-your-car" >
              <button className="bg-amber-600 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-700 transition-colors">
                Rent your car
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;