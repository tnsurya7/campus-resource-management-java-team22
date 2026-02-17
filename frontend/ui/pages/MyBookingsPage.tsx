import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingsAPI } from '../services/api';
import { Booking, TIME_SLOT_INFO } from '../types';
import { SkeletonRow } from '../components/Loading';

export const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const data = await bookingsAPI.getByUser(user!.id);
            // Sort by date (newest first)
            setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            showToast('Failed to load bookings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingsAPI.delete(id);
            showToast('Booking cancelled successfully', 'success');
            loadBookings();
        } catch (error) {
            showToast('Failed to cancel booking', 'error');
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (filterStatus !== 'ALL' && b.status !== filterStatus) return false;
        return true;
    });

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'LAB': return 'bg-purple-100 text-purple-800';
            case 'CLASSROOM': return 'bg-blue-100 text-blue-800';
            case 'EVENT_HALL': return 'bg-pink-100 text-pink-800';
            case 'COMPUTER': return 'bg-cyan-100 text-cyan-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isPastBooking = (dateString: string) => {
        const bookingDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return bookingDate < today;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">View and manage your resource bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {bookings.filter(b => b.status === 'APPROVED').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                {bookings.filter(b => b.status === 'PENDING').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="ALL">All Bookings</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredBookings.length === 0 && !isLoading ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No bookings found</p>
                        <p className="text-gray-400 text-sm mt-1">Start by booking a resource</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <>
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                    </>
                                ) : (
                                    filteredBookings.map((booking) => (
                                    <tr key={booking.id} className={`hover:bg-gray-50 ${isPastBooking(booking.bookingDate) ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{booking.resourceName}</div>
                                                {booking.location && (
                                                    <div className="text-sm text-gray-500">{booking.location}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(booking.resourceType)}`}>
                                                {booking.resourceType.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(booking.bookingDate)}
                                            {isPastBooking(booking.bookingDate) && (
                                                <span className="ml-2 text-xs text-gray-500">(Past)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {TIME_SLOT_INFO[booking.timeSlot].label}
                                            <div className="text-xs text-gray-500">{TIME_SLOT_INFO[booking.timeSlot].time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {booking.status === 'REJECTED' && booking.rejectionReason && (
                                                <div className="text-xs text-red-600 mt-1">{booking.rejectionReason}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {!isPastBooking(booking.bookingDate) && booking.status !== 'REJECTED' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
