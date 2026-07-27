import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { UtensilsCrossed } from "lucide-react";

export default function AdminCategories() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsub = onValue(ref(db, "products"), snap => {
      const data = snap.val();
      setProducts(data ? Object.values(data) : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p: any) => {
      const c = (p.category || "Autres").trim() || "Autres";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Catégories</h1>
        <p className="font-body text-muted-foreground">Catégories de plats utilisées par les restaurants sur la plateforme.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body">Chargement...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <UtensilsCrossed size={40} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="font-heading text-lg font-semibold text-foreground">Aucune catégorie</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les catégories apparaîtront dès que les restaurants ajouteront des plats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(([cat, count]) => (
            <div key={cat} className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-foreground">{cat}</p>
                <p className="font-sub text-xs text-muted-foreground mt-1">{count} plat{count > 1 ? "s" : ""}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <UtensilsCrossed size={18} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
