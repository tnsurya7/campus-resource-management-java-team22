import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sessionManager } from '../utils/security';

export type UserRole = 'student' | 'staff';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: 'active' | 'inactive';
    // Student specific
    department?: string;
    college?: string;
    year?: string;
    // Staff specific
    position?: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check localStorage for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('crms_user');
        if (storedUser) {
            // Check if session expired
            if (sessionManager.isSessionExpired()) {
                logout();
            } else {
                setUser(JSON.parse(storedUser));
                sessionManager.updateActivity();
            }
        }
    }, []);

    // Auto-logout on inactivity (15 minutes)
    useEffect(() => {
        if (!user) return;

        const checkInactivity = setInterval(() => {
            if (sessionManager.isSessionExpired()) {
                logout();
                // Show toast notification (will be handled by App.tsx)
                window.dispatchEvent(new CustomEvent('session-expired'));
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkInactivity);
    }, [user]);

    // Update activity on user interaction
    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            sessionManager.updateActivity();
        };

        // Track user activity
        window.addEventListener('mousedown', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity);
        window.addEventListener('touchstart', updateActivity);

        return () => {
            window.removeEventListener('mousedown', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            window.removeEventListener('touchstart', updateActivity);
        };
    }, [user]);

    const login = useCallback((userData: User) => {
        setUser(userData);
        localStorage.setItem('crms_user', JSON.stringify(userData));
        sessionManager.updateActivity();
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('crms_user');
        localStorage.removeItem('jwt_token');
        sessionManager.clearSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
