import axios from 'axios';
import { User, Resource, Booking, ResourceType, TimeSlot, BookingStatus } from '../types';

// Backend API base URL - uses environment variable or defaults to production backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://crms-backend-zl51.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
            throw new Error(message);
        } else if (error.request) {
            // Request made but no response
            throw new Error('Unable to connect to server. Please check if the backend is running.');
        } else {
            // Something else happened
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
);

// Helper function to convert backend date format to frontend format
const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    // Backend returns LocalDateTime, we need to handle it
    return dateString.split('T')[0];
};

// Helper function to convert backend user to frontend user format
const mapBackendUser = (backendUser: any): User => {
    return {
        id: String(backendUser.id),
        name: backendUser.name,
        email: backendUser.email,
        phone: backendUser.phone || '',
        role: backendUser.role.toLowerCase() as 'student' | 'staff' | 'admin',
        status: backendUser.status.toLowerCase() as 'active' | 'inactive',
        createdAt: backendUser.createdAt,
    };
};

// Helper function to convert backend resource to frontend format
const mapBackendResource = (backendResource: any): Resource => {
    return {
        id: String(backendResource.id),
        name: backendResource.name,
        type: backendResource.type as ResourceType,
        capacity: backendResource.capacity,
        status: backendResource.status as 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE',
        location: backendResource.location,
        createdAt: backendResource.createdAt,
    };
};

// Helper function to convert backend booking to frontend format
const mapBackendBooking = (backendBooking: any): Booking => {
    return {
        id: String(backendBooking.id),
        userId: String(backendBooking.userId),
        userName: backendBooking.userName || '',
        resourceId: String(backendBooking.resourceId),
        resourceName: backendBooking.resourceName || '',
        resourceType: 'LAB' as ResourceType, // Default, will be enriched if needed
        bookingDate: formatDate(backendBooking.bookingDate),
        timeSlot: backendBooking.timeSlot as TimeSlot,
        status: backendBooking.status as BookingStatus,
        location: backendBooking.location,
        createdAt: backendBooking.createdAt,
        rejectionReason: backendBooking.rejectionReason,
    };
};

// Auth API
export const authAPI = {
    login: async (email: string, password: string, role: 'student' | 'staff' | 'admin'): Promise<User> => {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });
            
            // Backend now returns { token, user }
            const { token, user: backendUser } = response.data;
            const user = mapBackendUser(backendUser);
            
            // Verify role matches
            if (user.role !== role) {
                throw new Error('Invalid credentials');
            }
            
            // Store JWT token in localStorage
            localStorage.setItem('jwt_token', token);
            
            return user;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User> => {
        try {
            const backendUserData = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                role: userData.role.toUpperCase(),
                status: userData.status.toUpperCase(),
            };
            
            const response = await apiClient.post('/users', backendUserData);
            return mapBackendUser(response.data);
        } catch (error) {
            throw error;
        }
    },
};

