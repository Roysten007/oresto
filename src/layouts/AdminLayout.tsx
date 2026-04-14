import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { LayoutDashboard, Store, Users, CreditCard, DollarSign, Package, Tag, Bell, Settings, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { path: "/oresto-admin/dashboard", icon: LayoutDashboard, label: "Vue générale" },
  { path: "/oresto-admin/vendors", icon: Store, label: "Vendeurs" },
  { path: "/oresto-admin/clients", icon: Users, label: "Clients" },
  { path: "/oresto-admin/subscriptions", icon: CreditCard, label: "Abonnements" },
  { path: "/oresto-admin/revenues", icon: DollarSign, label: "Revenus" },
  { path: "/oresto-admin/orders", icon: Package, label: "Commandes" },
  { path: "/oresto-admin/categories", icon: Tag, label: "Catégories" },
  { path: "/oresto-admin/notifications", icon: Bell, label: "Notifications" },
  { path: "/oresto-admin/settings", icon: Settings, label: "Paramètres" },
];

export default function AdminLayout() {
  const { adminLogout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-oresto-black transform transition-transform md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold text-primary">ORESTO</span>
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-sub">Admin</span>
            </div>
            <button className="md:hidden text-primary-foreground" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sub text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"}`}>
                  <item.icon size={18} /><span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-primary-foreground/10">
            <p className="font-sub text-xs text-primary-foreground/40 mb-2">Admin Oresto</p>
            <button onClick={() => { adminLogout(); navigate("/oresto-admin/login"); }} className="flex items-center gap-2 px-3 py-2 text-destructive font-sub text-sm w-full">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 md:hidden flex items-center gap-3">
          <button onClick={() => setOpen(true)}><Menu size={20} /></button>
          <span className="font-heading text-lg font-bold text-primary">ORESTO</span>
          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-sub">Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
