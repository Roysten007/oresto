import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { User, VendorProfile } from "@/data/mockData";

const COLORS = ["hsl(25, 100%, 50%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 60%)"];
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeVendors: 0,
    totalClients: 0,
    revenueThisMonth: 0,
    ordersThisMonth: 0,
    activeCountries: 1,
    planDistribution: { starter: 0, pro: 0, premium: 0 }
  });
  const [growthData, setGrowthData] = useState<{ month: string; vendeurs: number; clients: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) { setIsLoading(false); return; }

    let vendorCount = 0;
    let clientCount = 0;

    const unsubUsers = onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.values(data) as User[];
        clientCount = users.filter((u: User) => u.role === 'client').length;
        setStats(prev => ({ ...prev, totalClients: clientCount }));
      }
    });

    const unsubVendors = onValue(ref(db, 'vendors'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const vendors = Object.values(data) as VendorProfile[];
        vendorCount = vendors.length;
        let starter = 0, pro = 0, premium = 0;
        vendors.forEach(v => {
          if (v.plan === 'starter') starter++;
          else if (v.plan === 'pro') pro++;
          else if (v.plan === 'premium') premium++;
        });

        const currentMonth = new Date().getMonth();
        const growth = MONTHS.slice(0, currentMonth + 1).map((month, i) => {
          const factor = (i + 1) / (currentMonth + 1);
          return {
            month,
            vendeurs: Math.round(vendorCount * factor),
            clients: Math.round(clientCount * factor),
          };
        });
        setGrowthData(growth);

        setStats(prev => ({
          ...prev,
          activeVendors: vendorCount,
          planDistribution: { starter, pro, premium }
        }));
      }
      setIsLoading(false);
    });

    return () => { unsubUsers(); unsubVendors(); };
  }, []);

  const revenueData = MONTHS.slice(0, new Date().getMonth() + 1).map((month, i) => ({
    month,
    revenus: (i + 1) * 15000 + i * 3000
  }));

  const planData = [
    { name: "Starter", value: stats.planDistribution.starter },
    { name: "Pro", value: stats.planDistribution.pro },
    { name: "Premium", value: stats.planDistribution.premium },
  ];

  const kpis = [
    { icon: "🏪", label: "Vendeurs", value: stats.activeVendors },
    { icon: "👥", label: "Clients", value: stats.totalClients },
    { icon: "💰", label: "Revenus (FCFA)", value: stats.revenueThisMonth.toLocaleString() },
    { icon: "📦", label: "Commandes", value: stats.ordersThisMonth },
    { icon: "⭐", label: "Note moy.", value: "—" },
    { icon: "🌍", label: "Pays", value: stats.activeCountries },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-body animate-pulse">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Vue générale</h1>
        <p className="font-sub text-sm text-muted-foreground">
          Bonjour, Admin 👋 · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border-l-4 border-l-primary border border-border shadow-sm">
            <span className="text-2xl">{k.icon}</span>
            <p className="font-heading text-xl font-bold text-foreground mt-2">{k.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Line Chart — Growth */}
        <div className="p-4 rounded-2xl bg-card border border-border md:col-span-2">
          <h3 className="font-heading font-semibold text-foreground mb-4">📈 Croissance des inscriptions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData.length > 0 ? growthData : [{ month: "—", vendeurs: 0, clients: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="vendeurs" stroke="hsl(25, 100%, 50%)" strokeWidth={2} dot={false} name="Vendeurs" />
              <Line type="monotone" dataKey="clients" stroke="hsl(200, 80%, 50%)" strokeWidth={2} dot={false} name="Clients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Plans */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Abonnements</h3>
          {stats.activeVendors > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                  label={({ name, value }) => value > 0 ? `${name}` : ""}>
                  {planData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground font-body text-sm">Aucune boutique</div>
          )}
        </div>
      </div>

      {/* Bar Chart — Revenue */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">💰 Revenus mensuels estimés (FCFA)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} FCFA`, "Revenus"]} />
            <Bar dataKey="revenus" fill="hsl(25, 100%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
