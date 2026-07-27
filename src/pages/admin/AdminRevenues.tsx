import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const COMMISSION_RATE = 0.1; // 10 % de commission plateforme (estimation)

export default function AdminRevenues() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsub = onValue(ref(db, "orders"), snap => {
      const data = snap.val();
      setOrders(data ? Object.values(data).filter((o: any) => o.status !== "cancelled") : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const { totalVolume, commission, deliveryRevenue, monthly, topVendors } = useMemo(() => {
    const totalVolume = orders.reduce((s, o) => s + (o.total || 0), 0);
    const deliveryRevenue = orders.reduce((s, o) => s + (o.deliveryFee || 0), 0);
    const commission = Math.round(totalVolume * COMMISSION_RATE);

    // Volume par mois (année en cours)
    const year = new Date().getFullYear();
    const buckets = Array.from({ length: 12 }, (_, i) => ({ month: MONTHS[i], volume: 0 }));
    orders.forEach(o => {
      if (!o.date) return;
      const d = new Date(o.date);
      if (d.getFullYear() === year) buckets[d.getMonth()].volume += o.total || 0;
    });
    const monthly = buckets.slice(0, new Date().getMonth() + 1);

    // Top vendeurs par volume
    const byVendor: Record<string, { name: string; volume: number; orders: number }> = {};
    orders.forEach(o => {
      const key = o.vendorId || o.vendorName || "?";
      if (!byVendor[key]) byVendor[key] = { name: o.vendorName || "Restaurant", volume: 0, orders: 0 };
      byVendor[key].volume += o.total || 0;
      byVendor[key].orders += 1;
    });
    const topVendors = Object.values(byVendor).sort((a, b) => b.volume - a.volume).slice(0, 5);

    return { totalVolume, commission, deliveryRevenue, monthly, topVendors };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Revenus & Finances</h1>
        <p className="font-body text-muted-foreground">Flux financiers de la plateforme (hors commandes annulées).</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Volume total", value: `${totalVolume.toLocaleString()} F` },
          { label: "Commission (10%)", value: `${commission.toLocaleString()} F` },
          { label: "Frais de livraison", value: `${deliveryRevenue.toLocaleString()} F` },
          { label: "Commandes", value: orders.length },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border-l-4 border-l-primary border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body">Chargement...</div>
      ) : (
        <>
          {/* Monthly chart */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <h3 className="font-heading font-semibold text-foreground mb-4">Volume mensuel (FCFA)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly.length ? monthly : [{ month: "—", volume: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} F`, "Volume"]} />
                <Bar dataKey="volume" fill="hsl(25, 100%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top vendors */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <h3 className="font-heading font-semibold text-foreground mb-4">Top restaurants par volume</h3>
            {topVendors.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-6 text-center">Aucune donnée de vente pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {topVendors.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <span className="font-sub text-sm font-semibold text-foreground">{i + 1}. {v.name}</span>
                    <div className="text-right">
                      <p className="font-heading font-bold text-primary text-sm">{v.volume.toLocaleString()} F</p>
                      <p className="font-body text-[10px] text-muted-foreground">{v.orders} commande{v.orders > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
