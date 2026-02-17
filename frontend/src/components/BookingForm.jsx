import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const BookingForm = ({ resource, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      resourceId: resource.id,
      userId: user.id,
      bookingDate: '',
      timeSlot: 'MORNING'
    }
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/bookings', {
        userId: parseInt(data.userId),
        resourceId: parseInt(data.resourceId),
        bookingDate: data.bookingDate,
        timeSlot: data.timeSlot
      });
      toast.success('Booking created successfully!');
      onSuccess();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Book Resource</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-semibold text-blue-900">{resource.name}</p>
          <p className="text-sm text-blue-700">{resource.type}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('resourceId')} />
          <input type="hidden" {...register('userId')} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
            <input
              type="date"
              {...register('bookingDate', { required: 'Date is required' })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.bookingDate && <p className="text-red-500 text-sm mt-1">{errors.bookingDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <select
              {...register('timeSlot', { required: 'Time slot is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
              <option value="FULL_DAY">Full Day</option>
            </select>
            {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Bookings are automatically approved by the system.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
