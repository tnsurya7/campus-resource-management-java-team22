// Security utilities for authentication and authorization

export interface LoginAttempt {
    email: string;
    attempts: number;
    lockedUntil: number | null;
}

const LOGIN_ATTEMPTS_KEY = 'crms_login_attempts';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 60000; // 60 seconds

// Login attempt tracking
export const loginAttempts = {
    get: (email: string): LoginAttempt => {
        const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
        const attempts: Record<string, LoginAttempt> = stored ? JSON.parse(stored) : {};
        return attempts[email] || { email, attempts: 0, lockedUntil: null };
    },

    increment: (email: string): LoginAttempt => {
        const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
        const attempts: Record<string, LoginAttempt> = stored ? JSON.parse(stored) : {};

        const current = attempts[email] || { email, attempts: 0, lockedUntil: null };
        current.attempts += 1;

        if (current.attempts >= MAX_ATTEMPTS) {
            current.lockedUntil = Date.now() + LOCKOUT_DURATION;
        }

        attempts[email] = current;
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
        return current;
    },

    reset: (email: string): void => {
        const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
        const attempts: Record<string, LoginAttempt> = stored ? JSON.parse(stored) : {};
        delete attempts[email];
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    },

    isLocked: (email: string): boolean => {
        const attempt = loginAttempts.get(email);
        if (!attempt.lockedUntil) return false;

        if (Date.now() < attempt.lockedUntil) {
            return true;
        }

        // Lock expired, reset attempts
        loginAttempts.reset(email);
        return false;
    },

    getRemainingAttempts: (email: string): number => {
        const attempt = loginAttempts.get(email);
        return Math.max(0, MAX_ATTEMPTS - attempt.attempts);
    },

    getLockoutTimeRemaining: (email: string): number => {
        const attempt = loginAttempts.get(email);
        if (!attempt.lockedUntil) return 0;
        return Math.max(0, Math.ceil((attempt.lockedUntil - Date.now()) / 1000));
    },
};

// Session management
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const LAST_ACTIVITY_KEY = 'crms_last_activity';

export const sessionManager = {
    updateActivity: (): void => {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    },

    isSessionExpired: (): boolean => {
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (!lastActivity) return false;

        const elapsed = Date.now() - parseInt(lastActivity);
        return elapsed > INACTIVITY_TIMEOUT;
    },

    clearSession: (): void => {
        localStorage.removeItem(LAST_ACTIVITY_KEY);
    },

    getRemainingTime: (): number => {
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (!lastActivity) return INACTIVITY_TIMEOUT;

        const elapsed = Date.now() - parseInt(lastActivity);
        return Math.max(0, INACTIVITY_TIMEOUT - elapsed);
    },
};

// Route protection
export const canAccessRoute = (userRole: 'student' | 'staff', route: string): boolean => {
    const studentRoutes = ['/dashboard', '/resources', '/my-bookings'];
    const staffRoutes = ['/dashboard', '/resources', '/bookings', '/users'];

    if (userRole === 'student') {
        return studentRoutes.some(r => route.startsWith(r));
    }

    if (userRole === 'staff') {
        return staffRoutes.some(r => route.startsWith(r));
    }

    return false;
};

// Prevent duplicate submissions
export class SubmissionGuard {
    private submitting = new Set<string>();

    canSubmit(key: string): boolean {
        return !this.submitting.has(key);
    }

    startSubmission(key: string): void {
        this.submitting.add(key);
    }

    endSubmission(key: string): void {
        this.submitting.delete(key);
    }
}

export const submissionGuard = new SubmissionGuard();
