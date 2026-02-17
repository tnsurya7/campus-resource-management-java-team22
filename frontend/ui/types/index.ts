// User Types
export type UserRole = 'student' | 'staff';
export type UserStatus = 'active' | 'inactive';

export interface User {
    id: string;
    name: string;
    email: string; // Must be unique
    phone: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    // Student specific (optional - not in backend but kept for UI)
    department?: string;
    college?: string;
    year?: string;
    // Staff specific (optional - not in backend but kept for UI)
    position?: string;
}

// Resource Types (matching backend exactly)
export type ResourceType = 'LAB' | 'CLASSROOM' | 'EVENT_HALL';
export type ResourceStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';

export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    capacity: number; // Must be > 0
    status: ResourceStatus;
    location?: string;
    createdAt: string;
}

// Booking Types
export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'FULL_DAY';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED'; // Frontend supports all, backend currently only APPROVED

export interface Booking {
    id: string;
    userId: string;
    userName: string;
    resourceId: string;
    resourceName: string;
    resourceType: ResourceType;
    bookingDate: string; // YYYY-MM-DD format
    timeSlot: TimeSlot;
    status: BookingStatus;
    location?: string;
    createdAt: string;
    rejectionReason?: string;
}

// Time Slot Definitions
export const TIME_SLOT_INFO = {
    MORNING: { label: 'Morning', time: '9:00 AM - 12:00 PM', hours: [9, 10, 11] },
    AFTERNOON: { label: 'Afternoon', time: '12:00 PM - 4:00 PM', hours: [12, 13, 14, 15] },
    FULL_DAY: { label: 'Full Day', time: '9:00 AM - 4:00 PM', hours: [9, 10, 11, 12, 13, 14, 15] },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
    // No double booking: One resource cannot be booked twice for same date + timeSlot
    NO_DOUBLE_BOOKING: true,
    // User must be ACTIVE to book
    USER_MUST_BE_ACTIVE: true,
    // Resource must be AVAILABLE to book
    RESOURCE_MUST_BE_AVAILABLE: true,
    // Cannot book past dates
    NO_PAST_DATE_BOOKING: true,
    // Booking time restriction (9 AM - 4 PM)
    BOOKING_HOURS: { start: 9, end: 16 },
} as const;
