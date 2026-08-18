import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { toast } from "sonner";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
}

const HOTEL_SERVICES_LIST = [
  { id: "breakfast", name: "Petit-déjeuner inclus / buffet", icon: "fa-solid fa-mug-hot", desc: "Servi chaque matin de 07h à 10h30" },
  { id: "wifi", name: "Wi-Fi Fibre Haut Débit", icon: "fa-solid fa-wifi", desc: "Connexion illimitée dans les chambres et parties communes" },
  { id: "shuttle", name: "Navette Aéroport Cadjehoun", icon: "fa-solid fa-van-shuttle", desc: "Accueil et transfert aller-retour sur réservation" },
  { id: "pool", name: "Piscine & Espace Transats", icon: "fa-solid fa-water-ladder", desc: "Accès libre pour tous les résidents" },
  { id: "generator", name: "Groupe électrogène 24h/24", icon: "fa-solid fa-bolt", desc: "Continuité garantie en électricité et climatisation" },
  { id: "parking", name: "Parking privé sécurisé", icon: "fa-solid fa-square-parking", desc: "Surveillance par caméra et gardiennage 24h/24" },
  { id: "lounge", name: "Bar & Lounge Panoramique", icon: "fa-solid fa-martini-glass", desc: "Boissons fraîches et cocktails en terrasse" },
  { id: "laundry", name: "Service Blanchisserie & Repassage", icon: "fa-solid fa-shirt", desc: "Nettoyage express de vos vêtements sur demande" },
  { id: "gym", name: "Salle de Sport & Fitness", icon: "fa-solid fa-dumbbell", desc: "Équipements cardio et musculation récents" }
];

export default function StepHotelServices({ formData, setFormData }: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    (formData as any).hotel_services || [
      "Petit-déjeuner inclus / buffet",
      "Wi-Fi Fibre Haut Débit",
      "Groupe électrogène 24h/24",
      "Parking privé sécurisé",
      "Piscine & Espace Transats"
    ]
  );

  const [checkInTime, setCheckInTime] = useState<string>((formData as any).check_in_time || "14:00");
  const [checkOutTime, setCheckOutTime] = useState<string>((formData as any).check_out_time || "11:00");
  const [depositAmount, setDepositAmount] = useState<string>((formData as any).deposit_amount || "20000");

  const [longStayDiscount, setLongStayDiscount] = useState<boolean>((formData as any).long_stay_discount ?? true);
  const [longStayNights, setLongStayNights] = useState<string>((formData as any).long_stay_nights || "3");
  const [longStayRate, setLongStayRate] = useState<string>((formData as any).long_stay_rate || "15");

  const toggleService = (serviceName: string) => {
    const updated = selectedServices.includes(serviceName)
      ? selectedServices.filter(s => s !== serviceName)
      : [...selectedServices, serviceName];
    
    setSelectedServices(updated);
    setFormData({
      ...formData,
      ...( { hotel_services: updated } as any )
    });
  };

  const handleUpdateTimes = (inTime: string, outTime: string, deposit: string) => {
    setCheckInTime(inTime);
    setCheckOutTime(outTime);
    setDepositAmount(deposit);
    setFormData({
      ...formData,
      ...( { 
        check_in_time: inTime, 
        check_out_time: outTime, 
        deposit_amount: deposit,
        hotel_services: selectedServices,
        long_stay_discount: longStayDiscount,
        long_stay_nights: longStayNights,
        long_stay_rate: longStayRate
      } as any )
    });
  };

  return (
    <div className="space-y-8 font-body">
      
      {/* Header */}
      <div>
        <h2 className="font-heading font-black text-2xl text-gray-900 flex items-center gap-2.5">
          <i className="fa-solid fa-bell-concierge text-indigo-600"></i>
          Services, Équipements & Conditions de Séjour
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Présentez les commodités incluses dans votre établissement et vos conditions d'accueil pour rassurer vos clients.
        </p>
      </div>

      {/* 1. Équipements & Services de l'Établissement */}
      <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700">
            1. Équipements & Services Inclus de l'Hôtel / Résidence
          </label>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Sélectionnez les commodités disponibles pour vos résidents :
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {HOTEL_SERVICES_LIST.map(svc => {
            const isSelected = selectedServices.includes(svc.name);
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => toggleService(svc.name)}
                className={`p-4 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                  isSelected
                    ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20"
                    : "bg-white/60 border-gray-200 hover:border-gray-300 opacity-80"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                  isSelected ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-500"
                }`}>
                  <i className={svc.icon}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`font-heading font-black text-xs ${isSelected ? "text-indigo-950" : "text-gray-700"}`}>
                      {svc.name}
                    </p>
                    {isSelected && <i className="fa-solid fa-check text-indigo-600 text-xs"></i>}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium line-clamp-2 mt-0.5">
                    {svc.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Horaires de Check-in / Check-out & Caution */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 space-y-4 shadow-sm">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700">
            2. Horaires d'Arrivée & Départ (Check-in / Check-out)
          </label>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Ces horaires seront affichés clairement sur les confirmations de réservation WhatsApp et reçus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Heure d'arrivée (Check-in) *
            </label>
            <input
              type="time"
              value={checkInTime}
              onChange={e => handleUpdateTimes(e.target.value, checkOutTime, depositAmount)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm bg-gray-50/50 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Heure de départ (Check-out) *
            </label>
            <input
              type="time"
              value={checkOutTime}
              onChange={e => handleUpdateTimes(checkInTime, e.target.value, depositAmount)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm bg-gray-50/50 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Caution remboursable (FCFA)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={e => handleUpdateTimes(checkInTime, checkOutTime, e.target.value)}
              placeholder="20000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm bg-gray-50/50 outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Offres & Forfaits Séjours Avantageux */}
      <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-percent"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-indigo-950">
                Forfait Réduction Long Séjour
              </h3>
              <p className="text-[11px] text-indigo-700/80 font-medium">
                Accordez automatiquement une remise pour inciter les séjours prolongés.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !longStayDiscount;
              setLongStayDiscount(next);
              setFormData({ ...formData, ...({ long_stay_discount: next } as any) });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              longStayDiscount ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              longStayDiscount ? "translate-x-6" : "translate-x-0"
            }`} />
          </button>
        </div>

        {longStayDiscount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-indigo-200/60">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-900">
                À partir de combien de nuits ?
              </label>
              <select
                value={longStayNights}
                onChange={e => {
                  setLongStayNights(e.target.value);
                  setFormData({ ...formData, ...({ long_stay_nights: e.target.value } as any) });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white font-bold text-xs outline-none focus:border-indigo-600"
              >
                <option value="2">Dès 2 nuits</option>
                <option value="3">Dès 3 nuits (Recommandé)</option>
                <option value="5">Dès 5 nuits</option>
                <option value="7">Dès 7 nuits (1 semaine)</option>
                <option value="14">Dès 14 nuits (2 semaines)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-900">
                Pourcentage de réduction (%)
              </label>
              <select
                value={longStayRate}
                onChange={e => {
                  setLongStayRate(e.target.value);
                  setFormData({ ...formData, ...({ long_stay_rate: e.target.value } as any) });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white font-bold text-xs outline-none focus:border-indigo-600"
              >
                <option value="5">-5% de réduction</option>
                <option value="10">-10% de réduction</option>
                <option value="15">-15% de réduction (Standard)</option>
                <option value="20">-20% de réduction</option>
                <option value="25">-25% de réduction</option>
              </select>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
