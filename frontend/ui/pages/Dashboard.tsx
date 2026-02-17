import React from 'react';
import Header from '../layout/Header';
import StatCard from '../components/StatCard';

const Dashboard: React.FC = () => {
    const stats = [
        {
            title: 'Total Resources',
            value: 48,
            trend: { value: '12%', isPositive: true },
        },
        {
            title: 'Active Bookings',
            value: 23,
            trend: { value: '8%', isPositive: true },
        },
        {
            title: 'Available Now',
            value: 31,
            trend: { value: '3%', isPositive: false },
        },
        {
            title: 'Pending Requests',
            value: 5,
        },
    ];

    const recentBookings = [
        { id: 1, resource: 'Conference Room A', date: '2026-02-18', time: '10:00 AM', status: 'confirmed' },
        { id: 2, resource: 'Lab 3', date: '2026-02-19', time: '2:00 PM', status: 'pending' },
        { id: 3, resource: 'Auditorium', date: '2026-02-20', time: '9:00 AM', status: 'confirmed' },
    ];

    const statusColors = {
        confirmed: 'bg-green-50 text-green-700 border-green-200',
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };

    return (
        <>
            <Header
                title="Dashboard"
                subtitle="Overview of your campus resource activities"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        trend={stat.trend}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h2>

                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">{booking.resource}</h3>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[booking.status as keyof typeof statusColors]
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>📅 {booking.date}</span>
                                    <span>🕐 {booking.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Resource Utilization</span>
                                <span className="text-sm font-medium text-gray-900">68%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full shadow-sm" style={{ width: '68%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Booking Rate</span>
                                <span className="text-sm font-medium text-gray-900">82%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600 rounded-full shadow-sm" style={{ width: '82%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Availability</span>
                                <span className="text-sm font-medium text-gray-900">65%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full shadow-sm" style={{ width: '65%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
