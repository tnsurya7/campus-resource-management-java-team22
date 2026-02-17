import React from 'react';
import Button from './Button';

interface ResourceCardProps {
    name: string;
    type: string;
    location: string;
    availability: 'available' | 'booked' | 'maintenance';
    capacity?: number;
    onBook?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
    name,
    type,
    location,
    availability,
    capacity,
    onBook,
}) => {
    const statusColors = {
        available: 'bg-green-50 text-green-700 border-green-200',
        booked: 'bg-red-50 text-red-700 border-red-200',
        maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };

    const statusLabels = {
        available: 'Available',
        booked: 'Booked',
        maintenance: 'Maintenance',
    };

    return (
        <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
                    <p className="text-sm text-gray-500">{type}</p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[availability]}`}
                >
                    {statusLabels[availability]}
                </span>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Location:</span>
                    <span className="text-gray-900">{location}</span>
                </div>

                {capacity && (
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Capacity:</span>
                        <span className="text-gray-900">{capacity} people</span>
                    </div>
                )}
            </div>

            <Button
                variant={availability === 'available' ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
                onClick={onBook}
                disabled={availability !== 'available'}
            >
                {availability === 'available' ? 'Book Now' : 'Unavailable'}
            </Button>
        </div>
    );
};

export default ResourceCard;
