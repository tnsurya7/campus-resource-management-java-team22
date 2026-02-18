import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    color: 'indigo' | 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'cyan';
    trend?: string;
    badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, badge }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'indigo':
                return {
                    bg: 'bg-indigo-100',
                    text: 'text-indigo-600',
                    trend: 'text-indigo-600',
                };
            case 'blue':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-600',
                    trend: 'text-blue-600',
                };
            case 'purple':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-600',
                    trend: 'text-purple-600',
                };
            case 'green':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-600',
                    trend: 'text-green-600',
                };
            case 'yellow':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-600',
                    trend: 'text-yellow-600',
                };
            case 'red':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-600',
                    trend: 'text-red-600',
                };
            case 'cyan':
                return {
                    bg: 'bg-cyan-100',
                    text: 'text-cyan-600',
                    trend: 'text-cyan-600',
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-600',
                    trend: 'text-gray-600',
                };
        }
    };

    const getIcon = () => {
        switch (icon) {
            case 'users':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                );
            case 'academic':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                );
            case 'briefcase':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                );
            case 'check':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
            case 'cube':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                );
            case 'calendar':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                );
            case 'clock':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
            default:
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                );
        }
    };

    const colors = getColorClasses();

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <span className={`text-sm font-medium ${colors.trend}`}>
                                {trend}
                            </span>
                        )}
                    </div>
                    {badge && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {badge}
                        </span>
                    )}
                </div>
                <div className={`p-3 ${colors.bg} rounded-lg ${colors.text}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon()}
                    </svg>
                </div>
            </div>
        </div>
    );
};
