import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { VendorProfile } from "@/data/mockData";

const PLAN_PRICE: Record<string, number> = { starter: 10000, pro: 25000, premium: 50000 };
const PLAN_LABEL: Record<string, string> = { starter: "Starter", pro: "Pro", premium: "Premium" };
const PLAN_CLS: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  pro: "bg-blue-100 text-blue-700",
  premium: "bg-primary/10 text-primary",
};

export default function AdminSubscriptions() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsub = onValue(ref(db, "vendors"), snap => {
      const data = snap.val();
      setVendors(data ? Object.entries(data).map(([id, v]: [string, any]) => ({ ...v, id })) : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const counts: Record<string, number> = { starter: 0, pro: 0, premium: 0 };
  vendors.forEach(v => { const p = v.plan || "starter"; if (counts[p] !== undefined) counts[p]++; });
  const mrr = vendors.reduce((s, v) => s + (PLAN_PRICE[v.plan || "starter"] || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Abonnements vendeurs</h1>
        <p className="font-body text-muted-foreground">Plans et revenus récurrents des boutiques partenaires.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Revenu mensuel (MRR)", value: `${mrr.toLocaleString()} F` },
          { label: "Starter", value: counts.starter },
          { label: "Pro", value: counts.pro },
          { label: "Premium", value: counts.premium },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body">Chargement...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <i className="fa-solid fa-credit-card text-5xl text-primary/40 mb-4 block"></i>
          <p className="font-heading text-lg font-semibold text-foreground">Aucun abonnement</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les abonnements apparaîtront dès l'inscription de vendeurs.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-sub text-muted-foreground">Boutique</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Plan</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Tarif / mois</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => {
                const plan = v.plan || "starter";
                return (
                  <tr key={v.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3 font-heading text-sm font-semibold text-foreground">{v.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${PLAN_CLS[plan] || PLAN_CLS.starter}`}>
                        {PLAN_LABEL[plan] || plan}
                      </span>
                    </td>
                    <td className="p-3 font-heading font-bold text-foreground">{(PLAN_PRICE[plan] || 0).toLocaleString()} F</td>
                    <td className="p-3 font-body text-muted-foreground">
                      {v.status === "active" ? "🟢 Actif" : v.status === "pending" ? "🟡 En attente" : "🔴 Suspendu"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
