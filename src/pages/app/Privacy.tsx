import { ChevronLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="py-8 space-y-6 px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Confidentialité</h1>
      </div>

      <div className="space-y-6">
        <div className="p-8 rounded-[40px] bg-black text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <Lock size={32} className="text-primary mb-4" />
          <h2 className="text-lg font-black uppercase tracking-widest mb-2">Vos données sont sécurisées</h2>
          <p className="text-xs text-white/60 leading-relaxed">
            Oresto Connect utilise un cryptage de bout en bout pour protéger vos informations personnelles et vos transactions. Vos données ne sont jamais vendues à des tiers.
          </p>
        </div>

        <div className="space-y-2">
           <button className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center justify-between shadow-sm active:scale-95 transition-all">
             <span className="font-black text-xs uppercase tracking-widest text-left">Gérer les cookies</span>
           </button>
           <button className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center justify-between shadow-sm active:scale-95 transition-all text-red-500">
             <span className="font-black text-xs uppercase tracking-widest text-left">Supprimer mon compte</span>
           </button>
        </div>
      </div>
    </div>
  );
}
