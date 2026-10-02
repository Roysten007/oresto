import { motion } from "framer-motion";
import { VendorProfile } from "@/data/mockData";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
}

export default function HeroSection({ vendor, businessType, onPrimaryCta, onSecondaryCta }: Props) {
  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  const defaultCover = isEcommerce
    ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
    : isHotel
    ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80";

  return (
    <section className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] bg-gray-950 flex flex-col justify-end overflow-hidden">
      {/* Background Image with Parallax / Zoom Effect */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0"
      >
        <img
          src={vendor.cover_url || defaultCover}
          alt={vendor.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 text-white space-y-4 sm:space-y-6">
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-white font-heading font-black text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {isEcommerce ? "Boutique Ouverte • Ventes Directes" : isHotel ? "Résidence & Suites Disponibles" : "Restaurant Ouvert • Service Continu"}
          </span>

          {vendor.category && (
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider">
              {vendor.category}
            </span>
          )}
        </div>

        {/* Title and Tagline */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-md leading-[1.1]">
            {vendor.name}
          </h1>
          {vendor.description && (
            <p className="text-sm sm:text-base text-gray-200 font-medium line-clamp-3 max-w-2xl leading-relaxed">
              {vendor.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={onPrimaryCta}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center gap-2.5"
          >
            <i className={`fa-solid ${isEcommerce ? "fa-bag-shopping" : isHotel ? "fa-calendar-check" : "fa-utensils"}`}></i>
            <span>
              {isEcommerce ? "Voir la boutique" : isHotel ? "Vérifier les disponibilités" : "Réserver une table"}
            </span>
          </button>

          {/* Secondary CTA */}
          {onSecondaryCta && (
            <button
              type="button"
              onClick={onSecondaryCta}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider border border-white/25 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{isRestaurant(businessType) ? "Voir le menu" : "Nos coordonnées"}</span>
            </button>
          )}
        </div>

        {/* Location Subtext */}
        {(vendor.city || vendor.neighborhood || vendor.phone) && (
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-300 font-medium pt-1">
            {(vendor.city || vendor.neighborhood) && (
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-primary"></i>
                {[vendor.neighborhood, vendor.city].filter(Boolean).join(", ")}
              </span>
            )}
            {vendor.phone && (
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-emerald-400"></i>
                {vendor.phone}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function isRestaurant(t: string) {
  return t === "restaurant";
}
