import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  CreditCard, 
  DollarSign, 
  Package, 
  Tag, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Zap,
  Globe
} from "lucide-react";
import AIChatBot from "@/components/AIChatBot";
import { Handshake } from "lucide-react";

const navItems = [
  { path: "/oresto-admin/dashboard", icon: LayoutDashboard, label: "Vue générale" },
  { path: "/oresto-admin/prestataires", icon: Handshake, label: "Prestataires" },
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-foreground font-body">
      {/* Sidebar desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] text-white transform transition-transform md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase text-white block leading-none">
                  Oresto
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary block mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-sub text-xs font-bold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              to="/decouvrir"
              className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white font-sub text-xs font-bold transition-colors"
            >
              <Globe size={16} /> Voir le site public
            </Link>
            <button
              onClick={() => { adminLogout(); navigate("/oresto-admin/login"); }}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 font-sub text-xs font-bold transition-colors w-full"
            >
              <LogOut size={16} /> Déconnexion Admin
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3.5 sm:py-4 md:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-foreground hover:bg-gray-200 transition-colors" aria-label="Ouvrir le menu d'administration"><Menu size={20} /></button>
            <span className="font-heading text-lg font-black uppercase text-foreground">Oresto Admin</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
            <Zap size={16} fill="currentColor" />
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-6 md:p-10 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <AIChatBot />
    </div>
  );
}
