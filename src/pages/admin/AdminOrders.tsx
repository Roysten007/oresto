import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-orange-100 text-orange-700" },
  preparing: { label: "Préparation", cls: "bg-blue-100 text-blue-700" },
  delivering: { label: "En route", cls: "bg-purple-100 text-purple-700" },
  delivered: { label: "Livré", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulé", cls: "bg-destructive/10 text-destructive" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsub = onValue(ref(db, "orders"), snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, v]: [string, any]) => ({ id, ...v }))
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setOrders(list);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const revenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Toutes les commandes</h1>
        <p className="font-body text-muted-foreground">Visualisez l'ensemble des transactions sur la plateforme.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Total", value: orders.length },
          { label: "Livrées", value: orders.filter(o => o.status === "delivered").length },
          { label: "En cours", value: orders.filter(o => ["pending", "preparing", "delivering"].includes(o.status)).length },
          { label: "Volume (FCFA)", value: revenue.toLocaleString() },
        ].map((s, i) => (
          <div key={i} className="px-4 py-3 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Toutes" },
          { key: "pending", label: "En attente" },
          { key: "preparing", label: "Préparation" },
          { key: "delivering", label: "En route" },
          { key: "delivered", label: "Livrées" },
          { key: "cancelled", label: "Annulées" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-sub font-semibold transition-colors ${
              filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body">Chargement des commandes...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <i className="fa-solid fa-box-open text-5xl text-primary/40 mb-4 block"></i>
          <p className="font-heading text-lg font-semibold text-foreground">Aucune commande</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les commandes apparaîtront ici dès les premières ventes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-sub text-muted-foreground">Commande</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Client</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Restaurant</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Date</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Total</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const st = STATUS[o.status] || STATUS.pending;
                return (
                  <tr key={o.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3 font-mono text-xs text-muted-foreground">#{o.id.slice(-8)}</td>
                    <td className="p-3 font-heading text-sm font-semibold text-foreground">{o.clientName || "—"}</td>
                    <td className="p-3 font-body text-foreground">{o.vendorName || "—"}</td>
                    <td className="p-3 font-body text-muted-foreground">{o.date ? new Date(o.date).toLocaleDateString("fr-FR") : "—"}</td>
                    <td className="p-3 font-heading font-bold text-primary">{(o.total || 0).toLocaleString()} F</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${st.cls}`}>{st.label}</span>
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
