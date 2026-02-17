import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Building2, Users, Calendar, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    timeSlot: 'MORNING'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
    setBookingData({
      bookingDate: '',
      timeSlot: 'MORNING'
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/bookings', {
        userId: user.id,
        resourceId: selectedResource.id,
        bookingDate: bookingData.bookingDate,
        timeSlot: bookingData.timeSlot
      });
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      setSelectedResource(null);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      AVAILABLE: 'success',
      UNAVAILABLE: 'danger',
      MAINTENANCE: 'warning'
    };
    return variants[status] || 'default';
  };

  const getTypeBadge = (type) => {
    const variants = {
      LAB: 'info',
      CLASSROOM: 'purple',
      EVENT_HALL: 'warning'
    };
    return variants[type] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-40 bg-slate-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Resources</h1>
          <p className="text-slate-500 mt-1">Browse and book available campus resources</p>
        </div>
        {user?.role === 'STAFF' && (
          <Button icon={Plus}>Add Resource</Button>
        )}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} hover className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{resource.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getTypeBadge(resource.type)}>
                      {resource.type}
                    </Badge>
                    <Badge variant={getStatusBadge(resource.status)}>
                      {resource.status}
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>Capacity: {resource.capacity}</span>
              </div>

              {/* Action */}
              <Button
                variant="primary"
                className="w-full"
                disabled={resource.status !== 'AVAILABLE'}
                onClick={() => handleBookClick(resource)}
              >
                <Calendar className="w-4 h-4" />
                Book Resource
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Resource"
      >
        {selectedResource && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Resource Info */}
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedResource.name}</p>
                  <p className="text-sm text-slate-600">{selectedResource.type} • Capacity: {selectedResource.capacity}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <Input
              type="date"
              label="Booking Date"
              value={bookingData.bookingDate}
              onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            {/* Time Slot */}
            <Select
              label="Time Slot"
              value={bookingData.timeSlot}
              onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
              options={[
                { value: 'MORNING', label: 'Morning (9 AM - 12 PM)' },
                { value: 'AFTERNOON', label: 'Afternoon (1 PM - 5 PM)' },
                { value: 'FULL_DAY', label: 'Full Day (9 AM - 5 PM)' }
              ]}
              required
            />

            {/* Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Bookings are automatically approved by the system.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={isSubmitting}
              >
                Confirm Booking
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Resources;
