import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Bell,
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function VendorDashboard() {
  const { vendorProfile, user } = useAuth();
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Filter valid orders (not cancelled)
  const validOrders = orders.filter(o => o.status !== "cancelled");
  
  // Today's date boundary
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Today's stats
  const todayOrders = validOrders.filter(o => new Date(o.date) >= todayStart);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  
  // Unique clients count (all-time)
  const uniqueClients = new Set(validOrders.map(o => o.clientId)).size;

  // Calculate Weekly Data for the chart (last 7 days)
  const weeklyData = [];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const dayRevenue = validOrders
      .filter(o => {
        const od = new Date(o.date);
        return od >= d && od < nextD;
      })
      .reduce((s, o) => s + (o.total || 0), 0);

    weeklyData.push({
      name: dayNames[d.getDay()],
      revenue: dayRevenue
    });
  }

  // Weekly Revenue calculation (sum of all revenue in weeklyData)
  const weeklyRevenue = weeklyData.reduce((s, d) => s + d.revenue, 0);

  const kpis = [
    {
      label: "Chiffre d'Affaires (7j)",
      value: `${weeklyRevenue.toLocaleString()} FCFA`,
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Commandes Live",
      value: String(todayOrders.length),
      trend: "Aujourd'hui",
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      label: "Nouveaux Clients",
      value: String(uniqueClients),
      trend: "Total",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Satisfaction",
      value: vendorProfile?.rating ? `${vendorProfile.rating}/5` : "4.8/5",
      trend: "Stable",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Command <span className="text-primary">Center</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Opérationnel • {vendorProfile?.name || "Votre Boutique"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-3 rounded-2xl bg-card border border-border hover:bg-muted transition-colors">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
          </button>
          <div className="h-10 w-px bg-border mx-2 hidden md:block" />
          <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl">
            <Calendar size={18} className="text-muted-foreground" />
            <span className="font-sub text-sm font-semibold">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="group relative overflow-hidden p-6 rounded-[32px] bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                <kpi.icon size={24} className={kpi.color} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={10} /> {kpi.trend}
              </div>
            </div>
            <p className="font-heading text-2xl font-black text-foreground">{kpi.value}</p>
            <p className="font-sub text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">Performance</h3>
              <p className="font-sub text-sm text-muted-foreground">Volume d'affaires hebdomadaire</p>
            </div>
            <select className="bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs font-sub focus:outline-none">
              <option>7 derniers jours</option>
              <option>Mois en cours</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl font-bold text-foreground">Flux Direct</h3>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Temps Réel
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <ShoppingBag className="text-muted-foreground opacity-20 mb-4" size={32} />
                <p className="font-sub text-sm text-muted-foreground italic">En attente de commandes...</p>
              </div>
            ) : (
              orders.slice(0, 8).map((order, idx) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-lg shadow-sm">
                    {idx % 2 === 0 ? "🍗" : "🥤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-bold truncate">{order.clientName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(order.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <p className="font-heading text-sm font-black text-primary">
                    {order.total.toLocaleString()} F
                  </p>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => navigate("/vendor/orders")}
            className="mt-6 w-full py-4 rounded-2xl bg-muted border border-border font-sub font-bold text-sm hover:bg-border transition-colors"
          >
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  );
}