// Resources API
export const resourcesAPI = {
    getAll: async (): Promise<Resource[]> => {
        try {
            const response = await apiClient.get('/resources');
            return response.data.map(mapBackendResource);
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: string): Promise<Resource> => {
        try {
            const response = await apiClient.get(`/resources/${id}`);
            return mapBackendResource(response.data);
        } catch (error) {
            throw error;
        }
    },

    create: async (resource: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> => {
        try {
            const backendResourceData = {
                name: resource.name,
                type: resource.type,
                capacity: resource.capacity,
                status: resource.status,
            };
            
            const response = await apiClient.post('/resources', backendResourceData);
            return mapBackendResource(response.data);
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, updates: Partial<Omit<Resource, 'id' | 'createdAt'>>): Promise<Resource> => {
        try {
            // Get current resource first
            const currentResource = await resourcesAPI.getById(id);
            
            const backendResourceData = {
                name: updates.name ?? currentResource.name,
                type: updates.type ?? currentResource.type,
                capacity: updates.capacity ?? currentResource.capacity,
                status: updates.status ?? currentResource.status,
            };
            
            const response = await apiClient.put(`/resources/${id}`, backendResourceData);
            return mapBackendResource(response.data);
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/resources/${id}`);
        } catch (error) {
            throw error;
        }
    },
};

// Bookings API
export const bookingsAPI = {
    getAll: async (): Promise<Booking[]> => {
        try {
            const response = await apiClient.get('/bookings');
            return response.data.map(mapBackendBooking);
        } catch (error) {
            throw error;
        }
    },

    getByUser: async (userId: string): Promise<Booking[]> => {
        try {
            const response = await apiClient.get(`/bookings/user/${userId}`);
            return response.data.map(mapBackendBooking);
        } catch (error) {
            throw error;
        }
    },

    create: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
        try {
            const backendBookingData = {
                userId: Number(bookingData.userId),
                resourceId: Number(bookingData.resourceId),
                bookingDate: bookingData.bookingDate,
                timeSlot: bookingData.timeSlot,
            };
            
            const response = await apiClient.post('/bookings', backendBookingData);
            return mapBackendBooking(response.data);
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id: string, status: BookingStatus, rejectionReason?: string): Promise<Booking> => {
        try {
            let response;
            if (status === 'APPROVED') {
                response = await apiClient.put(`/bookings/${id}/approve`);
            } else if (status === 'REJECTED') {
                if (!rejectionReason) {
                    throw new Error('Rejection reason is required');
                }
                response = await apiClient.put(`/bookings/${id}/reject`, {
                    reason: rejectionReason
                });
            } else {
                throw new Error('Invalid status');
            }
            return mapBackendBooking(response.data);
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/bookings/${id}`);
        } catch (error) {
            throw error;
        }
    },
};

// Users API (Staff only)
export const usersAPI = {
    getAll: async (): Promise<User[]> => {
        try {
            const response = await apiClient.get('/users?page=0&size=1000');
            // Backend returns paginated response
            const data = response.data.content || response.data;
            return Array.isArray(data) ? data.map(mapBackendUser) : [];
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: string): Promise<User> => {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return mapBackendUser(response.data);
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
        try {
            // Get current user first
            const currentUser = await usersAPI.getById(id);
            
            const backendUserData = {
                name: updates.name ?? currentUser.name,
                email: updates.email ?? currentUser.email,
                phone: updates.phone ?? currentUser.phone,
                role: (updates.role ?? currentUser.role).toUpperCase(),
                status: (updates.status ?? currentUser.status).toUpperCase(),
            };
            
            const response = await apiClient.put(`/users/${id}`, backendUserData);
            return mapBackendUser(response.data);
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/users/${id}`);
        } catch (error) {
            throw error;
        }
    },
};

// Stats API
export const statsAPI = {
    getStats: async (role: 'student' | 'staff' | 'admin', userId: string) => {
        try {
            const response = await apiClient.get('/dashboard/stats');
            const stats = response.data;
            
            if (role === 'student') {
                // Get user-specific bookings
                const userBookings = await bookingsAPI.getByUser(userId);
                const approvedBookings = userBookings.filter(b => b.status === 'APPROVED');
                const pendingBookings = userBookings.filter(b => b.status === 'PENDING');
                
                // Get available resources
                const resources = await resourcesAPI.getAll();
                const availableResources = resources.filter(r => r.status === 'AVAILABLE');
                
                return {
                    availableResources: availableResources.length,
                    myBookings: userBookings.length,
                    approvedBookings: approvedBookings.length,
                    pendingBookings: pendingBookings.length,
                };
            } else {
                // Staff and Admin stats from backend
                const users = await usersAPI.getAll();
                const activeStudents = users.filter(u => u.role === 'student' && u.status === 'active');
                
                return {
                    totalUsers: stats.totalUsers || users.length,
                    totalResources: stats.totalResources || 0,
                    totalBookings: stats.totalBookings || 0,
                    approvedBookings: stats.totalApprovedBookings || 0,
                    pendingBookings: 0, // Calculate if needed
                    activeStudents: activeStudents.length,
                };
            }
        } catch (error) {
            throw error;
        }
    },
};
