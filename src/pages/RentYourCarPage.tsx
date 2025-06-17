import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Shield, 
  Calendar, 
  Clock, 
  Phone, 
  Users, 
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Star
} from 'lucide-react';
import { hostEarningsExample } from '../data/mockData';

const RentYourCarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('earnings');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
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
                Turn your car into a second paycheck
              </h1>
              <p className="text-xl mb-8 text-amber-100">
                Share your car when you're not using it and earn an average of $800 per month.
              </p>
              
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h2 className="text-lg font-semibold mb-4">Get started with 3 easy steps:</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">List your car for free</p>
                      <p className="text-sm text-gray-600">It only takes about 10 minutes to create your listing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Set your own schedule and pricing</p>
                      <p className="text-sm text-gray-600">You're always in control of when and how your car is shared.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Get paid monthly</p>
                      <p className="text-sm text-gray-600">Earnings are automatically deposited to your bank account.</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/signup" className="mt-6 block w-full bg-amber-500 text-white text-center py-3 rounded-md font-medium hover:bg-amber-600 transition-colors">
                  List your car
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Car owner with keys" 
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
      
      {/* Earnings Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How much can you earn?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your earnings depend on your car, location, and how often you share it.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'earnings' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('earnings')}
              >
                Earnings Potential
              </button>
              <button 
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'popular' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('popular')}
              >
                Popular Cars
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'earnings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Average monthly earnings</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-amber-500">${hostEarningsExample.averageMonthly}</span>
                        <span className="text-gray-500 ml-2">per month</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on 15 days of rental per month
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Top earners make</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-amber-500">${hostEarningsExample.topEarners}</span>
                        <span className="text-gray-500 ml-2">per month</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on 25 days of rental per month
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Weekend rate</h4>
                        <p className="text-2xl font-bold">${hostEarningsExample.weekendRates}/day</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Weekday rate</h4>
                        <p className="text-2xl font-bold">${hostEarningsExample.weekdayRates}/day</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Estimate your earnings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Car make and model
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option>Select your car</option>
                          <option>Toyota Camry</option>
                          <option>Honda Accord</option>
                          <option>Tesla Model 3</option>
                          <option>BMW 3 Series</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Car year
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option>Select year</option>
                          <option>2023</option>
                          <option>2022</option>
                          <option>2021</option>
                          <option>2020</option>
                          <option>2019</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your location
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter zip code or city"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Days available per month
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option>Select days</option>
                          <option>5-10 days</option>
                          <option>10-15 days</option>
                          <option>15-20 days</option>
                          <option>20+ days</option>
                        </select>
                      </div>
                      
                      <button className="w-full bg-amber-500 text-white py-2 rounded-md font-medium hover:bg-amber-600 transition-colors">
                        Calculate earnings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'popular' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Most popular cars on Air Drive</h3>
                  
                  <div className="space-y-4">
                    {hostEarningsExample.popularCars.map((car, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-bold text-amber-600">{index + 1}</span>
                          </div>
                          <span className="font-medium">{car}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${70 + (index * 10)}-${110 + (index * 15)}</div>
                          <div className="text-sm text-gray-500">per day</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">
                      Don't see your car? No problem! All types of vehicles can earn on Air Drive.
                    </p>
                    <Link to="/signup" className="text-amber-600 font-medium hover:text-amber-700">
                      List your car now <ArrowRight size={16} className="inline ml-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How sharing your car works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've made it simple to start earning with your car
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={36} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">List your car</h3>
              <p className="text-gray-600">
                Create your listing with photos, availability, and pricing. It only takes about 10 minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={36} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get bookings</h3>
              <p className="text-gray-600">
                Travelers will book your car for the dates you've made it available.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={36} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Meet & exchange</h3>
              <p className="text-gray-600">
                Meet the guest to hand over the keys or use our contactless key exchange options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign size={36} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get paid</h3>
              <p className="text-gray-600">
                You'll receive your earnings directly to your bank account each month.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/signup" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors">
              Start earning with your car
            </Link>
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
          <Link to="/signup" className="inline-block bg-white text-amber-500 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            List your car now
          </Link>
          
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