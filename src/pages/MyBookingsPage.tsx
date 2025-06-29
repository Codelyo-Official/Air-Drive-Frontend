import React from 'react';
import { useBookingAndReport } from '../api/bookingAndReport';

const MyBookingsPage: React.FC = () => {
  const { useMyBookings } = useBookingAndReport();
  const { data: bookings, isLoading, error } = useMyBookings();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-lg text-gray-700">Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-800 font-semibold mb-2">Error: {error.message}</div>
        <button onClick={() => window.location.reload()} className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">Retry</button>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">You have not made any bookings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Payout</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{booking.booking_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.car.make}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.end_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${parseFloat(booking.total_cost).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">${parseFloat(booking.platform_fee).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">${parseFloat(booking.owner_payout).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookingsPage; 