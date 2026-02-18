import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resourcesAPI, bookingsAPI } from '../services/api';
import { Resource, ResourceType, TimeSlot, TIME_SLOT_INFO } from '../types';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Spinner, SkeletonCard } from '../components/Loading';

export const ResourcesPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [filterType, setFilterType] = useState<ResourceType | 'ALL'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE'>('ALL');

    // Booking form state
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTimeSlot, setBookingTimeSlot] = useState<TimeSlot>('ONE_HOUR');
    const [isBooking, setIsBooking] = useState(false);

    // Resource form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'LAB' as ResourceType,
        capacity: 1,
        status: 'AVAILABLE' as Resource['status'],
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setIsLoading(true);
            const data = await resourcesAPI.getAll();
            setResources(data);
        } catch (error) {
            showToast('Failed to load resources', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookResource = async () => {
        if (!selectedResource || !bookingDate) {
            showToast('Please select a date', 'warning');
            return;
        }

        try {
            setIsBooking(true);
            await bookingsAPI.create({
                userId: user!.id,
                userName: user!.name,
                resourceId: selectedResource.id,
                resourceName: selectedResource.name,
                resourceType: selectedResource.type,
                bookingDate,
                timeSlot: bookingTimeSlot,
                location: selectedResource.location,
            });
            showToast('Booking request submitted successfully!', 'success');
            setShowBookModal(false);
            setBookingDate('');
            setBookingTimeSlot('ONE_HOUR');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to create booking', 'error');
        } finally {
            setIsBooking(false);
        }
    };

    const handleCreateResource = async () => {
        try {
            setIsSubmitting(true);
            await resourcesAPI.create(formData);
            showToast('Resource created successfully!', 'success');
            setShowCreateModal(false);
            resetForm();
            loadResources();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to create resource', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateResource = async () => {
        if (!selectedResource) return;

        try {
            setIsSubmitting(true);
            await resourcesAPI.update(selectedResource.id, formData);
            showToast('Resource updated successfully!', 'success');
            setShowEditModal(false);
            resetForm();
            loadResources();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to update resource', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteResource = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await resourcesAPI.delete(id);
            showToast('Resource deleted successfully!', 'success');
            loadResources();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to delete resource', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'LAB',
            capacity: 1,
            status: 'AVAILABLE',
            location: '',
        });
    };

    const openEditModal = (resource: Resource) => {
        setSelectedResource(resource);
        setFormData({
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            status: resource.status,
            location: resource.location || '',
        });
        setShowEditModal(true);
    };

    const filteredResources = resources.filter(r => {
        if (filterType !== 'ALL' && r.type !== filterType) return false;
        if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
        return true;
    });

    const getStatusColor = (status: Resource['status']) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-green-100 text-green-800';
            case 'UNAVAILABLE': return 'bg-red-100 text-red-800';
            case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getTypeIcon = (type: ResourceType) => {
        switch (type) {
            case 'LAB':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                );
            case 'CLASSROOM':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            case 'EVENT_HALL':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                );
            case 'COMPUTER':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
                    <p className="text-gray-600 mt-1">
                        {user?.role === 'student' 
                            ? 'Browse and book available resources' 
                            : user?.role === 'admin' 
                            ? 'Full control over all campus resources' 
                            : 'View and book campus resources'}
                    </p>
                </div>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowCreateModal(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Resource
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="ALL">All Types</option>
                        <option value="LAB">Lab</option>
                        <option value="CLASSROOM">Classroom</option>
                        <option value="EVENT_HALL">Event Hall</option>
                        <option value="COMPUTER">Computer</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="ALL">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="UNAVAILABLE">Unavailable</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>
            </div>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">No resources found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.id}
                            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                        {getTypeIcon(resource.type)}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                                        {resource.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">{resource.type.replace('_', ' ')}</p>
                                {resource.location && (
                                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {resource.location}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600 mb-4">
                                    Capacity: <span className="font-medium">{resource.capacity}</span>
                                </p>

                                <div className="flex gap-2">
                                    {resource.status === 'AVAILABLE' && (
                                        <Button
                                            onClick={() => {
                                                setSelectedResource(resource);
                                                setShowBookModal(true);
                                            }}
                                            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            Book Now
                                        </Button>
                                    )}
                                    {user?.role === 'admin' && (
                                        <>
                                            <Button
                                                onClick={() => openEditModal(resource)}
                                                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteResource(resource.id)}
                                                className="bg-red-100 text-red-700 hover:bg-red-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Book Resource Modal */}
            <Modal
                isOpen={showBookModal}
                onClose={() => setShowBookModal(false)}
                title="Book Resource"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Resource</p>
                        <p className="font-medium text-gray-900">{selectedResource?.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={getTodayDate()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                        <select
                            value={bookingTimeSlot}
                            onChange={(e) => setBookingTimeSlot(e.target.value as TimeSlot)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {Object.entries(TIME_SLOT_INFO).map(([key, info]) => {
                                // Filter time slots based on user role
                                const isAllowed = user?.role === 'admin' ? info.forAdmin : user?.role === 'staff' ? info.forStaff : info.forStudents;
                                if (!isAllowed) return null;
                                
                                return (
                                    <option key={key} value={key}>
                                        {info.label} ({info.time})
                                    </option>
                                );
                            })}
                        </select>
                        {user?.role === 'student' && (
                            <p className="text-xs text-gray-500 mt-1">Students can book 1-3 hour slots only</p>
                        )}
                        {user?.role === 'staff' && (
                            <p className="text-xs text-indigo-600 mt-1">Staff have priority and can book any duration</p>
                        )}
                        {user?.role === 'admin' && (
                            <p className="text-xs text-purple-600 mt-1">Admin can book resources anytime with full access</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => setShowBookModal(false)}
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            disabled={isBooking}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBookResource}
                            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                            disabled={isBooking}
                        >
                            {isBooking ? <Spinner size="sm" /> : 'Confirm Booking'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Create/Edit Resource Modal */}
            <Modal
                isOpen={showCreateModal || showEditModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                }}
                title={showCreateModal ? 'Create Resource' : 'Edit Resource'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resource Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Computer Lab 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="LAB">Lab</option>
                            <option value="CLASSROOM">Classroom</option>
                            <option value="EVENT_HALL">Event Hall</option>
                            <option value="COMPUTER">Computer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Resource['status'] })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Building A, Floor 2"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => {
                                setShowCreateModal(false);
                                setShowEditModal(false);
                                resetForm();
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={showCreateModal ? handleCreateResource : handleUpdateResource}
                            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner size="sm" /> : showCreateModal ? 'Create' : 'Update'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
