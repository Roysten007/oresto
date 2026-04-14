import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Camera } from "lucide-react";

export default function RateOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({ quality: 0, speed: 0, service: 0 });
  const [comment, setComment] = useState("");

  const setRating = (key: keyof typeof ratings, val: number) => setRatings(prev => ({ ...prev, [key]: val }));

  const ratingRows = [
    { key: "quality" as const, label: "⭐ Qualité du produit" },
    { key: "speed" as const, label: "⚡ Rapidité de livraison" },
    { key: "service" as const, label: "🤝 Service client" },
  ];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Notez votre expérience</h1>
      <p className="font-body text-sm text-muted-foreground">Commande #{orderId}</p>

      <div className="space-y-6">
        {ratingRows.map(row => (
          <div key={row.key}>
            <p className="font-sub text-sm font-medium text-foreground mb-2">{row.label}</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setRating(row.key, i + 1)}>
                  <Star size={28} className={i < ratings[row.key] ? "fill-primary text-primary" : "text-border"} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="font-sub text-sm font-medium text-foreground block mb-1">Commentaire (optionnel)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Partagez votre expérience..."
          className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none resize-none" />
      </div>

      <div className="p-4 rounded-2xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary transition-colors">
        <Camera size={20} />
        <span className="font-sub text-sm">Ajouter une photo (optionnel)</span>
      </div>

      <button onClick={() => navigate("/app/orders")} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
        Publier mon avis
      </button>
      <button onClick={() => navigate("/app/orders")} className="w-full text-center font-sub text-sm text-muted-foreground hover:text-foreground">
        Ignorer
      </button>
    </div>
  );
}
