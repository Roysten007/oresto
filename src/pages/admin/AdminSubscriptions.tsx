import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { VendorProfile } from "@/data/mockData";

const PLAN_PRICE = 5000;

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

  const trialCount = vendors.filter(v => (!v.subscriptionStatus || v.subscriptionStatus === "trial")).length;
  const activeCount = vendors.filter(v => v.subscriptionStatus === "active").length;
  const pendingCount = vendors.filter(v => v.subscriptionStatus === "pending_payment").length;
  const blockedCount = vendors.filter(v => v.subscriptionStatus === "blocked" || v.subscriptionStatus === "restricted").length;

  // MRR prévisionnel standard (5 000 F / boutique)
  const mrr = (trialCount + activeCount + pendingCount) * PLAN_PRICE;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Abonnements SaaS Commerçants</h1>
        <p className="font-body text-muted-foreground text-sm">Formule unique Oresto Pro (5 000 FCFA/mois — -50% 1er mois = 2 500 F).</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MRR Prévisionnel (5 000 F/btq)", value: `${mrr.toLocaleString()} F` },
          { label: "Essais Gratuits (Lancement)", value: trialCount },
          { label: "En Période de Grâce", value: pendingCount },
          { label: "Boutiques Bloquées", value: blockedCount },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border">
            <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body">Chargement des abonnements...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <i className="fa-solid fa-credit-card text-5xl text-primary/40 mb-4 block"></i>
          <p className="font-heading text-lg font-semibold text-foreground">Aucun abonnement</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les abonnements apparaîtront dès l'inscription de nouveaux commerçants.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left">
                <th className="p-4 font-sub text-xs uppercase tracking-widest text-muted-foreground">Établissement</th>
                <th className="p-4 font-sub text-xs uppercase tracking-widest text-muted-foreground">Formule</th>
                <th className="p-4 font-sub text-xs uppercase tracking-widest text-muted-foreground">Tarif</th>
                <th className="p-4 font-sub text-xs uppercase tracking-widest text-muted-foreground">Statut d'Abonnement</th>
                <th className="p-4 font-sub text-xs uppercase tracking-widest text-muted-foreground">Prochaine Échéance</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => {
                const subStatus = v.subscriptionStatus || "trial";
                const dueDate = v.nextBillingDate || v.trialEndsAt;
                const isFirst = !v.paymentHistory || v.paymentHistory.length === 0;

                return (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-heading font-bold text-foreground">{v.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-sub bg-primary/10 text-primary border border-primary/20 font-bold">
                        Oresto Pro
                      </span>
                    </td>
                    <td className="p-4 font-heading font-bold text-foreground">
                      {isFirst ? "2 500 F (1er mois)" : "5 000 F/mois"}
                    </td>
                    <td className="p-4 font-body">
                      {subStatus === "trial" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                          🎉 Essai gratuit (Oct. 2026)
                        </span>
                      )}
                      {subStatus === "active" && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs">
                          🟢 Actif
                        </span>
                      )}
                      {subStatus === "pending_payment" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs">
                          🟡 Grâce (3 jours)
                        </span>
                      )}
                      {(subStatus === "blocked" || subStatus === "restricted") && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 font-bold text-xs">
                          🔴 Bloqué (Impayé)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">
                      {dueDate ? new Date(dueDate).toLocaleDateString('fr-FR') : "—"}
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
