import { VendorProfile } from "@/data/mockData";
import { Check, ShieldCheck, Clock, KeyRound } from "lucide-react";

interface Props {
  vendor: VendorProfile;
}

const DEFAULT_AMENITIES = [
  { name: "Petit-déjeuner inclus / buffet", icon: "fa-solid fa-mug-hot", desc: "Produits frais servis chaque matin" },
  { name: "Wi-Fi Fibre Haut Débit", icon: "fa-solid fa-wifi", desc: "Connexion illimitée dans tout l'établissement" },
  { name: "Groupe électrogène 24h/24", icon: "fa-solid fa-bolt", desc: "Alimentation électrique et climatisation garanties sans coupure" },
  { name: "Piscine & Espace Transats", icon: "fa-solid fa-water-ladder", desc: "Baignade et détente sous le soleil" },
  { name: "Parking privé sécurisé", icon: "fa-solid fa-square-parking", desc: "Surveillance et gardiennage permanent" },
  { name: "Navette Aéroport Cadjehoun", icon: "fa-solid fa-van-shuttle", desc: "Transfert aéroport sur simple demande" }
];

export default function HotelAmenitiesSection({ vendor }: Props) {
  const customServices = vendor.hotel_services || [];
  const servicesList = customServices.length > 0
    ? customServices.map(name => {
        const found = DEFAULT_AMENITIES.find(d => d.name === name);
        return found || { name, icon: "fa-solid fa-check", desc: "Service inclus pour votre confort" };
      })
    : DEFAULT_AMENITIES;

  return (
    <section id="amenities" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 block">
            Confort & Commodités
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            Équipements & Services de l'Établissement
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Tout a été pensé pour que votre séjour se déroule dans un confort absolu et en toute sérénité.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((svc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
                <i className={svc.icon}></i>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-gray-900 leading-snug">
                  {svc.name}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Check-in / Check-out Badges Bar */}
        <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shrink-0 shadow-sm">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">Arrivée (Check-in)</p>
              <p className="font-heading font-black text-sm text-gray-900">Dès {vendor.check_in_time || "14h00"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shrink-0 shadow-sm">
              <KeyRound size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">Départ (Check-out)</p>
              <p className="font-heading font-black text-sm text-gray-900">Jusqu'à {vendor.check_out_time || "11h00"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shrink-0 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">Caution Séjour</p>
              <p className="font-heading font-black text-sm text-gray-900">
                {vendor.deposit_amount ? `${Number(vendor.deposit_amount).toLocaleString()} FCFA (Remboursable)` : "Remboursable au départ"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
