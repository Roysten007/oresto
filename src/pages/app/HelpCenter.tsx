import { useState } from "react";
import { ChevronLeft, MessageCircle, Phone, FileText, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUPPORT_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "+22946305190";

const FAQ = [
  {
    q: "Comment passer une commande ?",
    a: "Choisissez un restaurant, ajoutez vos plats au panier, sélectionnez le mode de réception (livraison ou retrait) et validez. Vous suivez ensuite votre commande en temps réel.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "MTN Mobile Money, Moov Money et le paiement en espèces à la livraison. Vous pouvez enregistrer vos numéros Mobile Money dans « Moyens de paiement ».",
  },
  {
    q: "Comment fonctionnent les points de fidélité ?",
    a: "Vous gagnez 1 point par 100 FCFA dépensés, plus 5 points bonus quand la livraison est assurée par le restaurant. Les points se cumulent automatiquement après chaque commande.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Depuis « Mes commandes », ouvrez une commande en cours pour voir son statut en temps réel (reçue, en préparation, en route, livrée) et discuter avec le restaurant.",
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [showFaq, setShowFaq] = useState(false);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const openWhatsApp = () => {
    const num = SUPPORT_PHONE.replace(/\D/g, "");
    window.open(`https://wa.me/${num}`, "_blank");
  };

  return (
    <div className="py-8 space-y-6 px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Centre d'aide</h1>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => window.dispatchEvent(new Event("oresto:open-iza"))}
          className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">Discuter avec l'IA</h3>
            <p className="text-xs text-gray-500">Posez vos questions à Oresto IZA</p>
          </div>
        </button>

        <button
          onClick={openWhatsApp}
          className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Phone size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">Service Client</h3>
            <p className="text-xs text-gray-500">Nous écrire sur WhatsApp · {SUPPORT_PHONE}</p>
          </div>
        </button>

        <button
          onClick={() => setShowFaq(v => !v)}
          className="w-full p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">FAQ</h3>
            <p className="text-xs text-gray-500">Questions fréquentes</p>
          </div>
          <ChevronDown size={20} className={`text-gray-300 transition-transform ${showFaq ? "rotate-180" : ""}`} />
        </button>

        {showFaq && (
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-[24px] bg-white border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenItem(openItem === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between gap-3 text-left"
                >
                  <span className="font-bold text-xs text-gray-800">{item.q}</span>
                  <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${openItem === i ? "rotate-180" : ""}`} />
                </button>
                {openItem === i && (
                  <p className="px-5 pb-5 text-xs text-gray-500 leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
