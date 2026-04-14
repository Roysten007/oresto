import { useState } from "react";
import { mockShops } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [favIds] = useState(["v1", "v3", "v5"]);
  const favShops = mockShops.filter(s => favIds.includes(s.id));

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Mes favoris</h1>
      {favShops.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="font-body text-muted-foreground">Aucun favori pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favShops.map(shop => (
            <Link key={shop.id} to={`/app/shop/${shop.id}`} className="card-hover rounded-2xl bg-card border border-border overflow-hidden">
              <img src={shop.coverImage} alt={shop.name} className="w-full h-32 object-cover" loading="lazy" />
              <div className="p-3">
                <h3 className="font-heading font-semibold text-sm text-foreground">{shop.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs font-body text-muted-foreground">
                  <span>⭐ {shop.rating}</span>
                  <span>📍 {shop.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
