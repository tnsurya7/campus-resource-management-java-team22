import React, { useState } from 'react';
import Header from '../layout/Header';
import ResourceCard from '../components/ResourceCard';
import Button from '../components/Button';

const Resources: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'available' | 'booked'>('all');

    const resources = [
        {
            id: 1,
            name: 'Conference Room A',
            type: 'Meeting Room',
            location: 'Building A, Floor 2',
            availability: 'available' as const,
            capacity: 12,
        },
        {
            id: 2,
            name: 'Computer Lab 3',
            type: 'Laboratory',
            location: 'Building B, Floor 1',
            availability: 'booked' as const,
            capacity: 30,
        },
        {
            id: 3,
            name: 'Auditorium',
            type: 'Event Space',
            location: 'Main Building',
            availability: 'available' as const,
            capacity: 200,
        },
        {
            id: 4,
            name: 'Study Room 5',
            type: 'Study Space',
            location: 'Library, Floor 3',
            availability: 'available' as const,
            capacity: 6,
        },
        {
            id: 5,
            name: 'Sports Hall',
            type: 'Recreation',
            location: 'Sports Complex',
            availability: 'maintenance' as const,
            capacity: 50,
        },
        {
            id: 6,
            name: 'Seminar Room B',
            type: 'Meeting Room',
            location: 'Building C, Floor 4',
            availability: 'booked' as const,
            capacity: 20,
        },
    ];

    const filteredResources = resources.filter((resource) => {
        if (filter === 'all') return true;
        return resource.availability === filter;
    });

    const handleBook = (resourceId: number) => {
        alert(`Booking resource ${resourceId}`);
    };

    return (
        <>
            <Header
                title="Resources"
                subtitle="Browse and book campus facilities"
            />

            <div className="mb-8 flex items-center gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'available' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('available')}
                    >
                        Available
                    </Button>
                    <Button
                        variant={filter === 'booked' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('booked')}
                    >
                        Booked
                    </Button>
                </div>

                <div className="flex-1" />

                <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-64 h-10 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        name={resource.name}
                        type={resource.type}
                        location={resource.location}
                        availability={resource.availability}
                        capacity={resource.capacity}
                        onBook={() => handleBook(resource.id)}
                    />
                ))}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500">No resources found matching your criteria</p>
                </div>
            )}
        </>
    );
};

export default Resources;
