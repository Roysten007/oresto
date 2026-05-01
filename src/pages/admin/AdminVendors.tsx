import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { VendorProfile } from "@/data/mockData";

export default function AdminVendors() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const vendorsRef = ref(db, 'vendors');
    const unsub = onValue(vendorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVendors(Object.values(data) as VendorProfile[]);
      } else {
        setVendors([]);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-body">Chargement des vendeurs...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Gestion des vendeurs</h1>
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Total", value: vendors.length }, 
          { label: "Actifs", value: vendors.filter(s => s.status === "active").length }, 
          { label: "En attente", value: vendors.filter(s => s.status === "pending").length }
        ].map((s, i) => (
          <div key={i} className="px-4 py-3 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      {vendors.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <span className="text-4xl block mb-4">🏪</span>
          <p className="font-heading text-lg font-semibold text-foreground">Aucun vendeur inscrit</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les vendeurs apparaîtront ici une fois inscrits</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-sub text-muted-foreground">Boutique</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Catégorie</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Ville</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Plan</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-heading text-sm font-semibold text-foreground">{s.name}</td>
                  <td className="p-3 font-body text-foreground">{s.category}</td>
                  <td className="p-3 font-body text-muted-foreground">{s.city}, {s.neighborhood}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-muted">{s.plan?.toUpperCase()}</span></td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${
                      s.status === "active" ? "bg-green-100 text-green-700" : 
                      s.status === "pending" ? "bg-oresto-orange-light text-primary" : 
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {s.status === "active" ? "🟢 Actif" : s.status === "pending" ? "🟡 En attente" : "🔴 Suspendu"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
