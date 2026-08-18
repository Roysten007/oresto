import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { Calendar, Clock, Users, Utensils, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";

interface Props {
  vendor: VendorProfile;
}

export default function TableReservationWidget({ vendor }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("19:30");
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState<"indoor" | "terrace" | "vip">("terrace");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Veuillez renseigner votre nom et numéro de téléphone");
      return;
    }

    setSubmitting(true);
    try {
      const reservationData = {
        id: `res_${Date.now()}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        clientName: name.trim(),
        clientPhone: phone.trim(),
        date,
        time,
        guests: Number(guests),
        seating: seating === "terrace" ? "Terrasse" : seating === "vip" ? "Salon VIP" : "Salle Climatisée",
        notes: notes.trim(),
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      // Sauvegarde Firebase
      if (db && vendor.id) {
        try {
          const resRef = push(ref(db, `reservations/${vendor.id}`));
          await set(resRef, reservationData);
        } catch {}
      }

      setSuccess(true);
      toast.success("Réservation envoyée avec succès !");

      // Redirection WhatsApp
      const rawPhone = (vendor.whatsapp || vendor.phone || "").replace(/\D/g, "");
      const seatingLabel = seating === "terrace" ? "Terrasse" : seating === "vip" ? "Salon VIP" : "Salle Climatisée";
      const msg = encodeURIComponent(
        `Bonjour *${vendor.name}* !\nJe souhaite réserver une table :\n\n📅 *Date :* ${date}\n⏰ *Heure :* ${time}\n👥 *Couverts :* ${guests} personnes\n📍 *Emplacement :* ${seatingLabel}\n👤 *Nom :* ${name.trim()}\n📞 *Tél :* ${phone.trim()}${notes ? `\n💬 *Notes :* ${notes}` : ""}\n\nEnvoyé depuis Oresto Connect.`
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

  return (
    <section id="reservation" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="p-6 sm:p-10 rounded-[36px] bg-[#0A0A0A] text-white shadow-2xl space-y-6 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Utensils size={12} />
              Service en Salle & Terrasse
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Réservez Votre Table en 2 Minutes
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Garantissez votre place pour vos déjeuners d'affaires, dîners en amoureux ou repas de groupe.
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3 relative z-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-heading font-black text-xl text-white">Réservation Confirmée !</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                Merci {name}, votre table pour {guests} personnes le {date} à {time} a bien été enregistrée. Une confirmation vous est transmise sur WhatsApp.
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
            <form onSubmit={handleBooking} className="space-y-4 relative z-10 text-xs">
              
              {/* Row 1 : Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary" />
                    Date du repas *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-primary focus:bg-white/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" />
                    Heure d'arrivée *
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-primary focus:bg-white/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Users size={12} className="text-primary" />
                    Nombre de personnes *
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-primary focus:bg-[#1A1A1A]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(n => (
                      <option key={n} value={n} className="bg-gray-900 text-white">
                        {n} personne{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emplacement souhaité */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Emplacement préféré
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "terrace", label: "Terrasse Aérée", icon: "fa-solid fa-umbrella-beach" },
                    { id: "indoor", label: "Salle Climatisée", icon: "fa-solid fa-snowflake" },
                    { id: "vip", label: "Salon Privé / VIP", icon: "fa-solid fa-crown" }
                  ].map(seat => (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => setSeating(seat.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                        seating === seat.id
                          ? "bg-primary text-white border-primary shadow-md"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <i className={seat.icon}></i>
                      <span className="font-bold text-[10px]">{seat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2 : Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Votre Nom complet *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Armel Soglo"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-primary"
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
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Demande particulière (Optionnel)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Anniversaire, table isolée, chaise bébé..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-medium outline-none focus:border-primary"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>{submitting ? "Enregistrement en cours..." : "Confirmer ma Réservation de Table"}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
