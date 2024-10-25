import React, { useEffect, useState } from 'react';

// Sample user data with descriptions
const mockUsers = [
    { id: 1, name: 'User A', description: 'Loves hiking and outdoor adventures.', location: { lat: 34.0522, lng: -118.2437 } },
    { id: 2, name: 'User B', description: 'Avid reader and coffee enthusiast.', location: { lat: 34.0522, lng: -118.2537 } },
    { id: 3, name: 'User C', description: 'Tech geek and video game lover.', location: { lat: 34.0700, lng: -118.2500 } },
    { id: 4, name: 'User D', description: 'Enjoys traveling and exploring new cultures.', location: { lat: 35.0522, lng: -118.2437 } },
    { id: 5, name: 'User E', description: 'Fitness enthusiast and healthy cooking lover.', location: { lat: 34.0600, lng: -118.2300 } },
];

const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const Near = () => {
    const [usersWithin10km, setUsersWithin10km] = useState([]);
    const [currentUserLocation, setCurrentUserLocation] = useState(null);

    useEffect(() => {
        // Get current user location
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentUserLocation({ lat: latitude, lng: longitude });

            // Filter users within 10 km
            const nearbyUsers = mockUsers.filter(user => {
                const distance = getDistance(latitude, longitude, user.location.lat, user.location.lng);
                return distance <= 100000; // Check if within 10 km
            });

            setUsersWithin10km(nearbyUsers);
        }, (error) => {
            console.error("Error getting location: ", error);
        });
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Users Near You</h1>
            {currentUserLocation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usersWithin10km.length > 0 ? (
                        usersWithin10km.map(user => {
                            const distance = getDistance(
                                currentUserLocation.lat,
                                currentUserLocation.lng,
                                user.location.lat,
                                user.location.lng
                            ).toFixed(2); // Format distance to 2 decimal places

                            return (
                                <div key={user.id} className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <h2 className="text-xl font-semibold text-yellow-400">{user.name}</h2>
                                    <p className="text-gray-300 mb-2">{user.description}</p>
                                    <p className="text-gray-400">Distance: {distance} km</p>
                                    <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600 transition mt-2">
                                        Chat
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-300">No users found within 10 km.</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-300">Getting your location...</p>
            )}
        </div>
    );
};
