import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
    return (
        <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                {icon && <div className="text-gray-400">{icon}</div>}
            </div>

            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{value}</p>

                {trend && (
                    <span
                        className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {trend.isPositive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
