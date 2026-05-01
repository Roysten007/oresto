import { ChevronLeft, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Addresses() {
  const navigate = useNavigate();

  return (
    <div className="py-8 space-y-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Mes Adresses</h1>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-[32px] bg-white border border-gray-100 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">Domicile</h3>
            <p className="text-xs text-gray-500">Quartier Haie Vive, Cotonou, Bénin</p>
          </div>
        </div>

        <button className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
          <Plus size={24} />
          <span className="font-black text-[10px] uppercase tracking-widest">Ajouter une adresse</span>
        </button>
      </div>
    </div>
  );
}
