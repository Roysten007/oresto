import { useState, useMemo } from "react";
import { Product, VendorProfile } from "@/data/mockData";
import { Calendar, Users, Hotel, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, push, set, runTransaction } from "firebase/database";

interface Props {
  rooms: Product[];
  vendor: VendorProfile;
  selectedRoomId?: string;
}

export default function HotelBookingWidget({ rooms, vendor, selectedRoomId }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedRoom, setSelectedRoom] = useState<string>(selectedRoomId || rooms[0]?.id || "");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentOption, setPaymentOption] = useState<"momo" | "arrival">("momo");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcul du nombre de nuits
  const nights = useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Chambre active
  const currentRoom = useMemo(() => {
    return rooms.find(r => r.id === selectedRoom) || rooms[0];
  }, [rooms, selectedRoom]);

  // Calcul du prix et application de la réduction long séjour
  const { originalTotal, finalTotal, discountAmount, discountPercent } = useMemo(() => {
    if (!currentRoom) return { originalTotal: 0, finalTotal: 0, discountAmount: 0, discountPercent: 0 };
    const baseTotal = currentRoom.price * nights;
    
    let rate = 0;
    const minNights = Number(vendor.long_stay_nights || 3);
    const configuredRate = Number(vendor.long_stay_rate || 15);

    if (vendor.long_stay_discount !== false && nights >= minNights) {
      rate = configuredRate;
    }

    const discount = Math.round(baseTotal * (rate / 100));
    return {
      originalTotal: baseTotal,
      finalTotal: baseTotal - discount,
      discountAmount: discount,
      discountPercent: rate
    };
  }, [currentRoom, nights, vendor]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !currentRoom) {
      toast.error("Veuillez renseigner votre nom, téléphone et choisir une chambre");
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        id: `book_${Date.now()}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        clientName: name.trim(),
        clientPhone: phone.trim(),
        checkIn,
        checkOut,
        nights,
        guests,
        totalPrice: finalTotal,
        paymentOption: paymentOption === "momo" ? "Mobile Money" : "Paiement à l'arrivée",
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      // Transaction Firebase pour sécuriser et décrémenter le stock si nécessaire
      if (db && vendor.id) {
        try {
          const bookingRef = push(ref(db, `hotel_bookings/${vendor.id}`));
          await set(bookingRef, bookingData);

          // Décrémentation transactionnelle du stock de chambres disponibles
          if (currentRoom.id) {
            const roomStockRef = ref(db, `products/${currentRoom.id}/stock`);
            await runTransaction(roomStockRef, (currentStock) => {
              if (currentStock === null || currentStock === undefined) return 2;
              return Math.max(0, currentStock - 1);
            });
          }
        } catch (dbErr) {
          console.warn("DB Booking warning:", dbErr);
        }
      }

      setSuccess(true);
      toast.success("Réservation de séjour confirmée avec succès !");

      // Notification WhatsApp
      const rawPhone = (vendor.whatsapp || vendor.phone || "").replace(/\D/g, "");
      const msg = encodeURIComponent(
        `Bonjour *${vendor.name}* !\nJe souhaite réserver un séjour dans votre hôtel :\n\n🏨 *Chambre :* ${currentRoom.name}\n📅 *Arrivée (Check-in) :* ${checkIn} (dès ${vendor.check_in_time || "14h00"})\n📅 *Départ (Check-out) :* ${checkOut} (avant ${vendor.check_out_time || "11h00"})\n🌙 *Durée :* ${nights} nuitée${nights > 1 ? "s" : ""}\n👥 *Voyageurs :* ${guests} personnes\n💰 *Total Séjour :* ${finalTotal.toLocaleString()} FCFA\n💳 *Mode :* ${paymentOption === "momo" ? "Mobile Money" : "Paiement à l'arrivée"}\n\n👤 *Nom :* ${name.trim()}\n📞 *Tél :* ${phone.trim()}\n\nEnvoyé depuis Oresto Connect.`
      );

      setTimeout(() => {
        if (rawPhone) {
          window.open(`https://wa.me/${rawPhone}?text=${msg}`, "_blank");
        }
      }, 800);
    } finally {
      setSubmitting(false);
    }
  };

  if (rooms.length === 0) return null;

  return (
    <section id="booking" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="p-6 sm:p-10 rounded-[36px] bg-[#0A0A0A] text-white shadow-2xl space-y-6 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Hotel size={12} />
              Réservation Directe Séjour
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Vérifiez les Disponibilités & Réservez
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Meilleur tarif garanti en direct • Sans commission d'intermédiaire • Confirmation instantanée.
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3 relative z-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-heading font-black text-xl text-white">Réservation Confirmée !</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                Merci {name}, votre séjour pour <strong>{nights} nuit{nights > 1 ? "s" : ""}</strong> dans <strong>{currentRoom?.name}</strong> du {checkIn} au {checkOut} est validé.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-2 px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100"
              >
                Faire une autre réservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-5 relative z-10 text-xs">
              
              {/* Choix de la chambre */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Sélectionnez votre chambre ou suite *
                </label>
                <select
                  value={selectedRoom}
                  onChange={e => setSelectedRoom(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500 focus:bg-[#1A1A1A]"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id} className="bg-gray-900 text-white">
                      {room.name} — {Number(room.price).toLocaleString()} FCFA / nuit
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates de Séjour & Voyageurs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-400" />
                    Date d'arrivée (Check-in) *
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={today}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500"
                  />
                  <span className="text-[9px] text-gray-400 block pl-1">Dès {vendor.check_in_time || "14h00"}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-400" />
                    Date de départ (Check-out) *
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500"
                  />
                  <span className="text-[9px] text-gray-400 block pl-1">Avant {vendor.check_out_time || "11h00"}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Users size={12} className="text-indigo-400" />
                    Voyageurs *
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500 focus:bg-[#1A1A1A]"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n} className="bg-gray-900 text-white">
                        {n} voyageur{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Récapitulatif Tarifaire avec réduction éventuelle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{Number(currentRoom?.price || 0).toLocaleString()} FCFA × {nights} nuit{nights > 1 ? "s" : ""}</span>
                  <span className="font-bold">{originalTotal.toLocaleString()} FCFA</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      Offre Long Séjour ({discountPercent}% de remise)
                    </span>
                    <span>-{discountAmount.toLocaleString()} FCFA</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex items-center justify-between font-heading font-black text-sm text-white">
                  <span>Montant Total du Séjour :</span>
                  <span className="text-indigo-400 text-base">{finalTotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Coordonnées Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Christian Houessou"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Numéro WhatsApp / Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Option de Paiement */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Mode de règlement préféré
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("momo")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentOption === "momo"
                        ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-md"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <i className="fa-solid fa-mobile-screen-button mr-1.5"></i>
                    Acompte Mobile Money
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption("arrival")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentOption === "arrival"
                        ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-md"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <i className="fa-solid fa-money-bill-wave mr-1.5"></i>
                    Paiement à l'arrivée
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>{submitting ? "Traitement de la réservation..." : `Confirmer le Séjour • ${finalTotal.toLocaleString()} FCFA`}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
