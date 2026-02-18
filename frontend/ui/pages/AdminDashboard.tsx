import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';

interface AdminDashboardProps {
    onNavigate?: (page: string) => void;
}

interface DashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalStaff: number;
    totalResources: number;
    totalBookings: number;
    approvedBookings: number;
    pendingBookings: number;
    rejectedBookings: number;
    activeStudents: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/dashboard/stats');
            if (!response.ok) throw new Error('Failed to load stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            showToast('Failed to load dashboard data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Complete system overview and control</p>
            </div>

            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
                        <p className="text-purple-100 mt-1">System Administrator</p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-lg">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading dashboard...</p>
                </div>
            ) : stats ? (
                <>
                    {/* User Stats */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                icon="users"
                                color="indigo"
                                trend="+12%"
                            />
                            <StatCard
                                title="Students"
                                value={stats.totalStudents}
                                icon="academic"
                                color="blue"
                                trend="+8%"
                            />
                            <StatCard
                                title="Staff"
                                value={stats.totalStaff}
                                icon="briefcase"
                                color="purple"
                                trend="+5%"
                            />
                            <StatCard
                                title="Active Students"
                                value={stats.activeStudents}
                                icon="check"
                                color="green"
                                trend="+15%"
                            />
                        </div>
                    </div>

                    {/* Resource & Booking Stats */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources & Bookings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Resources"
                                value={stats.totalResources}
                                icon="cube"
                                color="cyan"
                                trend="+18%"
                            />
                            <StatCard
                                title="Total Bookings"
                                value={stats.totalBookings}
                                icon="calendar"
                                color="indigo"
                                trend="+24%"
                            />
                            <StatCard
                                title="Approved"
                                value={stats.approvedBookings}
                                icon="check"
                                color="green"
                            />
                            <StatCard
                                title="Pending Review"
                                value={stats.pendingBookings}
                                icon="clock"
                                color="yellow"
                                badge={stats.pendingBookings > 0 ? `${stats.pendingBookings} new` : undefined}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-red-500">Failed to load dashboard data</p>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        title="Manage Users"
                        description="Add, edit, or remove users"
                        icon="users"
                        color="indigo"
                        onClick={() => onNavigate?.('users')}
                    />
                    <QuickActionCard
                        title="Manage Resources"
                        description="Control all campus resources"
                        icon="cube"
                        color="purple"
                        onClick={() => onNavigate?.('resources')}
                    />
                    <QuickActionCard
                        title="Review Bookings"
                        description="Approve or reject bookings"
                        icon="calendar"
                        color="blue"
                        onClick={() => onNavigate?.('all-bookings')}
                    />
                    <QuickActionCard
                        title="Book Resource"
                        description="Create booking anytime"
                        icon="plus"
                        color="green"
                        onClick={() => onNavigate?.('resources')}
                    />
                </div>
            </div>
        </div>
    );
};

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, color, onClick }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'indigo': return 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200';
            case 'purple': return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
            case 'blue': return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
            case 'green': return 'bg-green-100 text-green-600 hover:bg-green-200';
            default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
        }
    };

    const getIcon = () => {
        switch (icon) {
            case 'users':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
            case 'cube':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />;
            case 'calendar':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
            case 'plus':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />;
            default:
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
        }
    };

    return (
        <button
            onClick={onClick}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group w-full text-left"
        >
            <div className={`p-3 rounded-lg ${getColorClasses()} inline-block mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon()}
                </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
};
