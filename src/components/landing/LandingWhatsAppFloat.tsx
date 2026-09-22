import React from "react";

export function LandingWhatsAppFloat() {
  const whatsappNumber = "2290143405361";
  const defaultMessage = encodeURIComponent(
    "Bonjour Oresto ! Je souhaite avoir des informations pour mettre en ligne mon établissement (Restaurant / Boutique / Hôtel)."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center pointer-events-auto">
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

        {/* WhatsApp Font Awesome Icon */}
        <i className="fa-brands fa-whatsapp text-2xl relative z-10"></i>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </div>
  );
}

export default LandingWhatsAppFloat;
