import { useState } from "react";
import { Link } from "react-router-dom";
import { mockOrders } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-oresto-orange-light text-primary" },
  preparing: { label: "En préparation", color: "bg-blue-100 text-blue-700" },
  delivering: { label: "En route", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Livré", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulé", color: "bg-destructive/10 text-destructive" },
};

export default function OrdersList() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const orders = mockOrders.filter(o => o.clientId === user?.id);
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Mes commandes</h1>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[{ key: "all", label: "Toutes" }, { key: "pending", label: "En cours" }, { key: "delivered", label: "Livrées" }, { key: "cancelled", label: "Annulées" }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-sub whitespace-nowrap ${filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{f.label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(order => {
          const st = statusLabels[order.status];
          return (
            <div key={order.id} className="p-4 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-sm font-semibold text-foreground">{order.vendorName}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${st.color}`}>{st.label}</span>
              </div>
              <p className="font-body text-xs text-muted-foreground">{order.items.map(i => `${i.qty}x ${i.name}`).join(", ")}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-heading font-bold text-sm text-foreground">{order.total.toLocaleString()} FCFA</span>
                <div className="flex gap-2">
                  <Link to={`/app/order/${order.id}`} className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-sub btn-hover">Voir</Link>
                  {order.status === "delivered" && <Link to={`/app/rate/${order.id}`} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sub btn-hover">Noter</Link>}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center font-body text-muted-foreground py-8">Aucune commande</p>}
      </div>
    </div>
  );
}
