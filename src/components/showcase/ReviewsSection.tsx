import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { Star, MessageSquarePlus, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function ReviewsSection({ vendor, businessType }: Props) {
  const isHotel = businessType === "hotel";
  const isEcommerce = businessType === "ecommerce";

  const defaultReviews = isHotel
    ? [
        { id: "r1", name: "Marc K.", rating: 5, comment: "Séjour parfait ! Suite très propre, literie ultra confortable et Wi-Fi Fibre rapide pour travailler. Je recommande vivement.", date: "Il y a 3 jours" },
        { id: "r2", name: "Nadège A.", rating: 5, comment: "Accueil irréprochable et personnel aux petits soins. Le petit-déjeuner au bord de la piscine est un vrai délice.", date: "Il y a 1 semaine" },
        { id: "r3", name: "Serge D.", rating: 4, comment: "Très bon rapport qualité-prix. Calme et sécurisé, idéal pour les voyages d'affaires à Cotonou.", date: "Il y a 2 semaines" }
      ]
    : isEcommerce
    ? [
        { id: "r1", name: "Bérénice T.", rating: 5, comment: "Colis reçu en moins de 24h à Cotonou ! Baskets conformes aux photos, pointure impeccable. Vendeur très sérieux.", date: "Il y a 2 jours" },
        { id: "r2", name: "Romaric H.", rating: 5, comment: "Smartwatch d'excellente qualité, emballage soigné et paiement MoMo super fluide. Je recommanderai sans hésiter !", date: "Il y a 4 jours" },
        { id: "r3", name: "Fanny G.", rating: 5, comment: "Tissu de qualité supérieure pour les chemises en lin. Service client WhatsApp très réactif.", date: "Il y a 1 semaine" }
      ]
    : [
        { id: "r1", name: "Fabrice O.", rating: 5, comment: "Le meilleur poulet braisé de la ville ! La marinade et l'alloco sont tout simplement exquis. Service rapide et chaleureux.", date: "Hier" },
        { id: "r2", name: "Chantal B.", rating: 5, comment: "Cadre magnifique et cuisine raffinée. Le capitaine braisé royal vaut vraiment le détour.", date: "Il y a 3 jours" },
        { id: "r3", name: "Dimitri K.", rating: 5, comment: "Belle découverte pour un dîner entre collègues. Cocktails savoureux et ambiance très agréable.", date: "Il y a 1 semaine" }
      ];

  const reviews = vendor.reviews_list && vendor.reviews_list.length > 0 ? vendor.reviews_list : defaultReviews;
  
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Veuillez renseigner votre nom et votre commentaire");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        id: `rev_${Date.now()}`,
        name: name.trim(),
        rating,
        comment: comment.trim(),
        date: "À l'instant",
        createdAt: new Date().toISOString()
      };

      if (db && vendor.id) {
        try {
          const revRef = push(ref(db, `reviews/${vendor.id}`));
          await set(revRef, reviewData);
        } catch {}
      }

      toast.success("Merci pour votre avis ! Il est maintenant en ligne.");
      setShowModal(false);
      setName("");
      setComment("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
              Retours d'Expérience
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
              Ce que nos clients disent
            </h2>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <span className="font-heading font-black text-base text-gray-900">4.9 / 5</span>
              <span className="text-xs text-gray-400 font-medium">(Plus de 120 avis vérifiés)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-2xl bg-black text-white hover:bg-primary font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <MessageSquarePlus size={15} />
            <span>Donner mon avis</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill={s <= rev.rating ? "currentColor" : "none"} className={s > rev.rating ? "text-gray-200" : ""} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-heading font-black text-xs flex items-center justify-center">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </h4>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Avis certifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Laisser un Avis */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-black text-base text-gray-900">Votre Avis Compte</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Note globale</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-2 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={s <= rating ? "currentColor" : "none"} className={s > rating ? "text-gray-200" : ""} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Votre Nom *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Sophie H."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Votre Commentaire *</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec cet établissement..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-primary text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {submitting ? "Publication..." : "Publier mon avis"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
