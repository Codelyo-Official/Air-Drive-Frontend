//Createbooking
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, MapPin } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format dates for URL
    const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
    
    // Create search query
    const searchParams = new URLSearchParams({
      address: location,
      start_date: formattedStartDate,
      start_time: startTime,
      end_date: formattedEndDate,
      end_time: endTime,
      display_view: 'list'
    });
    
    // Navigate to search page with params
    navigate(`/search?${searchParams.toString()}`);
  };
  
  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="col-span-1 md:col-span-4">
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
        
        {/* Start Time */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={18} className="text-gray-400" />
            </div>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
            >
              {timeOptions.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
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
        
        {/* End Time */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={18} className="text-gray-400" />
            </div>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
            >
              {timeOptions.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-amber-500 text-white py-3 px-4 rounded-md font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
      >
        <Search size={20} className="mr-2" />
        Search for cars
      </button>
    </form>
  );
};

export default SearchForm;