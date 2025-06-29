import React, { useState } from "react";
import { useBookingAndReport } from "../../api/bookingAndReport";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const OwnerBookingPage: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const { useOwnerBookings, bookingApproval } = useBookingAndReport();
  const { data: bookings, isLoading, isError, error, refetch } = useOwnerBookings(status);

  const handleApproval = (booking_id: number, action: "approve" | "reject") => {
    bookingApproval.mutate({ booking_id, action });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Owner Bookings</h2>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>
      {isLoading && <div>Loading bookings...</div>}
      {isError && <div className="text-red-500">{(error as Error).message}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Car</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">End Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="p-2 border">{booking.id}</td>
                  <td className="p-2 border">{booking.car.make} {booking.car.model} ({booking.car.license_plate})</td>
                  <td className="p-2 border">{booking.user.username}</td>
                  <td className="p-2 border">{booking.start_date}</td>
                  <td className="p-2 border">{booking.end_date}</td>
                  <td className="p-2 border capitalize">{booking.status}</td>
                  <td className="p-2 border">
                    {booking.status === "pending" && (
                      <>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleApproval(booking.id, "approve")}
                          disabled={bookingApproval.isLoading}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleApproval(booking.id, "reject")}
                          disabled={bookingApproval.isLoading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerBookingPage; 