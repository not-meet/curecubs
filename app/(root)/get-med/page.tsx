"use client"
// pages/find-medicine.tsx
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

// Types
interface Pharmacy {
  id: string;
  name: string;
  rating: number;
  phone: string;
  location: {
    lat: number;
    lng: number;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  hours: {
    open: string;
    close: string;
    open24: boolean;
    days: string[];
  };
  delivery: boolean;
  has_medicine: boolean;
  distance: number;
  image_url: string;
}

interface Location {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const FindMedicine: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [medicineName, setMedicineName] = useState<string>('');
  const [untilTime, setUntilTime] = useState<string>('');
  const [radius, setRadius] = useState<number>(5);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
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

  // Find pharmacies based on location and medicine
  const findPharmacies = async () => {
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

      // Call Pharmacy API
      const response = await axios.get('/api/pharmacies', {
        params: {
          lat: location.lat,
          lng: location.lng,
          radius,
          medicineName: medicineName || undefined,
          untilTime: untilTime || undefined
        }
      });

      if (response.data.data) {
        setPharmacies(response.data.data);
      }
    } catch (error) {
      console.error('Error finding pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if pharmacy is open until the specified time
  const isOpenUntil = (pharmacy: Pharmacy, time: string) => {
    if (!time) return true;
    if (pharmacy.hours.open24) return true;

    // Simple check if the close time is later than the requested time
    return pharmacy.hours.close >= time;
  };

  // Current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Find Medicine Near You</h1>

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
            <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
            <input
              type="text"
              id="medicineName"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Aspirin, Amoxicillin"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="untilTime" className="block text-sm font-medium text-gray-700 mb-1">Open Until</label>
            <input
              type="time"
              id="untilTime"
              value={untilTime}
              onChange={(e) => setUntilTime(e.target.value)}
              min={getCurrentTime()}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for any time</p>
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
            onClick={findPharmacies}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Medicine'}
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

                {/* Pharmacy markers */}
                {pharmacies.map((pharmacy) => (
                  <Marker
                    key={pharmacy.id}
                    position={{ lat: pharmacy.location.lat, lng: pharmacy.location.lng }}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    icon={{
                      url: pharmacy.has_medicine
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    }}
                  />
                ))}

                {/* Info window for selected pharmacy */}
                {selectedPharmacy && (
                  <InfoWindow
                    position={{
                      lat: selectedPharmacy.location.lat,
                      lng: selectedPharmacy.location.lng
                    }}
                    onCloseClick={() => setSelectedPharmacy(null)}
                  >
                    <div className="max-w-xs">
                      <h3 className="font-bold text-lg">{selectedPharmacy.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">Rating: </span>
                        <span className="ml-1 text-yellow-500">
                          {'★'.repeat(Math.floor(selectedPharmacy.rating))}
                          {'☆'.repeat(5 - Math.floor(selectedPharmacy.rating))}
                        </span>
                        <span className="ml-1 text-sm">({selectedPharmacy.rating.toFixed(1)})</span>
                      </div>
                      <p className="text-sm mt-1">
                        {selectedPharmacy.location.address.street},<br />
                        {selectedPharmacy.location.address.city}, {selectedPharmacy.location.address.state} {selectedPharmacy.location.address.zip}
                      </p>
                      <p className="text-sm mt-1">
                        📞 {selectedPharmacy.phone}
                      </p>
                      <p className="text-sm mt-1">
                        ⏰ {selectedPharmacy.hours.open24 ? 'Open 24 hours' : `${selectedPharmacy.hours.open} - ${selectedPharmacy.hours.close}`}
                      </p>
                      <p className="text-sm mt-1">
                        {selectedPharmacy.has_medicine ?
                          '✅ Medicine in stock' :
                          '❌ Medicine not available'}
                      </p>
                      <p className="text-sm mt-1">
                        {selectedPharmacy.delivery ?
                          '🚚 Delivery available' :
                          '🚫 No delivery service'}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Pharmacy Listings */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Nearby Pharmacies</h2>

            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-2">Searching for pharmacies...</p>
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p className="text-gray-600">No pharmacies found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pharmacies
                  .filter(pharmacy => isOpenUntil(pharmacy, untilTime))
                  .map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className={`bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer ${pharmacy.has_medicine ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                        }`}
                      onClick={() => {
                        setSelectedPharmacy(pharmacy);
                        setMapCenter({
                          lat: pharmacy.location.lat,
                          lng: pharmacy.location.lng
                        });
                      }}
                    >
                      <div className="flex items-start">
                        {pharmacy.image_url && (
                          <img
                            src={pharmacy.image_url}
                            alt={pharmacy.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-bold">{pharmacy.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500 text-sm">
                              {'★'.repeat(Math.floor(pharmacy.rating))}
                              {'☆'.repeat(5 - Math.floor(pharmacy.rating))}
                            </span>
                            <span className="ml-1 text-xs">({pharmacy.rating.toFixed(1)})</span>
                          </div>
                          <p className="text-sm mt-1">
                            {pharmacy.distance.toFixed(1)} km away
                          </p>
                          <p className="text-sm mt-1">
                            {pharmacy.location.address.street}, {pharmacy.location.address.city}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${pharmacy.has_medicine ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {pharmacy.has_medicine ? 'In Stock' : 'Not Available'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {pharmacy.hours.open24 ? '24 Hours' : `Until ${pharmacy.hours.close}`}
                            </span>
                            {pharmacy.delivery && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                Delivery
                              </span>
                            )}
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

export default FindMedicine;
