import React from 'react';
import Header from '../layout/Header';
import Button from '../components/Button';

const MyBookings: React.FC = () => {
    const bookings = [
        {
            id: 1,
            resource: 'Conference Room A',
            type: 'Meeting Room',
            date: '2026-02-18',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            status: 'confirmed',
            location: 'Building A, Floor 2',
        },
        {
            id: 2,
            resource: 'Computer Lab 3',
            type: 'Laboratory',
            date: '2026-02-19',
            startTime: '2:00 PM',
            endTime: '4:00 PM',
            status: 'pending',
            location: 'Building B, Floor 1',
        },
        {
            id: 3,
            resource: 'Auditorium',
            type: 'Event Space',
            date: '2026-02-20',
            startTime: '9:00 AM',
            endTime: '11:00 AM',
            status: 'confirmed',
            location: 'Main Building',
        },
        {
            id: 4,
            resource: 'Study Room 5',
            type: 'Study Space',
            date: '2026-02-15',
            startTime: '3:00 PM',
            endTime: '5:00 PM',
            status: 'completed',
            location: 'Library, Floor 3',
        },
    ];

    const statusColors = {
        confirmed: 'bg-green-50 text-green-700 border-green-200',
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        completed: 'bg-gray-50 text-gray-600 border-gray-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
    };

    const handleCancel = (bookingId: number) => {
        alert(`Cancelling booking ${bookingId}`);
    };

    return (
        <>
            <Header
                title="My Bookings"
                subtitle="Manage your resource reservations"
            />

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{booking.resource}</h3>
                                <p className="text-sm text-gray-600">{booking.type}</p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status as keyof typeof statusColors]
                                    }`}
                            >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date</p>
                                <p className="text-sm text-gray-900 font-medium">📅 {booking.date}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Time</p>
                                <p className="text-sm text-gray-900 font-medium">
                                    🕐 {booking.startTime} - {booking.endTime}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Location</p>
                                <p className="text-sm text-gray-900 font-medium">📍 {booking.location}</p>
                            </div>
                        </div>

                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <div className="flex gap-3">
                                <Button variant="secondary" size="sm">
                                    Modify
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancel(booking.id)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {bookings.length === 0 && (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <p className="text-gray-600 mb-4">You don't have any bookings yet</p>
                    <Button variant="primary" size="md">
                        Browse Resources
                    </Button>
                </div>
            )}
        </>
    );
};

export default MyBookings;
