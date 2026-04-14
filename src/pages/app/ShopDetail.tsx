import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockShops, mockProducts, mockReviews } from "@/data/mockData";
import { Star, MapPin, Phone, MessageCircle, Share2, ShoppingCart } from "lucide-react";

export default function ShopDetail() {
  const { id } = useParams();
  const shop = mockShops.find(s => s.id === id);
  const [tab, setTab] = useState<"catalogue" | "avis" | "infos">("catalogue");
  const products = mockProducts.filter(p => p.vendorId === id);
  const reviews = mockReviews.filter(r => r.shopId === id);

  if (!shop) return <div className="p-8 text-center font-body text-muted-foreground">Boutique introuvable</div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : shop.rating;

  return (
    <div className="pb-8">
      <div className="relative">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-48 object-cover" />
        <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg border-4 border-background">
          {shop.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="px-4 pt-10 space-y-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{shop.name}</h1>
          <span className="inline-block px-3 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-sub mt-1">{shop.category}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-body text-muted-foreground">
          <span>⭐ {avgRating} ({reviews.length || shop.reviewCount} avis)</span>
          <span><MapPin size={14} className="inline" /> {shop.neighborhood}, {shop.city}</span>
          <span>🚀 {shop.deliveryTime}</span>
          {shop.verified && <span className="text-primary">✅ Vérifié</span>}
        </div>

        <div className="flex items-center gap-2 text-sm font-sub">
          <span className={shop.open ? "text-green-600" : "text-destructive"}>{shop.open ? `🟢 Ouvert · Ferme à ${shop.closingTime}` : "🔴 Fermé"}</span>
        </div>

        <div className="flex gap-2">
          <Link to="/app/cart" className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-sub text-sm text-center btn-hover">
            <ShoppingCart size={14} className="inline mr-1" /> Commander
          </Link>
          <button className="px-4 py-2.5 rounded-full border border-border text-foreground btn-hover"><Phone size={14} /></button>
          <button className="px-4 py-2.5 rounded-full border border-border text-foreground btn-hover"><MessageCircle size={14} /></button>
          <button className="px-4 py-2.5 rounded-full border border-border text-foreground btn-hover"><Share2 size={14} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border">
          {(["catalogue", "avis", "infos"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 font-sub text-sm capitalize transition-colors ${tab === t ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}>
              {t === "catalogue" ? "Catalogue" : t === "avis" ? "Avis" : "Infos"}
            </button>
          ))}
        </div>

        {tab === "catalogue" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="card-hover rounded-2xl bg-card border border-border overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-32 object-cover" loading="lazy" />
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-sm text-foreground">{p.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-heading font-bold text-foreground">{p.price.toLocaleString()} FCFA</span>
                    <button className={`px-3 py-1.5 rounded-full text-xs font-sub btn-hover ${p.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                      disabled={!p.available}>
                      {p.available ? "Ajouter" : "Indisponible"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="font-body text-muted-foreground col-span-2 text-center py-8">Aucun produit disponible</p>}
          </div>
        )}

        {tab === "avis" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted">
              <span className="font-heading text-4xl font-bold text-foreground">{avgRating}</span>
              <div>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < Math.round(Number(avgRating)) ? "fill-primary text-primary" : "text-muted-foreground"} />)}</div>
                <span className="font-body text-xs text-muted-foreground">{reviews.length || shop.reviewCount} avis</span>
              </div>
            </div>
            {reviews.map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-heading font-bold text-primary">{r.userName[0]}</div>
                  <div>
                    <span className="font-sub text-sm font-medium text-foreground">{r.userName}</span>
                    <span className="text-xs text-muted-foreground ml-2">{r.date}</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"} />)}</div>
                <p className="font-body text-sm text-foreground">{r.comment}</p>
                {r.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-primary">
                    <p className="font-body text-sm text-muted-foreground">{r.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "infos" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-2">Adresse</h3>
              <p className="font-body text-muted-foreground">{shop.neighborhood}, {shop.city}, {shop.country}</p>
              <div className="mt-3 h-40 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-body text-sm">📍 Carte</div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-2">Contact</h3>
              <p className="font-body text-sm text-muted-foreground">📞 {shop.phone}</p>
              <p className="font-body text-sm text-muted-foreground">💬 WhatsApp: {shop.whatsapp}</p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-2">Description</h3>
              <p className="font-body text-muted-foreground">{shop.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
