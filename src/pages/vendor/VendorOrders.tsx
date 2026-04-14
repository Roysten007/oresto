import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/mockData";

export default function VendorOrders() {
  const { user } = useAuth();
  const orders = mockOrders.filter(o => o.vendorId === (user?.vendorId || "v1"));
  const pending = orders.filter(o => o.status === "pending");
  const preparing = orders.filter(o => o.status === "preparing" || o.status === "delivering");
  const delivered = orders.filter(o => o.status === "delivered");

  const columns = [
    { title: "⏳ En attente", orders: pending, color: "border-t-primary", action: "Accepter" },
    { title: "🔄 En préparation", orders: preparing, color: "border-t-blue-500", action: "Marquer livré" },
    { title: "✅ Livré", orders: delivered, color: "border-t-green-500", action: null },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Commandes</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.title} className={`rounded-2xl bg-muted border-t-4 ${col.color} p-4`}>
            <h3 className="font-heading font-semibold text-foreground mb-4">{col.title} ({col.orders.length})</h3>
            <div className="space-y-3">
              {col.orders.map(order => (
                <div key={order.id} className="p-3 rounded-xl bg-card border border-border">
                  <div className="flex justify-between mb-1">
                    <span className="font-heading text-xs font-bold text-foreground">{order.id}</span>
                    <span className="font-body text-[10px] text-muted-foreground">{new Date(order.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="font-sub text-xs text-foreground">{order.clientName}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{order.items.length} articles</p>
                  <p className="font-heading text-sm font-bold text-primary mt-1">{order.total.toLocaleString()} FCFA</p>
                  {col.action && (
                    <button className="mt-2 w-full py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-sub btn-hover">{col.action}</button>
                  )}
                </div>
              ))}
              {col.orders.length === 0 && <p className="font-body text-xs text-muted-foreground text-center py-4">Aucune commande</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
