import { ChevronLeft, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SUPPORT_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "+22946305190";

export default function Privacy() {
  const navigate = useNavigate();

  const handleCookies = () => {
    toast.info("Oresto n'utilise aucun cookie de suivi publicitaire. Seules les données nécessaires au fonctionnement de l'application sont stockées.");
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm(
      "Voulez-vous demander la suppression définitive de votre compte et de vos données ? Cette action est irréversible."
    );
    if (!ok) return;
    const num = SUPPORT_PHONE.replace(/\D/g, "");
    const msg = encodeURIComponent(
      "Bonjour, je souhaite supprimer définitivement mon compte Oresto et toutes mes données."
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
    toast.success("Votre demande de suppression a été ouverte sur WhatsApp.");
  };

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
            Oresto Connect protège vos informations personnelles et vos transactions. Vos données ne sont jamais vendues à des tiers.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCookies}
            className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center justify-between shadow-sm active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest text-left">Gérer les cookies</span>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center justify-between shadow-sm active:scale-95 transition-all text-red-500"
          >
            <span className="font-black text-xs uppercase tracking-widest text-left">Supprimer mon compte</span>
            <ChevronRight size={18} className="text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
