import { VendorProfile } from "@/data/mockData";
import { MapPin, Clock, Navigation, CheckCircle2, Plane, Compass } from "lucide-react";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

const DAYS_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function LocationHoursSection({ vendor, businessType }: Props) {
  const isHotel = businessType === "hotel";
  const isEcommerce = businessType === "ecommerce";

  const neighborhood = vendor.neighborhood || "Haie Vive";
  const city = vendor.city || "Cotonou";
  const hours = vendor.hours || {};

  // Horaires par défaut si non renseignés
  const defaultSchedule: Record<string, string> = isHotel
    ? {
        Lundi: "Réception 24h/24",
        Mardi: "Réception 24h/24",
        Mercredi: "Réception 24h/24",
        Jeudi: "Réception 24h/24",
        Vendredi: "Réception 24h/24",
        Samedi: "Réception 24h/24",
        Dimanche: "Réception 24h/24"
      }
    : isEcommerce
    ? {
        Lundi: "09:00 - 19:30",
        Mardi: "09:00 - 19:30",
        Mercredi: "09:00 - 19:30",
        Jeudi: "09:00 - 19:30",
        Vendredi: "09:00 - 20:00",
        Samedi: "09:00 - 20:00",
        Dimanche: "14:00 - 19:00"
      }
    : {
        Lundi: "11:30 - 23:30",
        Mardi: "11:30 - 23:30",
        Mercredi: "11:30 - 23:30",
        Jeudi: "11:30 - 00:00",
        Vendredi: "11:30 - 01:00",
        Samedi: "11:30 - 01:00",
        Dimanche: "12:00 - 23:00"
      };

  const pointsOfInterest = vendor.points_of_interest || (isHotel
    ? [
        { name: "Aéroport International Cadjehoun (COO)", distance: "8 minutes en voiture", icon: "fa-solid fa-plane-departure" },
        { name: "Plage & Boulevard de la Marina", distance: "5 minutes à pied", icon: "fa-solid fa-water" },
        { name: "Centre des Affaires & Ambassades (Haie Vive)", distance: "3 minutes", icon: "fa-solid fa-briefcase" },
        { name: "Marché Dantokpa & Centre-ville", distance: "12 minutes", icon: "fa-solid fa-city" }
      ]
    : []);

  return (
    <section id="location" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
            {isHotel ? "Situation & Accès" : "Où Nous Trouver"}
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            {isHotel ? "Localisation & Points d'Intérêt" : "Localisation & Horaires d'Ouverture"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {isHotel
              ? "Idéalement situé au cœur de la ville pour vos déplacements professionnels et vos loisirs."
              : isEcommerce
              ? "Venez nous rendre visite en boutique physique ou profitez de nos retraits en point relais."
              : "Venez partager un moment gourmand au sein de notre établissement."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column : Address & Map Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-[32px] bg-gray-50 border border-gray-150 space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Adresse</span>
                    <h3 className="font-heading font-black text-lg text-gray-900 leading-snug mt-0.5">
                      {neighborhood}, {city}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      République du Bénin • Accès sécurisé et parking disponible
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vendor.name} ${neighborhood} ${city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-black text-white font-heading font-bold text-xs hover:bg-primary transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Navigation size={13} />
                  <span>Itinéraire</span>
                </a>
              </div>

              {/* Points of interest (if Hotel or configured) */}
              {pointsOfInterest.length > 0 && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    À proximité immédiate
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pointsOfInterest.map((poi, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200/80 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0">
                          <i className={poi.icon || "fa-solid fa-location-dot"}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-xs text-gray-900 truncate">{poi.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{poi.distance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column : Opening Schedule 7/7 */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white uppercase tracking-tight">Horaires d'Ouverture</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Service 7 jours sur 7</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ouvert
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {DAYS_ORDER.map(day => {
                const dayHours = hours[day];
                const display = dayHours
                  ? (dayHours.closed ? "Fermé" : `${dayHours.open} - ${dayHours.close}`)
                  : (defaultSchedule[day] || "11:30 - 23:30");

                const isToday = DAYS_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === day;

                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                      isToday ? "bg-white/15 text-white font-bold" : "text-gray-400"
                    }`}
                  >
                    <span className={isToday ? "text-primary" : ""}>
                      {day} {isToday && "(Aujourd'hui)"}
                    </span>
                    <span className="font-mono text-[11px] text-white font-semibold">
                      {display}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
