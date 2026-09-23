import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { getVendorSector } from "@/lib/vendorSector";
import { 
  Truck, 
  Users, 
  MapPin, 
  Clock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Package,
  Boxes,
  Hotel,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function VendorDelivery() {
  const { vendorProfile, user } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");
  const sector = getVendorSector(vendorProfile, sectorQuery);

  const vendorId = vendorProfile?.id || user?.vendorId || user?.uid || "";

  // État Restaurant
  const [restoMode, setRestoMode] = useState<string>("own");
  const [radius, setRadius] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("500");
  const [avgTime, setAvgTime] = useState<string>("30");

  // État E-Commerce
  const [ecomMode, setEcomMode] = useState<string>("standard");
  const [shippingFeeLocal, setShippingFeeLocal] = useState<string>("1500");
  const [shippingFeeNational, setShippingFeeNational] = useState<string>("3000");
  const [shippingDays, setShippingDays] = useState<string>("24h - 48h");

  // État Hôtel
  const [checkInTime, setCheckInTime] = useState<string>("14:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("11:00");
  const [depositAmount, setDepositAmount] = useState<string>("20000");
  const [receptionType, setReceptionType] = useState<string>("24h");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendorProfile) {
      if (vendorProfile.delivery_radius) setRadius(String(vendorProfile.delivery_radius));
      if (vendorProfile.delivery_fee) setDeliveryFee(String(vendorProfile.delivery_fee));
      if (vendorProfile.avg_delivery_time) setAvgTime(String(vendorProfile.avg_delivery_time));
      if (vendorProfile.delivery_mode) setRestoMode(vendorProfile.delivery_mode);

      if ((vendorProfile as any).shipping_fee_local) setShippingFeeLocal(String((vendorProfile as any).shipping_fee_local));
      if ((vendorProfile as any).shipping_fee_national) setShippingFeeNational(String((vendorProfile as any).shipping_fee_national));
      if ((vendorProfile as any).shipping_delay) setShippingDays((vendorProfile as any).shipping_delay);
      if ((vendorProfile as any).shipping_mode) setEcomMode((vendorProfile as any).shipping_mode);

      if ((vendorProfile as any).check_in_time) setCheckInTime((vendorProfile as any).check_in_time);
      if ((vendorProfile as any).check_out_time) setCheckOutTime((vendorProfile as any).check_out_time);
      if ((vendorProfile as any).deposit_amount) setDepositAmount(String((vendorProfile as any).deposit_amount));
      if ((vendorProfile as any).reception_type) setReceptionType((vendorProfile as any).reception_type);
    }
  }, [vendorProfile]);

  const handleSave = async () => {
    if (!db || !vendorId) {
      toast.success("Paramètres enregistrés");
      return;
    }

    setSaving(true);
    let payload: Record<string, any> = {};

    if (sector === "restaurant") {
      payload = {
        delivery_mode: restoMode,
        delivery_radius: Number(radius) || 5,
        delivery_fee: Number(deliveryFee) || 500,
        avg_delivery_time: Number(avgTime) || 30,
      };
    } else if (sector === "ecommerce") {
      payload = {
        shipping_mode: ecomMode,
        shipping_fee_local: Number(shippingFeeLocal) || 1500,
        shipping_fee_national: Number(shippingFeeNational) || 3000,
        shipping_delay: shippingDays,
      };
    } else {
      payload = {
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        deposit_amount: Number(depositAmount) || 0,
        reception_type: receptionType,
      };
    }

    try {
      await update(ref(db, `vendors/${vendorId}`), payload);
      toast.success("Paramètres enregistrés avec succès !");
    } catch {
      toast.error("Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sub">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl shadow-xs border border-orange-100">
            {sector === "hotel" ? <KeyRound size={22} /> : sector === "ecommerce" ? <Truck size={22} /> : <Truck size={22} />}
          </div>
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
              {sector === "hotel" ? "Arrivées & Réception" : sector === "ecommerce" ? "Expéditions & Livraisons" : "Livraisons & Tables"}
            </h1>
            <p className="text-xs text-zinc-500 font-sub mt-0.5">
              {sector === "hotel"
                ? "Configurez vos heures de check-in / check-out et dépôts de garantie"
                : sector === "ecommerce"
                ? "Définissez vos tarifs de transport et délais de livraison"
                : "Gérez vos zones de livraison, frais et délais moyens"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-zinc-950 text-white font-sub font-bold text-xs hover:bg-zinc-800 transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>Enregistrer les paramètres</span>
        </button>
      </div>

      {/* Configuration RESTAURANT */}
      {sector === "restaurant" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "own", icon: Truck, title: "Propres livreurs", desc: "Vos coursiers internes livrent vos commandes" },
              { id: "oresto", icon: Users, title: "Livreurs tiers mutualisés", desc: "Course confiée aux livreurs indépendants partenaires" },
              { id: "pickup", icon: MapPin, title: "À emporter & sur place", desc: "Retrait au comptoir ou commande à table uniquement" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setRestoMode(m.id)}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  restoMode === m.id
                    ? "bg-white border-[#FF6B00] shadow-sm ring-1 ring-[#FF6B00]"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${restoMode === m.id ? "bg-orange-50 text-[#FF6B00]" : "bg-zinc-100 text-zinc-600"}`}>
                  <m.icon size={20} />
                </div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">{m.title}</h3>
                <p className="text-xs text-zinc-500 font-sub mt-1 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
            <h2 className="font-heading font-bold text-sm text-zinc-950">
              Paramètres du périmètre et tarifs de livraison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Rayon de livraison (km)</label>
                <input
                  type="number"
                  value={radius}
                  onChange={e => setRadius(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-[#FF6B00]"
                  placeholder="5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Frais de livraison standard (FCFA)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-[#FF6B00]"
                  placeholder="500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Délai moyen estimé (minutes)</label>
                <input
                  type="number"
                  value={avgTime}
                  onChange={e => setAvgTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-[#FF6B00]"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration E-COMMERCE */}
      {sector === "ecommerce" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "standard", icon: Package, title: "Livraison standard & express", desc: "Livraison à domicile par coursier moto ou voiture" },
              { id: "relay", icon: MapPin, title: "Point relais & retrait", desc: "Retrait direct en boutique ou point relais partenaire" },
              { id: "national", icon: Truck, title: "Envoi national interurbain", desc: "Expédition dans toutes les villes par compagnie de bus ou La Poste" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setEcomMode(m.id)}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  ecomMode === m.id
                    ? "bg-white border-purple-600 shadow-sm ring-1 ring-purple-600"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${ecomMode === m.id ? "bg-purple-50 text-purple-600" : "bg-zinc-100 text-zinc-600"}`}>
                  <m.icon size={20} />
                </div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">{m.title}</h3>
                <p className="text-xs text-zinc-500 font-sub mt-1 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
            <h2 className="font-heading font-bold text-sm text-zinc-950">
              Tarifs d'expédition et délais de livraison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Frais livraison locale (FCFA)</label>
                <input
                  type="number"
                  value={shippingFeeLocal}
                  onChange={e => setShippingFeeLocal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-purple-600"
                  placeholder="1500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Frais expédition nationale (FCFA)</label>
                <input
                  type="number"
                  value={shippingFeeNational}
                  onChange={e => setShippingFeeNational(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-purple-600"
                  placeholder="3000"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Délai moyen d'expédition</label>
                <input
                  type="text"
                  value={shippingDays}
                  onChange={e => setShippingDays(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-purple-600"
                  placeholder="24h - 48h"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration HÔTEL */}
      {sector === "hotel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "24h", icon: Clock, title: "Réception ouverte 24h/24", desc: "Accueil physique permanent pour les arrivées tardives" },
              { id: "code", icon: KeyRound, title: "Digicode & serrure connectée", desc: "Entrée autonome par code SMS ou boîte à clés sécurisée" },
              { id: "call", icon: Hotel, title: "Accueil sur rendez-vous", desc: "Le voyageur annonce son heure d'arrivée au propriétaire" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setReceptionType(m.id)}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  receptionType === m.id
                    ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${receptionType === m.id ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-600"}`}>
                  <m.icon size={20} />
                </div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">{m.title}</h3>
                <p className="text-xs text-zinc-500 font-sub mt-1 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
            <h2 className="font-heading font-bold text-sm text-zinc-950">
              Heures officielles d'arrivée et dépôt de garantie
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Check-in (Arrivée à partir de)</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={e => setCheckInTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Check-out (Départ avant)</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={e => setCheckOutTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Caution exigée à l'arrivée (FCFA)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-sub font-bold text-zinc-900 focus:outline-none focus:border-indigo-600"
                  placeholder="20000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
