"use client"
// pages/find-doctors.tsx
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

// Types
interface Doctor {
  name: string;
  address: string;
  category: string[];
  latitude: number;
  longitude: number;
}

interface Location {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const FindDoctors: React.FC = () => {
  const [specialty, setSpecialty] = useState<string>('');
  const [radius, setRadius] = useState<number>(5);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 27.492413, lng: 77.673676 }); // Default: Mathura
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Find doctors based on location and specialty
  const findDoctors = async () => {
    setLoading(true);
    try {
      // Call doctors API with the fixed location
      const response = await axios.post('https://milo-ynas.onrender.com/doctors_list/', {
        lat: 27.492413,
        lon: 77.673676,
        specialty: specialty || "doctor"
      });

      if (response.data && response.data.response && response.data.response.doctors) {
        // Add distance property to each doctor
        const doctorsWithDistance = response.data.response.doctors.map((doctor: Doctor) => {
          const distance = calculateDistance(
            mapCenter.lat,
            mapCenter.lng,
            doctor.latitude,
            doctor.longitude
          );
          return { ...doctor, distance };
        });

        // Filter by radius if specified
        const filteredDoctors = doctorsWithDistance.filter(
          (doctor: Doctor & { distance: number }) => doctor.distance <= radius
        );

        setDoctors(filteredDoctors);
      }
    } catch (error) {
      console.error('Error finding doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get category icon
  const getCategoryIcon = (categories: string[]): string => {
    if (categories.includes('dentist')) return '🦷';
    if (categories.includes('specialist')) return '👨‍⚕️';
    return '🏥';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Find Doctors Near You</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Form - Left Column */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Criteria</h2>

          <div className="mb-4">
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Specialty</option>
              <option value="dentist">Dentist</option>
              <option value="general practitioner">General Practitioner</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">Search Radius (km)</label>
            <input
              type="number"
              id="radius"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              min="1"
              max="50"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={findDoctors}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Doctors'}
          </button>
        </div>

        {/* Map - Right Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow-md h-96">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
              >
                {/* Center location marker */}
                <Marker
                  position={mapCenter}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                />

                {/* Doctor markers */}
                {doctors.map((doctor, index) => (
                  <Marker
                    key={index}
                    position={{ lat: doctor.latitude, lng: doctor.longitude }}
                    onClick={() => setSelectedDoctor(doctor)}
                    icon={{
                      url: doctor.category.includes(specialty || 'doctor')
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    }}
                  />
                ))}

                {/* Info window for selected doctor */}
                {selectedDoctor && (
                  <InfoWindow
                    position={{
                      lat: selectedDoctor.latitude,
                      lng: selectedDoctor.longitude
                    }}
                    onCloseClick={() => setSelectedDoctor(null)}
                  >
                    <div className="max-w-xs">
                      <h3 className="font-bold text-lg">{selectedDoctor.name}</h3>
                      <p className="text-sm mt-1">
                        {selectedDoctor.address}
                      </p>
                      <p className="text-sm mt-1">
                        {getCategoryIcon(selectedDoctor.category)} {selectedDoctor.category.join(', ')}
                      </p>
                      {(selectedDoctor as any).distance && (
                        <p className="text-sm mt-1">
                          📍 {(selectedDoctor as any).distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Doctor Listings */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Nearby Doctors</h2>

            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2">Searching for doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p className="text-gray-600">No doctors found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor, index) => (
                  <div
                    key={index}
                    className={`bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer ${doctor.category.includes(specialty || "doctor") ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-500'
                      }`}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setMapCenter({
                        lat: doctor.latitude,
                        lng: doctor.longitude
                      });
                    }}
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                        {getCategoryIcon(doctor.category)}
                      </div>
                      <div>
                        <h3 className="font-bold">{doctor.name}</h3>
                        <p className="text-sm mt-1">
                          {(doctor as any).distance && `${(doctor as any).distance.toFixed(1)} km away`}
                        </p>
                        <p className="text-sm mt-1">
                          {doctor.address}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {doctor.category.map((cat, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
