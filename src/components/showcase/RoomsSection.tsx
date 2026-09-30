import { Product, VendorProfile } from "@/data/mockData";
import { Bed, Users, Wifi, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  rooms: Product[];
  vendor: VendorProfile;
  onBookRoom: (room: Product) => void;
}

export default function RoomsSection({ rooms, vendor, onBookRoom }: Props) {
  if (rooms.length === 0) return null;

  return (
    <section id="rooms" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 block">
            Hébergements de Prestige
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            Nos Chambres & Suites
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Découvrez nos espaces conçus pour votre bien-être, alliant modernité, calme et confort absolu.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => {
            const discount = room.originalPrice && room.originalPrice > room.price
              ? Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={room.id}
                layout
                whileHover={{ y: -4 }}
                className="bg-white rounded-[32px] border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between group"
              >
                {/* Photo & Badges */}
                <div className="relative aspect-[16/11] bg-gray-100 overflow-hidden">
                  <img
                    src={room.image || (room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80")}
                    alt={room.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {room.badge && (
                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                        {room.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-3 py-1 rounded-xl bg-red-600 text-white text-[9px] font-black tracking-wider shadow-md">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {room.images && room.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                      {room.images.length} photos
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block">
                      {room.category || "Chambre Deluxe"}
                    </span>
                    <h3 className="font-heading font-black text-lg text-gray-900 leading-snug">
                      {room.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {room.description || "Chambre spacieuse avec literie haut de gamme et salle de bain privative."}
                    </p>
                  </div>

                  {/* Features / Amenities */}
                  {room.features && room.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                      {room.features.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-[10px] font-semibold flex items-center gap-1.5">
                          <Check size={10} className="text-indigo-600" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-indigo-600">
                          {Number(room.price).toLocaleString()} F
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">/ nuit</span>
                      </div>
                      {room.originalPrice && room.originalPrice > room.price && (
                        <span className="text-[10px] text-gray-400 line-through block">
                          {Number(room.originalPrice).toLocaleString()} F
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookRoom(room)}
                      className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Réserver</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
