import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { user, role, logout } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    neighborhood: user?.neighborhood || "",
  });

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Mon profil</h1>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-xl font-bold">
          {user?.firstName?.[0] || "U"}
        </div>
        <div>
          <p className="font-heading font-semibold text-foreground">{user?.name}</p>
          <p className="font-body text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: "Prénom", key: "firstName" },
          { label: "Nom", key: "name" },
          { label: "Téléphone", key: "phone" },
          { label: "Email", key: "email" },
          { label: "Ville", key: "city" },
          { label: "Quartier", key: "neighborhood" },
        ].map(field => (
          <div key={field.key}>
            <label className="font-sub text-sm font-medium text-foreground block mb-1">{field.label}</label>
            <input value={(form as any)[field.key]} onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
          </div>
        ))}
      </div>

      {role === "vendor" ? (
        <Link to="/vendor/dashboard" className="block w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold text-center btn-hover">
          Accéder au dashboard vendeur
        </Link>
      ) : (
        <div className="p-4 rounded-2xl bg-oresto-orange-light border border-primary/20">
          <h3 className="font-heading font-semibold text-foreground mb-1">Ouvrez votre boutique</h3>
          <p className="font-body text-sm text-muted-foreground mb-3">Vendez sur Oresto et touchez des milliers de clients</p>
          <Link to="/register" className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground font-sub text-sm btn-hover">Créer mon espace vendeur</Link>
        </div>
      )}

      <button onClick={logout} className="flex items-center gap-2 text-destructive font-sub text-sm hover:underline">
        <LogOut size={16} /> Déconnexion
      </button>
    </div>
  );
}
