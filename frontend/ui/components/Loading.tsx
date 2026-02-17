import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const colorClasses = {
        primary: 'border-indigo-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-400 border-t-transparent',
    };

    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-solid rounded-full animate-spin`}
            role="status"
            aria-label="Loading"
        />
    );
};

// Loading skeleton for cards
export const SkeletonCard: React.FC = () => {
    return (
        <div className="p-6 rounded-xl bg-white border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
    );
};

// Loading skeleton for table rows
export const SkeletonRow: React.FC = () => {
    return (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
            </td>
            <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
            </td>
            <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
            </td>
            <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
            </td>
        </tr>
    );
};
