import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ResourceForm from '../components/ResourceForm';
import BookingForm from '../components/BookingForm';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = () => {
    setEditingResource(null);
    setShowResourceModal(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowResourceModal(true);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await api.delete(`/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleBookResource = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
        {isAdmin() && (
          <button
            onClick={handleCreateResource}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            + Add Resource
          </button>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No resources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{resource.name}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{resource.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{resource.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    resource.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {resource.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBookResource(resource)}
                  disabled={!resource.available}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book
                </button>
                {isAdmin() && (
                  <>
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="px-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="px-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResourceModal && (
        <ResourceForm
          resource={editingResource}
          onClose={() => setShowResourceModal(false)}
          onSuccess={() => {
            setShowResourceModal(false);
            fetchResources();
          }}
        />
      )}

      {showBookingModal && (
        <BookingForm
          resource={selectedResource}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            toast.success('Booking created successfully');
          }}
        />
      )}
    </div>
  );
};

export default Resources;
