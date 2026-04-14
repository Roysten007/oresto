import { useState } from "react";
import { Link } from "react-router-dom";
import { mockShops, categories } from "@/data/mockData";
import { Search, Heart } from "lucide-react";

export default function ClientSearch() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const filters = ["Tous", ...categories.map(c => c.label), "⭐ 4+", "Ouvert", "Vérifié"];

  const toggleFilter = (f: string) => {
    if (f === "Tous") { setActiveFilters([]); return; }
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const filtered = mockShops.filter(s => {
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (activeFilters.includes("Ouvert") && !s.open) return false;
    if (activeFilters.includes("Vérifié") && !s.verified) return false;
    if (activeFilters.includes("⭐ 4+") && s.rating < 4) return false;
    const catFilter = activeFilters.find(f => categories.some(c => c.label === f));
    if (catFilter && s.category !== catFilter) return false;
    return true;
  });

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted">
        <Search size={18} className="text-muted-foreground" />
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Que cherchez-vous ?"
          className="bg-transparent w-full font-body text-foreground outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {filters.map(f => (
          <button key={f} onClick={() => toggleFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-sub whitespace-nowrap transition-colors ${
              (f === "Tous" && activeFilters.length === 0) || activeFilters.includes(f)
                ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{f}</button>
        ))}
      </div>

      <p className="font-sub text-sm text-muted-foreground">{filtered.length} résultats trouvés</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(shop => (
          <Link key={shop.id} to={`/app/shop/${shop.id}`} className="card-hover rounded-2xl bg-card border border-border overflow-hidden">
            <img src={shop.coverImage} alt={shop.name} className="w-full h-32 object-cover" loading="lazy" />
            <div className="p-3">
              <h3 className="font-heading font-semibold text-sm text-foreground">{shop.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs font-body text-muted-foreground">
                <span>⭐ {shop.rating}</span>
                <span>📍 {shop.city}</span>
                <span>{shop.open ? "🟢 Ouvert" : "🔴 Fermé"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
