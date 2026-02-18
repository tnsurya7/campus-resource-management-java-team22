import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingsAPI } from '../services/api';
import { Booking, TIME_SLOT_INFO } from '../types';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { SkeletonRow, Spinner } from '../components/Loading';

export const AllBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const data = await bookingsAPI.getAll();
            // Sort by date (newest first)
            setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            showToast('Failed to load bookings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await bookingsAPI.updateStatus(id, 'APPROVED');
            showToast('Booking approved successfully', 'success');
            loadBookings();
        } catch (error) {
            showToast('Failed to approve booking', 'error');
        }
    };

    const handleReject = async () => {
        if (!selectedBooking || !rejectionReason.trim()) {
            showToast('Please provide a rejection reason', 'warning');
            return;
        }

        if (rejectionReason.trim().length < 10) {
            showToast('Rejection reason must be at least 10 characters', 'warning');
            return;
        }

        try {
            setIsSubmitting(true);
            await bookingsAPI.updateStatus(selectedBooking.id, 'REJECTED', rejectionReason);
            showToast('Booking rejected with reason provided to student', 'success');
            setShowRejectModal(false);
            setRejectionReason('');
            loadBookings();
        } catch (error) {
            showToast('Failed to reject booking', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (booking: Booking) => {
        // If booking is PENDING, require rejection first
        if (booking.status === 'PENDING') {
            showToast('Please reject the booking with a reason before deleting', 'warning');
            setSelectedBooking(booking);
            setShowRejectModal(true);
            return;
        }

        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            await bookingsAPI.delete(booking.id);
            showToast('Booking deleted successfully', 'success');
            loadBookings();
        } catch (error) {
            showToast('Failed to delete booking', 'error');
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
                <p className="text-gray-600 mt-1">Manage all resource bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {bookings.filter(b => b.status === 'REJECTED').length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

            {/* Bookings Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredBookings.length === 0 && !isLoading ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500">No bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    {user?.role === 'admin' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    )}
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
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {booking.userName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.resourceName}</div>
                                            {booking.location && (
                                                <div className="text-sm text-gray-500">{booking.location}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(booking.resourceType)}`}>
                                                {booking.resourceType.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(booking.bookingDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {booking.timeSlot && TIME_SLOT_INFO[booking.timeSlot] 
                                                ? TIME_SLOT_INFO[booking.timeSlot].label 
                                                : (booking.timeSlot || 'Unknown')}
                                            <div className="text-xs text-gray-500">
                                                {booking.timeSlot && TIME_SLOT_INFO[booking.timeSlot]
                                                    ? TIME_SLOT_INFO[booking.timeSlot].time
                                                    : 'Legacy or unknown time slot'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {booking.status === 'REJECTED' && booking.rejectionReason && (
                                                <div className="text-xs text-red-600 mt-1 max-w-xs">{booking.rejectionReason}</div>
                                            )}
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(booking.id)}
                                                            className="text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(booking)}
                                                    className="text-gray-600 hover:text-gray-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                }}
                title="Reject Booking"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            ⚠️ You must provide a valid reason for rejecting this booking. The student will see this reason.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-2">Booking Details</p>
                        <p className="font-medium text-gray-900">{selectedBooking?.resourceName}</p>
                        <p className="text-sm text-gray-600">Student: {selectedBooking?.userName}</p>
                        <p className="text-sm text-gray-600">
                            Date: {selectedBooking?.bookingDate} | 
                            Time: {selectedBooking?.timeSlot && TIME_SLOT_INFO[selectedBooking.timeSlot] 
                                ? TIME_SLOT_INFO[selectedBooking.timeSlot].label 
                                : selectedBooking?.timeSlot}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Example: Resource needed for urgent maintenance, Already booked for department event, etc."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum 10 characters required
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectionReason('');
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            disabled={isSubmitting || rejectionReason.trim().length < 10}
                        >
                            {isSubmitting ? <Spinner size="sm" /> : 'Reject Booking'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
