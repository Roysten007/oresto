import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: { lat: number; lng: number; title?: string }[];
  onMapClick?: (lat: number, lng: number) => void;
}

export default function MapComponent({ 
  center = { lat: 6.3654, lng: 2.4183 }, 
  zoom = 14, 
  markers = [],
  onMapClick 
}: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour la vue si le centre change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    markers.forEach(m => {
      const marker = L.marker([m.lat, m.lng], { icon: DefaultIcon });
      if (m.title) marker.bindPopup(m.title);
      markersLayerRef.current?.addLayer(marker);
    });
  }, [markers]);

  const handleLocate = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16);
          if (markersLayerRef.current) {
            const gpsMarker = L.marker([latitude, longitude], { icon: DefaultIcon }).bindPopup('📍 Ma position');
            markersLayerRef.current.addLayer(gpsMarker);
          }
        }
        if (onMapClick) onMapClick(latitude, longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[260px]">
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-[24px] overflow-hidden" 
        style={{ minHeight: '280px', width: '100%', height: '100%', zIndex: 0 }} 
      />
      
      <button
        type="button"
        onClick={handleLocate}
        className="absolute bottom-3 right-3 z-[400] bg-white shadow-lg border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
      >
        <i className={`fa-solid fa-location-crosshairs ${locating ? "animate-spin text-primary" : "text-primary"}`}></i>
        <span>{locating ? "Localisation..." : "Me localiser"}</span>
      </button>
    </div>
  );
}
