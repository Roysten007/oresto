import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, Smile, Meh, Frown, Zap, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, set, get, update } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const RATING_ROWS = [
  { key: "quality" as const, label: "Qualité des plats", icon: Heart, color: "text-rose-500" },
  { key: "speed"   as const, label: "Rapidité",          icon: Zap,   color: "text-amber-500" },
  { key: "service" as const, label: "Service client",    icon: Smile, color: "text-blue-500" },
];

function StarRow({ label, icon: Icon, color, value, onChange }: {
  label: string; icon: any; color: string; value: number; onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className={color} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
        {value > 0 && (
          <span className="ml-auto text-[9px] font-black uppercase text-primary">
            {["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent"][value]}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < (hovered || value);
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.75 }}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(i + 1)}
              className="relative p-1"
            >
              <Star
                size={32}
                className={`transition-all duration-200 ${filled ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]" : "text-gray-100"}`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function RateOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ratings, setRatings] = useState({ quality: 0, speed: 0, service: 0 });
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{ vendorId?: string; vendorName?: string } | null>(null);

  useEffect(() => {
    if (!db || !orderId) return;
    get(ref(db, `orders/${orderId}`)).then(snap => {
      if (snap.exists()) {
        const data = snap.val();
        setOrderInfo({ vendorId: data.vendorId, vendorName: data.vendorName });
      }
    });
  }, [orderId]);

  const avg = (ratings.quality + ratings.speed + ratings.service) / 3;
  const canSubmit = ratings.quality > 0 && ratings.speed > 0 && ratings.service > 0;

  const MoodIcon = () => {
    if (avg === 0) return <Meh size={48} className="text-gray-200" />;
    if (avg <= 2) return <Frown size={48} className="text-red-400" />;
    if (avg <= 3.5) return <Meh size={48} className="text-amber-400" />;
    return <Smile size={48} className="text-primary" />;
  };

  const handleSubmit = async () => {
    if (!canSubmit || !user || !db || !orderId) return;
    setIsSubmitting(true);
    try {
      // Save review
      await set(ref(db, `reviews/${orderId}`), {
        clientId: user.id,
        clientName: `${user.firstName || ""} ${user.name || ""}`.trim(),
        vendorId: orderInfo?.vendorId || "",
        orderId,
        ratings,
        average: parseFloat(avg.toFixed(1)),
        comment: comment.trim(),
        isPublic,
        date: new Date().toISOString(),
      });

      // Mark order as rated
      await update(ref(db, `orders/${orderId}`), { isRated: true });

      // Update vendor average rating
      if (orderInfo?.vendorId) {
        const reviewsSnap = await get(ref(db, "reviews"));
        if (reviewsSnap.exists()) {
          const allReviews = Object.values(reviewsSnap.val()) as any[];
          const vendorReviews = allReviews.filter((r: any) => r.vendorId === orderInfo.vendorId);
          const newAvg = vendorReviews.reduce((s: number, r: any) => s + r.average, 0) / vendorReviews.length;
          await update(ref(db, `vendors/${orderInfo.vendorId}`), {
            rating: parseFloat(newAvg.toFixed(1)),
            reviewCount: vendorReviews.length,
          });
        }
      }

      setSubmitted(true);
      toast.success("Merci pour votre avis !");
      setTimeout(() => navigate("/app/orders"), 2500);
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] p-8 text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <Check size={64} className="text-primary" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Merci !</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Votre avis aide la communauté Oresto</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-90 transition-all border border-gray-100">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-black text-sm uppercase tracking-tight">Évaluer ma commande</h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {orderInfo?.vendorName || `Commande #${orderId?.slice(-8)}`}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-8">
        {/* Mood visual */}
        <div className="flex flex-col items-center py-10 space-y-4 bg-white rounded-[48px] border border-gray-50 shadow-sm">
          <motion.div
            key={Math.round(avg)}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center shadow-inner"
          >
            <MoodIcon />
          </motion.div>
          <div className="text-center">
            <p className="font-black text-2xl">{avg > 0 ? `${avg.toFixed(1)} / 5` : "—"}</p>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Votre satisfaction globale</p>
          </div>
        </div>

        {/* Star ratings */}
        <div className="bg-white rounded-[40px] border border-gray-50 shadow-sm p-6 space-y-8">
          {RATING_ROWS.map(row => (
            <StarRow
              key={row.key}
              label={row.label}
              icon={row.icon}
              color={row.color}
              value={ratings[row.key]}
              onChange={v => setRatings(p => ({ ...p, [row.key]: v }))}
            />
          ))}
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Commentaire (optionnel)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            placeholder="Partagez votre expérience... Les restaurateurs lisent vos avis !"
            className="w-full p-5 rounded-[32px] bg-white border border-gray-100 shadow-sm outline-none text-sm font-medium leading-relaxed focus:border-primary/30 transition-all resize-none"
          />
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center gap-3 px-2">
          <button 
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${isPublic ? "bg-primary" : "bg-gray-200"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-0"}`} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest">{isPublic ? "Avis Publique" : "Avis Privé"}</p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              {isPublic ? "Visible par tous les clients" : "Visible uniquement par le vendeur"}
            </p>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-3 ${
            canSubmit && !isSubmitting
              ? "bg-black text-white hover:bg-primary"
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Check size={18} /> Publier mon avis</>
          )}
        </motion.button>

        {!canSubmit && (
          <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Évaluez les 3 critères pour continuer
          </p>
        )}

        <button onClick={() => navigate("/app/orders")} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-600 transition-colors py-2">
          Passer pour l'instant
        </button>
      </div>
    </div>
  );
}
