"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FC, useEffect, useRef, useState } from "react";
import { Gym } from "@/types/gym";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GymMapProps {
  gyms: Gym[];
  mapCoordinates: { latitude: number; longitude: number } | null;
}

const GymMap: FC<GymMapProps> = ({ gyms, mapCoordinates = null }) => {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const centerRef = useRef<[number, number] | null>(null);

  const defaultZoom = 5;
  const zoomInLevel = 20;

  useEffect(() => {
    if (mapCoordinates) {
      centerRef.current = [mapCoordinates.latitude, mapCoordinates.longitude];
      if (mapRef.current) {
        mapRef.current.setView(centerRef.current, zoomInLevel);
      }
    } else {
      centerRef.current = [59.9139, 10.7522];
      if (mapRef.current) {
        mapRef.current.setView(centerRef.current, defaultZoom);
      }
    }
    setLoading(false);
  }, [mapCoordinates, gyms]); 

  if (loading) {
    return <p>Loading map...</p>; 
  }

  return (
    <MapContainer
      ref={mapRef}
      center={centerRef.current || [59.9139, 10.7522]} 
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {gyms.map((gym) =>
        gym.geoLocation ? (
          <Marker
            key={gym.id}
            position={[gym.geoLocation.latitude, gym.geoLocation.longitude]}
          >
            <Popup>
              <strong>{gym.name}</strong>
              <br />
              {gym.address.address1 ? gym.address.address1 : "No address available"}
              <br />
              {gym.address.postalCode} {gym.address.city}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default GymMap;

