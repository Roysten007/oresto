import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dailyOrders = Array.from({ length: 7 }, (_, i) => ({ day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i], orders: [8, 12, 10, 15, 14, 18, 11][i] }));
const dailyRevenue = Array.from({ length: 7 }, (_, i) => ({ day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i], revenue: [18000, 21000, 19500, 24000, 22000, 26000, 19000][i] }));

export default function VendorStats() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Statistiques</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "Total commandes", value: "89" }, { label: "Total revenus", value: "149 500 FCFA" }, { label: "Note moyenne", value: "4.8/5" }, { label: "Taux satisfaction", value: "96%" }].map((m, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{m.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Commandes par jour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyOrders}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line type="monotone" dataKey="orders" stroke="hsl(25, 100%, 50%)" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Revenus par jour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyRevenue}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="revenue" fill="hsl(25, 100%, 50%)" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
