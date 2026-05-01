import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { User } from "@/data/mockData";

export default function AdminClients() {
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allUsers = Object.values(data) as User[];
        setClients(allUsers.filter(u => u.role === "client"));
      } else {
        setClients([]);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-body">Chargement des clients...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Gestion des clients</h1>
      {clients.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <span className="text-4xl block mb-4">👥</span>
          <p className="font-heading text-lg font-semibold text-foreground">Aucun client inscrit</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Les clients apparaîtront ici une fois inscrits</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-sub text-muted-foreground">Nom</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Email</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Téléphone</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Ville</th>
                <th className="text-left p-3 font-sub text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-heading text-sm font-semibold text-foreground">{c.firstName} {c.name}</td>
                  <td className="p-3 font-body text-muted-foreground">{c.email}</td>
                  <td className="p-3 font-body text-muted-foreground">{c.phone || "—"}</td>
                  <td className="p-3 font-body text-muted-foreground">{c.city || "—"}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-green-100 text-green-700">🟢 Actif</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
