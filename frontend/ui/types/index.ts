// User Types
export type UserRole = 'student' | 'staff' | 'admin';
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
export type ResourceType = 'LAB' | 'CLASSROOM' | 'EVENT_HALL' | 'COMPUTER';
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
export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'ONE_HOUR' | 'TWO_HOURS' | 'THREE_HOURS' | 'FOUR_HOURS' | 'FIVE_HOURS' | 'FULL_DAY';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
    // Legacy time slots (for backward compatibility)
    MORNING: { label: 'Morning', time: 'Morning slot', hours: 3, forStudents: true, forStaff: true, forAdmin: true },
    AFTERNOON: { label: 'Afternoon', time: 'Afternoon slot', hours: 4, forStudents: true, forStaff: true, forAdmin: true },
    // New time slots
    ONE_HOUR: { label: '1 Hour', time: '1 hour slot', hours: 1, forStudents: true, forStaff: true, forAdmin: true },
    TWO_HOURS: { label: '2 Hours', time: '2 hour slot', hours: 2, forStudents: true, forStaff: true, forAdmin: true },
    THREE_HOURS: { label: '3 Hours', time: '3 hour slot', hours: 3, forStudents: true, forStaff: true, forAdmin: true },
    FOUR_HOURS: { label: '4 Hours', time: '4 hour slot', hours: 4, forStudents: false, forStaff: true, forAdmin: true },
    FIVE_HOURS: { label: '5 Hours', time: '5 hour slot', hours: 5, forStudents: false, forStaff: true, forAdmin: true },
    FULL_DAY: { label: 'Full Day', time: 'Full day (8+ hours)', hours: 8, forStudents: false, forStaff: true, forAdmin: true },
} as const;

// Session Timeout (in milliseconds)
export const SESSION_TIMEOUT = {
    student: 5 * 60 * 1000,  // 5 minutes
    staff: 10 * 60 * 1000,   // 10 minutes
    admin: 30 * 60 * 1000,   // 30 minutes
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
