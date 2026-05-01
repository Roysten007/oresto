import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { Locate } from 'lucide-react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: { lat: number; lng: number; title?: string }[];
  onMapClick?: (lat: number, lng: number) => void;
}

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToLocation({ pos }: { pos: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo([pos.lat, pos.lng], 16);
  }, [pos]);
  return null;
}

export default function MapComponent({ 
  center = { lat: 6.3654, lng: 2.4183 }, 
  zoom = 13, 
  markers = [],
  onMapClick 
}: MapComponentProps) {
  const [gpsPos, setGpsPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setGpsPos(pos);
        if (onMapClick) onMapClick(pos.lat, pos.lng);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        key={`${center.lat}-${center.lng}`}
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            {marker.title && <Popup>{marker.title}</Popup>}
          </Marker>
        ))}
        {gpsPos && (
          <Marker position={[gpsPos.lat, gpsPos.lng]}>
            <Popup>📍 Ma position GPS</Popup>
          </Marker>
        )}
        <ClickHandler onMapClick={onMapClick} />
        <FlyToLocation pos={gpsPos} />
      </MapContainer>

      {/* GPS Button */}
      <button
        onClick={handleLocate}
        className="absolute bottom-3 right-3 z-[1000] bg-white shadow-lg border border-border rounded-xl px-3 py-2 text-sm font-sub text-foreground flex items-center gap-1.5 hover:bg-muted transition-colors"
      >
        <Locate size={16} className={locating ? "animate-spin text-primary" : "text-primary"} />
        {locating ? "Localisation..." : "Me localiser"}
      </button>
    </div>
  );
}
