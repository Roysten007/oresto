import { mockAdminData } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(25, 100%, 50%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 60%)"];

export default function AdminDashboard() {
  const { stats, recentActivity, weeklyRevenue, vendorsPerWeek } = mockAdminData;
  const planData = [
    { name: "Starter", value: stats.planDistribution.starter },
    { name: "Pro", value: stats.planDistribution.pro },
    { name: "Premium", value: stats.planDistribution.premium },
  ];
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const kpis = [
    { icon: "🏪", label: "Vendeurs actifs", value: stats.activeVendors },
    { icon: "👥", label: "Clients inscrits", value: stats.totalClients },
    { icon: "💰", label: "Revenus du mois", value: `${stats.revenueThisMonth.toLocaleString()} FCFA` },
    { icon: "📦", label: "Commandes ce mois", value: stats.ordersThisMonth },
    { icon: "⭐", label: "Note moyenne", value: `${stats.averageRating}/5` },
    { icon: "🌍", label: "Pays actifs", value: stats.activeCountries },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Vue générale</h1>
        <p className="font-sub text-sm text-muted-foreground">Bonjour, Admin 👋 · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm">
            <span className="text-2xl">{k.icon}</span>
            <p className="font-heading text-xl font-bold text-foreground mt-2">{k.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Nouveaux vendeurs/semaine</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weekDays.map((d, i) => ({ day: d, count: vendorsPerWeek[i] }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="count" stroke="hsl(25,100%,50%)" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Revenus/semaine</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekDays.map((d, i) => ({ day: d, rev: weeklyRevenue[i] }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="rev" fill="hsl(25,100%,50%)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Répartition plans</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
              {planData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">Activité récente</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 font-sub text-muted-foreground">Type</th>
              <th className="text-left py-2 font-sub text-muted-foreground">Description</th>
              <th className="text-left py-2 font-sub text-muted-foreground">Date</th>
              <th className="text-left py-2 font-sub text-muted-foreground">Statut</th>
            </tr></thead>
            <tbody>
              {recentActivity.map((a, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-muted">{a.type === "new_vendor" ? "🆕" : a.type === "payment" ? "💳" : a.type === "report" ? "⚠️" : "👤"}</span></td>
                  <td className="py-2 font-body text-foreground">{a.description}</td>
                  <td className="py-2 font-body text-muted-foreground">{a.date}</td>
                  <td className="py-2 font-body text-muted-foreground">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
