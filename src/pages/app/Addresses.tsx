import { useState, useEffect } from "react";
import { ChevronLeft, MapPin, Plus, Navigation, Check, X, Map as MapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/contexts/ClientContext";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

export default function Addresses() {
  const navigate = useNavigate();
  const { location, updateLocation, addresses, addAddress } = useClient();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [newAddrType, setNewAddrType] = useState("Domicile");

  const handleSaveMapLocation = async () => {
    if (!selectedPos) {
      toast.error("Veuillez choisir un point sur la carte");
      return;
    }
    
    try {
      // 1. Update main location
      await updateLocation(selectedPos[0], selectedPos[1], "Cotonou");
      
      // 2. Add to saved addresses list
      await addAddress({
        label: newAddrType,
        address: `Secteur ${selectedPos[0].toFixed(3)}, ${selectedPos[1].toFixed(3)}`,
        lat: selectedPos[0],
        lng: selectedPos[1]
      });

      setIsAdding(false);
      setSelectedPos(null);
      toast.success("Adresse enregistrée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="py-8 space-y-6 px-4 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Mes Adresses</h1>
      </div>

      <div className="space-y-4">
        {/* GPS Location (Always First) */}
        {location && (
          <div className="p-6 rounded-[32px] bg-black text-white border border-black flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
              <Navigation size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-sm uppercase tracking-widest mb-1 flex items-center justify-between">
                Position GPS Actuelle <span className="text-[9px] bg-primary px-2 py-0.5 rounded-full text-white">ACTIF</span>
              </h3>
              <p className="text-xs text-gray-400">Précision optimale pour la zone de faim</p>
              <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Adresses enregistrées</h2>
          {addresses.map(addr => (
            <div key={addr.id} className="p-6 rounded-[32px] bg-white border border-gray-100 flex items-start gap-4 shadow-sm hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-1">{addr.label}</h3>
                <p className="text-xs text-gray-500">{addr.address}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address with Map */}
        {isAdding ? (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <X size={20} />
                </button>
                <h2 className="text-xl font-black uppercase tracking-tighter">Choisir sur la carte</h2>
              </div>
              <button 
                onClick={handleSaveMapLocation}
                disabled={!selectedPos}
                className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  selectedPos ? "bg-primary text-white shadow-lg" : "bg-gray-100 text-gray-400"
                }`}
              >
                Confirmer
              </button>
            </div>

            <div className="flex-1 relative">
              <MapContainer 
                center={[location?.lat || 6.36536, location?.lng || 2.41833]} 
                zoom={13} 
                className="w-full h-full"
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onClick={(lat, lng) => setSelectedPos([lat, lng])} />
                <ChangeView center={[location?.lat || 6.36536, location?.lng || 2.41833]} />
                {selectedPos && <Marker position={selectedPos} />}
              </MapContainer>
              
              {!selectedPos && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000] flex flex-col items-center">
                  <MapPin size={48} className="text-primary animate-bounce fill-primary/20" />
                  <div className="mt-2 px-4 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Cliquez pour choisir
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["Domicile", "Travail", "Bureau", "Autre"].map(t => (
                  <button 
                    key={t}
                    onClick={() => setNewAddrType(t)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      newAddrType === t ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {selectedPos && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Position : {selectedPos[0].toFixed(6)}, {selectedPos[1].toFixed(6)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full p-8 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <MapIcon size={24} />
            </div>
            <div className="text-center">
              <span className="block font-black text-xs uppercase tracking-widest mb-1">Ajouter sur la carte</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-300">Plus précis et sécurisé</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
