import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../ui/context/AuthContext';
import { ToastProvider, useToast } from '../ui/context/ToastContext';
import { Login } from '../ui/pages/Login';
import { Register, RegisterFormData } from '../ui/pages/Register';
import { StudentDashboard } from '../ui/pages/StudentDashboard';
import { StaffDashboard } from '../ui/pages/StaffDashboard';
import { AdminDashboard } from '../ui/pages/AdminDashboard';
import { ResourcesPage } from '../ui/pages/ResourcesPage';
import { MyBookingsPage } from '../ui/pages/MyBookingsPage';
import { AllBookingsPage } from '../ui/pages/AllBookingsPage';
import { UserManagementPage } from '../ui/pages/UserManagementPage';
import { MainLayout } from '../ui/layout/MainLayout';
import { authAPI } from '../ui/services/api';
import { submissionGuard } from '../ui/utils/security';
import { SESSION_TIMEOUT } from '../ui/types';

// Main App Component
function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </AuthProvider>
    );
}

// App Content with Auth Logic
function AppContent() {
    const { user, login, logout, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [showRegister, setShowRegister] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');

    // Listen for session expiry
    useEffect(() => {
        const handleSessionExpiry = (event: Event) => {
            const customEvent = event as CustomEvent;
            const role = (customEvent.detail?.role || user?.role) as 'student' | 'staff' | 'admin';
            const timeoutMinutes = role && SESSION_TIMEOUT[role] ? SESSION_TIMEOUT[role] / 60000 : 5;
            showToast(`Your session has expired after ${timeoutMinutes} minutes of inactivity. Please log in again.`, 'warning');
            logout();
        };

        window.addEventListener('session-expired', handleSessionExpiry);
        return () => window.removeEventListener('session-expired', handleSessionExpiry);
    }, [logout, showToast, user]);

    const handleLogin = async (email: string, password: string, role: 'student' | 'staff' | 'admin') => {
        const submissionKey = `login-${email}`;

        // Prevent duplicate submissions
        if (!submissionGuard.canSubmit(submissionKey)) {
            return;
        }

        submissionGuard.startSubmission(submissionKey);

        try {
            const userData = await authAPI.login(email, password, role);

            // Check if user account is active
            if (userData.status === 'inactive') {
                showToast('Your account is inactive. Please contact administration.', 'error');
                throw new Error('Account inactive');
            }

            login(userData);
            showToast(`Welcome back, ${userData.name}!`, 'success');
        } catch (error) {
            if (error instanceof Error && error.message === 'Account inactive') {
                throw error; // Re-throw to prevent login attempt increment
            }
            const errorMessage = error instanceof Error ? error.message : 'Invalid credentials. Please check your email and role.';
            showToast(errorMessage, 'error');
            throw error; // Re-throw to trigger login attempt increment
        } finally {
            submissionGuard.endSubmission(submissionKey);
        }
    };

    const handleRegister = async (formData: RegisterFormData) => {
        const submissionKey = `register-${formData.email}`;

        // Prevent duplicate submissions
        if (!submissionGuard.canSubmit(submissionKey)) {
            return;
        }

        submissionGuard.startSubmission(submissionKey);

        try {
            const userData = await authAPI.register({
                ...formData,
                status: 'active', // New users are active by default
            });
            login(userData);
            showToast(`Account created successfully! Welcome, ${userData.name}!`, 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
            showToast(errorMessage, 'error');
            throw error;
        } finally {
            submissionGuard.endSubmission(submissionKey);
        }
    };

    const handleLogout = () => {
        logout();
        showToast('You have been logged out successfully.', 'info');
    };

    const handleNavigate = (page: string) => {
        setActivePage(page);
    };

    // Show Login or Register page if not authenticated
    if (!isAuthenticated) {
        if (showRegister) {
            return (
                <Register
                    onRegister={handleRegister}
                    onBackToLogin={() => setShowRegister(false)}
                />
            );
        }
        return (
            <Login
                onLogin={handleLogin}
                onNavigateToRegister={() => setShowRegister(true)}
            />
        );
    }

    // Render page content based on active page and role
    const renderPageContent = () => {
        if (activePage === 'dashboard') {
            if (user?.role === 'student') {
                return <StudentDashboard onNavigate={handleNavigate} />;
            } else if (user?.role === 'admin') {
                return <AdminDashboard onNavigate={handleNavigate} />;
            } else {
                return <StaffDashboard onNavigate={handleNavigate} />;
            }
        }

        if (activePage === 'resources') {
            return <ResourcesPage />;
        }

        if (activePage === 'my-bookings' && user?.role === 'student') {
            return <MyBookingsPage />;
        }

        if (activePage === 'all-bookings' && (user?.role === 'staff' || user?.role === 'admin')) {
            return <AllBookingsPage />;
        }

        if (activePage === 'users' && (user?.role === 'staff' || user?.role === 'admin')) {
            return <UserManagementPage />;
        }

        return null;
    };

    return (
        <MainLayout
            activePage={activePage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        >
            {renderPageContent()}
        </MainLayout>
    );
}

export default App;
