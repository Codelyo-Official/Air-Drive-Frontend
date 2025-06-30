//Createbooking
import { Calendar, MapPin, Search } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format dates for URL
    const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';

    // Create search query
    const searchParams = new URLSearchParams({
      address: location,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      display_view: 'list'
    });

    // Navigate to search page with params
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Location */}
        <div className="col-span-1 md:col-span-3">
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="location">
            Where
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              placeholder="Enter city, airport, or address"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className='flex justify-between'>
        {/* Start Date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Start date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Until
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="End date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <button
          type="submit"
          className="w-[20rem] bg-amber-500 text-white py-3 px-4 rounded-md font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
        >
          <Search size={20} className="mr-2" />
          Search for cars
        </button>
      </div>
    </form>
  );
};

export default SearchForm;