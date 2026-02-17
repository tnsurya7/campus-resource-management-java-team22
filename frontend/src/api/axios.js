import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      toast.error('Network error. Please check your connection.', {
        toastId: 'network-error',
      });
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    switch (status) {
      case 400:
        toast.error(message || 'Invalid request. Please check your input.', {
          toastId: `error-${status}`,
        });
        break;
      case 403:
        toast.error('You are not authorized to perform this action.', {
          toastId: 'auth-error',
        });
        break;
      case 404:
        toast.error(message || 'Resource not found.', {
          toastId: 'not-found',
        });
        break;
      case 409:
        toast.error(message || 'Conflict: This time slot is already booked.', {
          toastId: 'conflict',
        });
        break;
      case 500:
        toast.error('Server error. Please try again later.', {
          toastId: 'server-error',
        });
        break;
      default:
        if (status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (status >= 400) {
          toast.error(message || 'An error occurred. Please try again.');
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;
