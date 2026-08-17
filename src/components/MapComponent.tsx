import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -38]
});

export interface GeocodedAddress {
  country?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
}

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: { lat: number; lng: number; title?: string }[];
  autoPromptLocation?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  onAddressDetected?: (addr: GeocodedAddress) => void;
}

export default function MapComponent({ 
  center = { lat: 6.3654, lng: 2.4183 }, 
  zoom = 15, 
  markers = [],
  autoPromptLocation = true,
  onMapClick,
  onAddressDetected
}: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [locating, setLocating] = useState(false);
  const [detectedStatus, setDetectedStatus] = useState<string | null>(null);

  // Fonction de géocodage inverse
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const a = data.address;
          const detected: GeocodedAddress = {
            country: a.country || "Bénin",
            city: a.city || a.town || a.village || a.state || "Cotonou",
            neighborhood: a.suburb || a.neighbourhood || a.quarter || a.residential || "",
            address: data.display_name ? data.display_name.split(',').slice(0, 3).join(',').trim() : (a.road || "")
          };
          if (onAddressDetected) {
            onAddressDetected(detected);
          }
          setDetectedStatus(detected.neighborhood ? `${detected.neighborhood}, ${detected.city}` : detected.city || "Position validée");
        }
      }
    } catch (e) {
      console.warn("Reverse geocode fallback", e);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setDetectedStatus("Géolocalisation non supportée par votre navigateur");
      return;
    }
    setLocating(true);
    setDetectedStatus("Recherche de votre position GPS...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.5 });
        }
        if (onMapClick) onMapClick(latitude, longitude);
        reverseGeocode(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.warn("Erreur GPS:", err);
        setLocating(false);
        setDetectedStatus("Autorisez la localisation dans votre navigateur pour détecter votre position.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Initialisation de la carte
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
        const { lat, lng } = e.latlng;
        if (onMapClick) onMapClick(lat, lng);
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;

      // Demande automatique de la localisation GPS au premier chargement
      if (autoPromptLocation) {
        setTimeout(() => {
          handleLocate();
        }, 600);
      }
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

  // Mettre à jour les marqueurs avec support du glisser-déposer (Drag & Drop)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    markers.forEach(m => {
      const marker = L.marker([m.lat, m.lng], { 
        icon: DefaultIcon,
        draggable: true 
      });

      marker.bindPopup(`<b>${m.title || "Votre Établissement"}</b><br><span style="font-size:11px;color:#666">Déplacez le repère pour ajuster l'emplacement exact</span>`).openPopup();

      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        if (onMapClick) onMapClick(newPos.lat, newPos.lng);
        reverseGeocode(newPos.lat, newPos.lng);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [markers]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex flex-col">
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-[24px] overflow-hidden flex-1 shadow-inner" 
        style={{ minHeight: '320px', width: '100%', zIndex: 0 }} 
      />
      
      {/* Barre d'état GPS en haut à gauche */}
      {detectedStatus && (
        <div className="absolute top-3 left-14 z-[400] bg-white/95 backdrop-blur-sm shadow-md border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-gray-800 flex items-center gap-2 max-w-[70%] truncate animate-in fade-in">
          <i className="fa-solid fa-location-crosshairs text-primary"></i>
          <span className="truncate">{detectedStatus}</span>
        </div>
      )}

      {/* Bouton Localiser flottant */}
      <button
        type="button"
        onClick={handleLocate}
        className="absolute bottom-3 right-3 z-[400] bg-white shadow-xl border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-black/10 group"
      >
        <i className={`fa-solid fa-location-crosshairs ${locating ? "animate-spin text-primary group-hover:text-white" : "text-primary group-hover:text-white"}`}></i>
        <span>{locating ? "Localisation GPS..." : "📍 Me localiser automatiquement"}</span>
      </button>
    </div>
  );
}
