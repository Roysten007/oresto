import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dailyOrders = Array.from({ length: 7 }, (_, i) => ({ day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i], orders: 0 }));
const dailyRevenue = Array.from({ length: 7 }, (_, i) => ({ day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i], revenue: 0 }));

export default function VendorStats() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Statistiques</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "Total commandes", value: "0" }, { label: "Total revenus", value: "0 FCFA" }, { label: "Note moyenne", value: "—" }, { label: "Taux satisfaction", value: "—" }].map((m, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{m.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Commandes par jour</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="orders" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">Revenus par jour</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
