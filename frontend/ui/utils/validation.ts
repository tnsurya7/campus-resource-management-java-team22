// Business rule validation utilities

// Booking time configuration (9 AM - 4 PM)
export const BOOKING_CONFIG = {
    startHour: 9,
    endHour: 16,
    allowedDays: [1, 2, 3, 4, 5], // Monday to Friday
};

export interface TimeSlot {
    value: string;
    label: string;
    disabled: boolean;
}

// Generate time slots based on configuration
export const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const isAllowed = hour >= BOOKING_CONFIG.startHour && hour < BOOKING_CONFIG.endHour;

        // Morning slot (e.g., "9:00 AM - 10:00 AM")
        const startTime = formatTime(hour, 0);
        const endTime = formatTime(hour + 1, 0);

        slots.push({
            value: `${startTime} - ${endTime}`,
            label: `${startTime} - ${endTime}`,
            disabled: !isAllowed,
        });
    }

    return slots;
};

// Format time as "9:00 AM"
const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
};

// Validate booking date
export const validateBookingDate = (date: string): { valid: boolean; error?: string } => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the past
    if (selectedDate < today) {
        return { valid: false, error: 'Cannot book resources for past dates' };
    }

    // Check if date is a weekend
    const dayOfWeek = selectedDate.getDay();
    if (!BOOKING_CONFIG.allowedDays.includes(dayOfWeek)) {
        return { valid: false, error: 'Bookings are only allowed on weekdays (Monday-Friday)' };
    }

    return { valid: true };
};

// Validate booking time slot
export const validateTimeSlot = (timeSlot: string): { valid: boolean; error?: string } => {
    // Extract start hour from time slot (e.g., "9:00 AM - 10:00 AM" -> 9)
    const match = timeSlot.match(/^(\d+):(\d+)\s*(AM|PM)/);
    if (!match) {
        return { valid: false, error: 'Invalid time slot format' };
    }

    let hour = parseInt(match[1]);
    const period = match[3];

    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    }

    // Check if within allowed hours
    if (hour < BOOKING_CONFIG.startHour || hour >= BOOKING_CONFIG.endHour) {
        return {
            valid: false,
            error: `Bookings are only allowed between ${BOOKING_CONFIG.startHour}:00 AM and ${BOOKING_CONFIG.endHour}:00 PM`,
        };
    }

    return { valid: true };
};

// Check if resource is available for booking
export const canBookResource = (
    resourceStatus: 'available' | 'booked' | 'maintenance',
    userStatus: 'active' | 'inactive'
): { canBook: boolean; reason?: string } => {
    if (userStatus === 'inactive') {
        return { canBook: false, reason: 'Your account is inactive. Please contact administration.' };
    }

    if (resourceStatus === 'booked') {
        return { canBook: false, reason: 'This resource is already booked for the selected time slot' };
    }

    if (resourceStatus === 'maintenance') {
        return { canBook: false, reason: 'This resource is currently under maintenance' };
    }

    return { canBook: true };
};

// Debounce utility for search/filter
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
