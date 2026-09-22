import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function LandingWhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNumber = "2290143405361";
  const defaultMessage = encodeURIComponent(
    "Bonjour Oresto ! Je souhaite avoir des informations pour mettre en ligne mon établissement (Restaurant / Boutique / Hôtel)."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Welcome Tooltip */}
      {showTooltip && (
        <div className="relative bg-white text-zinc-900 text-xs py-2.5 px-3.5 rounded-2xl shadow-float border border-zinc-200 max-w-[230px] flex items-start justify-between gap-2 animate-bounce-slow">
          <div>
            <p className="font-heading font-black text-[#EA580C] uppercase tracking-wide">Besoin d'aide ?</p>
            <p className="text-[11px] text-zinc-500 font-sub mt-0.5 leading-snug">
              Échangez directement avec notre équipe locale au Bénin sur WhatsApp !
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-zinc-600 p-0.5"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white shadow-braised hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Contacter le support Oresto sur WhatsApp"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-orange-400/30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </div>
  );
}

export default LandingWhatsAppFloat;
