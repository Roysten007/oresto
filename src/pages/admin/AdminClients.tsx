export default function AdminClients() {
  const clients = [
    { name: "Aminata Sossa", email: "aminata@test.com", phone: "+229 97 12 34", city: "Cotonou", orders: 5, status: "active" },
    { name: "Jean Koffi", email: "jean@test.com", phone: "+228 90 45 67", city: "Lomé", orders: 12, status: "active" },
    { name: "Marie Adjo", email: "marie@test.com", phone: "+225 07 89 01", city: "Abidjan", orders: 3, status: "active" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Gestion des clients</h1>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted">
            <th className="text-left p-3 font-sub text-muted-foreground">Nom</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Email</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Ville</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Commandes</th>
            <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
          </tr></thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted/50">
                <td className="p-3 font-heading text-sm font-semibold text-foreground">{c.name}</td>
                <td className="p-3 font-body text-muted-foreground">{c.email}</td>
                <td className="p-3 font-body text-muted-foreground">{c.city}</td>
                <td className="p-3 font-body text-foreground">{c.orders}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-green-100 text-green-700">🟢 Actif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
