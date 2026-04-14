import { useAuth } from "@/contexts/AuthContext";
import { mockOrders, mockProducts } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const weeklyData = weekDays.map((d, i) => ({ day: d, revenue: [18000, 21000, 19500, 24000, 22000, 26000, 19000][i] }));

export default function VendorDashboard() {
  const { vendorProfile, user } = useAuth();
  const vid = user?.vendorId || "v1";
  const orders = mockOrders.filter(o => o.vendorId === vid);
  const products = mockProducts.filter(p => p.vendorId === vid);
  const todayOrders = orders.filter(o => o.status !== "cancelled");
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  const kpis = [
    { label: "Commandes aujourd'hui", value: todayOrders.length, icon: "📦" },
    { label: "Revenus aujourd'hui", value: `${todayRevenue.toLocaleString()} FCFA`, icon: "💰" },
    { label: "Note moyenne", value: `${vendorProfile?.rating || 4.8}/5`, icon: "⭐" },
    { label: "Vues aujourd'hui", value: "127", icon: "👁️" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Bonjour, {vendorProfile?.name || "Vendeur"} 👋</h1>
        <p className="font-sub text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm border-l-4 border-l-primary">
            <span className="text-2xl">{kpi.icon}</span>
            <p className="font-heading text-xl font-bold text-foreground mt-2">{kpi.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">Revenus de la semaine</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="revenue" fill="hsl(25, 100%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">Commandes récentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-sub text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 font-sub text-muted-foreground font-medium">Client</th>
                <th className="text-left py-2 font-sub text-muted-foreground font-medium">Total</th>
                <th className="text-left py-2 font-sub text-muted-foreground font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-border">
                  <td className="py-2 font-body text-foreground">{o.id}</td>
                  <td className="py-2 font-body text-foreground">{o.clientName}</td>
                  <td className="py-2 font-body text-foreground">{o.total.toLocaleString()} FCFA</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${
                      o.status === "pending" ? "bg-oresto-orange-light text-primary" :
                      o.status === "preparing" ? "bg-blue-100 text-blue-700" :
                      o.status === "delivered" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>{o.status === "pending" ? "En attente" : o.status === "preparing" ? "En cours" : o.status === "delivered" ? "Livré" : o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
