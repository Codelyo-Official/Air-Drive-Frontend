
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl text-white font-bold mb-4">Stay Updated with Air Drive</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest updates on new features, exclusive offers, and car sharing tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-400 p-3 rounded-md"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white flex justify-center items-center rounded-lg py-3 px-4">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 gap-3">
              <Link to="/" className="flex items-center">
                <img
                  src="/air_drive_logo.PNG"
                  alt="Air Drive Logo"
                  className="h-16 w-auto"
                />
              </Link>
              <span className="text-amber-400 font-bold text-2xl">AIRDRIVE</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              The most trusted car sharing platform. Connect with car owners and drivers in your community for safe,
              affordable, and convenient transportation.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-amber-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-amber-400" />
                <span className="text-sm">support@airdrive.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-amber-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-500 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-500 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-500 transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* For Drivers */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">For Drivers</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Find Cars
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                How It Works
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Pricing
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Insurance
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Help Center
              </li>
            </ul>
          </div>

          {/* For Car Owners */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">For Car Owners</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                List Your Car
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Earnings Calculator
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Owner Protection
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Owner FAQ
              </li>
              <li className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                Community
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link to="/blog" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">© 2025 Air Drive. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link to="/terms" className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                to="/accessibility"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
