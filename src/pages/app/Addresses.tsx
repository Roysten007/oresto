import { useState } from "react";
import { ChevronLeft, MapPin, Plus, Navigation, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/contexts/ClientContext";
import { toast } from "sonner";

export default function Addresses() {
  const navigate = useNavigate();
  const { location } = useClient();
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Domicile", address: "Quartier Haie Vive, Cotonou, Bénin" }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState("");

  const handleAdd = () => {
    if(!newAddr.trim()) {
      toast.error("Veuillez entrer une adresse");
      return;
    }
    setAddresses([...addresses, { id: Date.now(), type: "Autre", address: newAddr }]);
    setNewAddr("");
    setIsAdding(false);
    toast.success("Adresse ajoutée !");
  };

  return (
    <div className="py-8 space-y-6 px-4">
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
                Position Actuelle <span className="text-[9px] bg-primary px-2 py-0.5 rounded-full">GPS</span>
              </h3>
              <p className="text-xs text-gray-400">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        {addresses.map(addr => (
          <div key={addr.id} className="p-6 rounded-[32px] bg-white border border-gray-100 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest mb-1">{addr.type}</h3>
              <p className="text-xs text-gray-500">{addr.address}</p>
            </div>
          </div>
        ))}

        {/* Add New Address */}
        {isAdding ? (
          <div className="p-6 rounded-[32px] bg-white border-2 border-primary shadow-sm space-y-4">
            <h3 className="font-black text-xs uppercase tracking-widest text-primary">Nouvelle Adresse</h3>
            <textarea 
              value={newAddr}
              onChange={e => setNewAddr(e.target.value)}
              className="w-full bg-gray-50 rounded-2xl p-4 outline-none text-sm resize-none font-medium"
              placeholder="Ex: Immeuble ABC, 3ème étage..."
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-200">Annuler</button>
              <button onClick={handleAdd} className="flex-1 py-3 bg-black text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary flex items-center justify-center gap-2">
                <Check size={14}/> Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
            <Plus size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Ajouter une adresse</span>
          </button>
        )}
      </div>
    </div>
  );
}
