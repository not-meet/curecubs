"use client"
// pages/find-doctors.tsx
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

// Types
interface Doctor {
  uid: string;
  profile: {
    first_name: string;
    last_name: string;
    title: string;
    image_url: string;
    gender: string;
    bio: string;
  };
  practices: Array<{
    location_slug: string;
    within_search_area: boolean;
    distance: number;
    lat: number;
    lon: number;
    visit_address: {
      street: string;
      street2: string;
      city: string;
      state: string;
      zip: string;
    };
    phones: Array<{
      number: string;
      type: string;
    }>;
    office_hours: string[];
    accepts_new_patients: boolean;
  }>;
  specialties: Array<{
    uid: string;
    name: string;
    description: string;
  }>;
  insurances: Array<{
    insurance_plan: {
      uid: string;
      name: string;
    };
    insurance_provider: {
      uid: string;
      name: string;
    };
  }>;
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
  const [address, setAddress] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [radius, setRadius] = useState<number>(5);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 37.7749, lng: -122.4194 }); // Default: San Francisco
  const [loading, setLoading] = useState<boolean>(false);

  // Get user's current location when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(currentLocation);
          setMapCenter(currentLocation);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  // Find doctors based on location
  const findDoctors = async () => {
    setLoading(true);
    try {
      // First geocode the address if provided
      if (address) {
        const geocodeResponse = await axios.get(`/api/geocode?address=${encodeURIComponent(address)}`);

        if (geocodeResponse.data.location) {
          setUserLocation(geocodeResponse.data.location);
          setMapCenter(geocodeResponse.data.location);
        }
      }

      // Use either the geocoded location or current user location
      const location = userLocation || mapCenter;

      // Call BetterDoctor API
      const response = await axios.get('/api/doctors', {
        params: {
          lat: location.lat,
          lng: location.lng,
          radius,
          specialty: specialty || undefined
        }
      });

      if (response.data.data) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error finding doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get primary practice location for a doctor
  const getPrimaryPractice = (doctor: Doctor) => {
    return doctor.practices.find(practice => practice.within_search_area) || doctor.practices[0];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Find Doctors Near You</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Form - Left Column */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Criteria</h2>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Your Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty (Optional)</label>
            <input
              type="text"
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Cardiologist, Pediatrician"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
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
                zoom={12}
              >
                {/* User location marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }}
                  />
                )}

                {/* Doctor markers */}
                {doctors.map((doctor) => {
                  const practice = getPrimaryPractice(doctor);
                  if (!practice) return null;

                  return (
                    <Marker
                      key={doctor.uid}
                      position={{ lat: practice.lat, lng: practice.lon }}
                      onClick={() => setSelectedDoctor(doctor)}
                    />
                  );
                })}

                {/* Info window for selected doctor */}
                {selectedDoctor && (
                  <InfoWindow
                    position={{
                      lat: getPrimaryPractice(selectedDoctor).lat,
                      lng: getPrimaryPractice(selectedDoctor).lon
                    }}
                    onCloseClick={() => setSelectedDoctor(null)}
                  >
                    <div className="max-w-xs">
                      <h3 className="font-bold text-lg">
                        {selectedDoctor.profile.first_name} {selectedDoctor.profile.last_name}, {selectedDoctor.profile.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedDoctor.specialties.map(s => s.name).join(', ')}
                      </p>
                      {getPrimaryPractice(selectedDoctor).visit_address && (
                        <p className="text-sm mt-1">
                          {getPrimaryPractice(selectedDoctor).visit_address.street},<br />
                          {getPrimaryPractice(selectedDoctor).visit_address.city}, {getPrimaryPractice(selectedDoctor).visit_address.state} {getPrimaryPractice(selectedDoctor).visit_address.zip}
                        </p>
                      )}
                      {getPrimaryPractice(selectedDoctor).phones && getPrimaryPractice(selectedDoctor).phones.length > 0 && (
                        <p className="text-sm mt-1">
                          📞 {getPrimaryPractice(selectedDoctor).phones[0].number}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        {getPrimaryPractice(selectedDoctor).accepts_new_patients ?
                          '✅ Accepting new patients' :
                          '❌ Not accepting new patients'}
                      </p>
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
                {doctors.map((doctor) => {
                  const practice = getPrimaryPractice(doctor);

                  return (
                    <div
                      key={doctor.uid}
                      className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setMapCenter({
                          lat: practice.lat,
                          lng: practice.lon
                        });
                      }}
                    >
                      <div className="flex items-start">
                        {doctor.profile.image_url && (
                          <img
                            src={doctor.profile.image_url}
                            alt={`Dr. ${doctor.profile.last_name}`}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-bold">
                            {doctor.profile.first_name} {doctor.profile.last_name}, {doctor.profile.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {doctor.specialties.map(s => s.name).join(', ')}
                          </p>
                          <p className="text-sm mt-1">
                            {practice.distance.toFixed(1)} km away
                          </p>
                          {practice.visit_address && (
                            <p className="text-sm mt-1">
                              {practice.visit_address.street}, {practice.visit_address.city}
                            </p>
                          )}
                          {practice.phones && practice.phones.length > 0 && (
                            <p className="text-sm mt-1">
                              📞 {practice.phones[0].number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
