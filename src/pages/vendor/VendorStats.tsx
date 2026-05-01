import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorStats() {
  const { orders } = useOrders();
  const { vendorProfile } = useAuth();

  const validOrders = useMemo(() => orders.filter(o => o.status !== "cancelled"), [orders]);

  const stats = useMemo(() => {
    const totalOrders = validOrders.length;
    const totalRevenue = validOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Weekly breakdown (last 7 days)
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const dayOrders = validOrders.filter(o => {
        const od = new Date(o.date);
        return od >= d && od < nextD;
      });

      weeklyData.push({
        day: dayNames[d.getDay()],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((acc, o) => acc + (o.total || 0), 0)
      });
    }

    return { totalOrders, totalRevenue, avgOrder, weeklyData };
  }, [validOrders]);

  const metrics = [
    { label: "Total commandes", value: (stats.totalOrders || 0).toLocaleString() },
    { label: "Total revenus", value: `${(stats.totalRevenue || 0).toLocaleString()} FCFA` },
    { label: "Panier moyen", value: `${(stats.avgOrder || 0).toLocaleString()} FCFA` },
    { label: "Note moyenne", value: vendorProfile?.rating?.toFixed(1) || "4.8" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-black text-foreground uppercase tracking-tight">Statistiques</h1>
        <div className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Cette Semaine
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="p-6 rounded-[32px] bg-card border border-border shadow-sm">
            <p className="font-heading text-2xl font-black text-foreground">{m.value}</p>
            <p className="font-sub text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm">
          <h3 className="font-heading font-black text-lg text-foreground mb-8 uppercase tracking-tight">Commandes (7j)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm">
          <h3 className="font-heading font-black text-lg text-foreground mb-8 uppercase tracking-tight">Revenus (7j)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
