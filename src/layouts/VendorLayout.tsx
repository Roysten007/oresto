import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { confirmVendorSubscriptionPayment, FIRST_MONTH_PRICE, STANDARD_PLAN_PRICE } from "@/services/subscriptionService";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Eye, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  MessageCircle,
  Lock,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import AIChatBot from "@/components/AIChatBot";
import { toast } from "sonner";

const navItems = [
  { path: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/vendor/site", icon: Globe, label: "Mon Site" },
  { path: "/vendor/catalogue", icon: UtensilsCrossed, label: "Mon Menu / Chambres" },
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  const isBlocked = vendorProfile?.subscriptionStatus === "blocked" || vendorProfile?.subscriptionStatus === "restricted";
  const isFirstPayment = !vendorProfile?.paymentHistory || vendorProfile.paymentHistory.length === 0;
  const payAmount = isFirstPayment ? FIRST_MONTH_PRICE : STANDARD_PLAN_PRICE;

  const handlePayNow = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, vendorProfile.pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre espace commerçant est débloqué.");
      setShowUnblockModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

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
            <div className="mb-6 p-3.5 rounded-2xl bg-muted border border-border">
              <p className="font-heading text-sm font-bold text-foreground truncate">{vendorProfile.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                  ORESTO PRO
                </span>
                {isBlocked && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[9px] font-black uppercase tracking-wider">
                    Bloqué
                  </span>
                )}
              </div>
            </div>
          )}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={isBlocked ? "/vendor/subscription" : item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sub text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${isBlocked && item.path !== "/vendor/subscription" ? "opacity-50" : ""}`}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 pt-4 border-t border-border">
            <Link to={`/r/${vendorProfile?.slug || vendorProfile?.id || "demo"}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground font-sub text-sm">
              <Eye size={16} /> Voir mon site public
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
        
        <main className="flex-1 p-4 md:p-8">
          {/* Écran de blocage si impayé après délai de grâce J+3 */}
          {isBlocked && location.pathname !== "/vendor/subscription" ? (
            <div className="min-h-[75vh] flex items-center justify-center">
              <div className="max-w-xl w-full p-8 md:p-12 rounded-[40px] bg-card border-2 border-red-500/30 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-inner border border-red-500/20">
                  <Lock size={36} />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 inline-block">
                    Délai de grâce expiré
                  </span>
                  <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-foreground">
                    Espace commerçant <span className="text-red-500">suspendu</span>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Votre abonnement <strong>Oresto Pro</strong> est arrivé à échéance et le délai de grâce de 3 jours est terminé. Vos outils et la prise de commande sur votre vitrine sont actuellement suspendus.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 text-left flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                      {isFirstPayment ? "Tarif Réduit 1er Mois (-50%)" : "Tarif Mensuel Standard"}
                    </span>
                    <span className="font-black text-lg text-foreground">
                      {payAmount.toLocaleString()} FCFA
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Mobile Money (Maketou)</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setShowUnblockModal(true)}
                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} /> Débloquer maintenant ({payAmount.toLocaleString()} F)
                  </button>
                  <Link
                    to="/vendor/subscription"
                    className="py-4 px-6 rounded-2xl border-2 border-border text-foreground font-bold text-xs hover:bg-muted transition-all"
                  >
                    Voir l'abonnement
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Modal de déblocage rapide Mobile Money */}
      {showUnblockModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border-2 border-border p-8 rounded-[40px] shadow-2xl max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Paiement Mobile Money</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Passerelle Maketou</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUnblockModal(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Formule</span>
                <span className="font-black text-foreground uppercase">ORESTO PRO</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Offre</span>
                <span className="font-bold text-emerald-600">
                  {isFirstPayment ? "50% de réduction (1er mois)" : "Renouvellement standard"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-border">
                <span>Montant à régler</span>
                <span className="text-primary">{payAmount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Confirmation immédiate : votre tableau de bord et votre vitrine publique seront réactivés instantanément.
            </p>

            <button
              disabled={isProcessing}
              onClick={handlePayNow}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? "Validation en cours..." : "Confirmer et débloquer mon compte"}
            </button>
          </div>
        </div>
      )}

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
      <AIChatBot />
    </div>
  );
}
