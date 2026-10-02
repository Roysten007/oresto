import { useState, useEffect } from "react";
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

  const reviews = (vendor.reviews_list && vendor.reviews_list.length > 0) ? vendor.reviews_list : [];
  
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
            Avis Clients
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
            Avis & Retours d'expérience
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Vous avez commandé ou visité <strong className="text-gray-900">{vendor.name}</strong> ? Soyez le premier à partager votre expérience !
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-black text-white hover:bg-primary font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
            >
              <MessageSquarePlus size={16} />
              <span>Laisser le premier avis</span>
            </button>
          </div>
        </div>

        {/* Modal Laisser un Avis */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-black text-base text-gray-900">Votre Avis sur {vendor.name}</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  aria-label="Fermer la boîte d'avis"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Note globale</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          rating >= s ? "bg-amber-400 text-white border-amber-400 shadow-xs" : "bg-gray-50 text-gray-300 border-gray-200"
                        }`}
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Votre nom *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Jean D."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-bold focus:border-primary outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Votre commentaire *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Qualité des produits, service, rapidité..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-medium focus:border-primary outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-heading font-black uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting ? "Publication en cours..." : "Publier mon avis"}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  }

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
              Avis Clients ({reviews.length})
            </h2>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <span className="font-heading font-black text-base text-gray-900">{avgRating} / 5</span>
              <span className="text-xs text-gray-400 font-medium">({reviews.length} avis client{reviews.length > 1 ? "s" : ""})</span>
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
              className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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
                  {(rev.name || "C").charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </h4>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Avis vérifié</span>
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
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                aria-label="Fermer la boîte d'avis"
              >
                <X size={18} />
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
