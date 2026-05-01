import { ChevronLeft, CreditCard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const navigate = useNavigate();

  return (
    <div className="py-8 space-y-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Moyens de paiement</h1>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-[32px] bg-black text-white flex items-start justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 space-y-4 w-full">
            <div className="flex justify-between items-center w-full">
               <CreditCard size={28} className="text-primary" />
               <span className="font-heading font-black italic">MoMo MTN</span>
            </div>
            <div>
               <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Numéro lié</p>
               <h3 className="font-black tracking-widest text-lg">+229 01 02 03 04</h3>
            </div>
          </div>
        </div>

        <button className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
          <Plus size={24} />
          <span className="font-black text-[10px] uppercase tracking-widest">Ajouter un moyen de paiement</span>
        </button>
      </div>
    </div>
  );
}
