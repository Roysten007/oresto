import { mockShops } from "@/data/mockData";

export default function AdminVendors() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Gestion des vendeurs</h1>
      <div className="flex gap-4 flex-wrap">
        {[{ label: "Total", value: mockShops.length }, { label: "Actifs", value: mockShops.filter(s => s.status === "active").length }, { label: "En attente", value: mockShops.filter(s => s.status === "pending").length }].map((s, i) => (
          <div key={i} className="px-4 py-3 rounded-2xl bg-card border border-border">
            <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-sub text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted">
            <th className="text-left p-3 font-sub text-muted-foreground">Boutique</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Catégorie</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Ville</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Plan</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Note</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
          </tr></thead>
          <tbody>
            {mockShops.map(s => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-3 font-heading text-sm font-semibold text-foreground">{s.name}</td>
                <td className="p-3 font-body text-foreground">{s.category}</td>
                <td className="p-3 font-body text-muted-foreground">{s.city}, {s.country}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-muted">{s.plan.toUpperCase()}</span></td>
                <td className="p-3 font-body text-foreground">⭐ {s.rating}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-sub ${s.status === "active" ? "bg-green-100 text-green-700" : s.status === "pending" ? "bg-oresto-orange-light text-primary" : "bg-destructive/10 text-destructive"}`}>{s.status === "active" ? "🟢 Actif" : s.status === "pending" ? "🟡 En attente" : "🔴 Suspendu"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
