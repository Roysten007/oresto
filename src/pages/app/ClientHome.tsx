import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockShops, categories } from "@/data/mockData";
import { Search, MapPin, Heart } from "lucide-react";

function ShopCard({ shop }: { shop: typeof mockShops[0] }) {
  const [fav, setFav] = useState(false);
  return (
    <Link to={`/app/shop/${shop.id}`} className="card-hover rounded-2xl bg-card border border-border overflow-hidden block min-w-[260px]">
      <div className="relative">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-36 object-cover" loading="lazy" />
        <button onClick={e => { e.preventDefault(); setFav(!fav); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
          <Heart size={16} className={fav ? "fill-primary text-primary" : "text-muted-foreground"} />
        </button>
        {shop.verified && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-sub">✅ Vérifié</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-xs font-bold flex-shrink-0">
            {shop.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate">{shop.name}</h3>
            <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-sub">{shop.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs font-body text-muted-foreground">
          <span>⭐ {shop.rating} ({shop.reviewCount})</span>
          <span>📍 {shop.neighborhood}</span>
          <span>🚀 {shop.deliveryTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ClientHome() {
  const { user } = useAuth();
  const nearYou = mockShops.filter(s => s.status === "active").slice(0, 6);
  const topRated = [...mockShops].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const openNow = mockShops.filter(s => s.open).slice(0, 6);

  return (
    <div className="px-4 py-6 space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Bonjour {user?.firstName} 👋</h1>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm font-sub">
            <MapPin size={14} /> <span>{user?.city || "Cotonou"}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <Link to="/app/search" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted">
        <Search size={18} className="text-muted-foreground" />
        <span className="font-body text-muted-foreground text-sm">Que cherchez-vous ?</span>
      </Link>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((cat, i) => (
          <Link key={i} to={`/app/search?cat=${cat.label}`} className="flex flex-col items-center gap-1 min-w-[64px]">
            <div className="w-12 h-12 rounded-2xl bg-oresto-orange-light flex items-center justify-center text-lg">{cat.icon}</div>
            <span className="text-[10px] font-sub text-muted-foreground">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* Sections */}
      {[
        { title: "Près de vous", shops: nearYou },
        { title: "Les mieux notés ⭐", shops: topRated },
        { title: "Ouverts maintenant 🟢", shops: openNow },
      ].map(section => (
        <div key={section.title}>
          <h2 className="font-heading font-bold text-lg text-foreground mb-4">{section.title}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {section.shops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
