import { ChevronLeft, MessageCircle, Phone, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <div className="py-8 space-y-6 px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Centre d'aide</h1>
      </div>

      <div className="space-y-4">
        <button className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">Discuter avec l'IA</h3>
            <p className="text-xs text-gray-500">Posez vos questions à Oresto IZA</p>
          </div>
        </button>

        <button className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Phone size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">Service Client</h3>
            <p className="text-xs text-gray-500">Appeler le +229 00 00 00 00</p>
          </div>
        </button>

        <button className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">FAQ</h3>
            <p className="text-xs text-gray-500">Questions fréquentes</p>
          </div>
        </button>
      </div>
    </div>
  );
}
