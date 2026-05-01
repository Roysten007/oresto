import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Truck, BarChart3, CreditCard, Settings, Eye, LogOut, Menu, X, Globe } from "lucide-react";

const navItems = [
  { path: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/vendor/site", icon: Globe, label: "Mon Site" },
  { path: "/vendor/catalogue", icon: UtensilsCrossed, label: "Mon Menu" },
  { path: "/vendor/orders", icon: ShoppingCart, label: "Commandes" },
  { path: "/vendor/delivery", icon: Truck, label: "Livraison" },
  { path: "/vendor/stats", icon: BarChart3, label: "Statistiques" },
  { path: "/vendor/subscription", icon: CreditCard, label: "Abonnement" },
  { path: "/vendor/settings", icon: Settings, label: "Paramètres" },
];

export default function VendorLayout() {
  const { vendorProfile, logout, sessionWarning, dismissWarning } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-heading text-2xl font-bold text-primary">ORESTO</Link>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
          </div>
          {vendorProfile && (
            <div className="mb-6 p-3 rounded-2xl bg-muted">
              <p className="font-heading text-sm font-semibold text-foreground truncate">{vendorProfile.name}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-sub">{vendorProfile.plan.toUpperCase()}</span>
            </div>
          )}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sub text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 pt-4 border-t border-border">
            <Link to={`/app/shop/${vendorProfile?.id || "v1"}`} className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground font-sub text-sm">
              <Eye size={16} /> Voir ma fiche
            </Link>
            <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 px-3 py-2 text-destructive font-sub text-sm w-full">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 md:hidden flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <span className="font-heading text-lg font-bold text-primary">ORESTO</span>
        </header>
        <main className="flex-1 p-4 md:p-8"><Outlet /></main>
      </div>

      {sessionWarning && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-heading font-bold text-foreground mb-2">Session bientôt expirée</h3>
            <p className="font-body text-muted-foreground text-sm mb-4">Voulez-vous rester connecté ?</p>
            <div className="flex gap-3">
              <button onClick={() => { logout(); navigate("/login"); }} className="flex-1 py-2 rounded-full border border-border text-foreground font-sub text-sm">Déconnexion</button>
              <button onClick={dismissWarning} className="flex-1 py-2 rounded-full bg-primary text-primary-foreground font-sub text-sm">Rester connecté</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
