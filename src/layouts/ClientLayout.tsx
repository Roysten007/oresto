import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Search, ShoppingCart, ClipboardList, Heart, UserCircle, Bell } from "lucide-react";

const navItems = [
  { path: "/app/home", icon: Home, label: "Accueil" },
  { path: "/app/search", icon: Search, label: "Recherche" },
  { path: "/app/cart", icon: ShoppingCart, label: "Panier" },
  { path: "/app/orders", icon: ClipboardList, label: "Commandes" },
  { path: "/app/profile", icon: UserCircle, label: "Profil" },
];

export default function ClientLayout() {
  const { user, sessionWarning, dismissWarning, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-heading text-lg font-bold text-primary">ORESTO</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">3</span>
            </button>
            <Link to="/app/profile" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-xs font-bold">
              {user?.firstName?.[0] || "U"}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon size={20} />
                <span className="text-[10px] font-sub">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {sessionWarning && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-heading font-bold text-foreground mb-2">Session bientôt expirée</h3>
            <p className="font-body text-muted-foreground text-sm mb-4">Votre session expire dans 5 minutes. Voulez-vous rester connecté ?</p>
            <div className="flex gap-3">
              <button onClick={logout} className="flex-1 py-2 rounded-full border border-border text-foreground font-sub text-sm">Déconnexion</button>
              <button onClick={dismissWarning} className="flex-1 py-2 rounded-full bg-primary text-primary-foreground font-sub text-sm">Rester connecté</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
