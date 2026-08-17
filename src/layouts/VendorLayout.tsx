import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { confirmVendorSubscriptionPayment, FIRST_MONTH_PRICE, STANDARD_PLAN_PRICE } from "@/services/subscriptionService";
import AIChatBot from "@/components/AIChatBot";
import { toast } from "sonner";

const navItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Dashboard" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Mon Site Factory" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-utensils", label: "Mon Menu / Chambres" },
  { path: "/vendor/orders", icon: "fa-solid fa-bag-shopping", label: "Commandes & MoMo" },
  { path: "/vendor/delivery", icon: "fa-solid fa-truck-fast", label: "Livraison" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques" },
  { path: "/vendor/subscription", icon: "fa-solid fa-credit-card", label: "Abonnement" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres" },
];

export default function VendorLayout() {
  const { vendorProfile, logout } = useAuth();
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
    <div className="min-h-screen flex bg-background font-body">
      {/* Sidebar desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-md shadow-primary/25">
                <i className="fa-solid fa-utensils"></i>
              </div>
              <span className="font-heading text-lg font-black tracking-tight uppercase text-foreground">
                Oresto <span className="text-primary">Pro</span>
              </span>
            </Link>
            <button className="md:hidden text-gray-500 hover:text-black" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {vendorProfile && (
            <div className="mb-6 p-3.5 rounded-2xl bg-muted border border-border">
              <p className="font-heading text-sm font-bold text-foreground truncate">{vendorProfile.name || "Le Maquis Étoilé"}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                  ORESTO PRO
                </span>
                {isBlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[9px] font-black uppercase tracking-wider">
                    Bloqué
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[9px] font-bold">
                    Actif
                  </span>
                )}
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={isBlocked ? "/vendor/subscription" : item.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sub text-xs font-bold transition-all ${
                    active 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${isBlocked && item.path !== "/vendor/subscription" ? "opacity-50" : ""}`}
                >
                  <i className={`${item.icon} text-sm w-4 text-center`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 pt-4 border-t border-border text-xs">
            <Link to={`/r/${vendorProfile?.slug || "le-maquis-etoile"}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary font-bold">
              <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              <span>Voir mon site public</span>
            </Link>
            <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 px-3 py-2 text-destructive font-bold hover:bg-red-50 rounded-xl w-full transition-colors">
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 md:hidden flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-700">
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          <span className="font-heading text-lg font-bold text-primary">ORESTO PRO</span>
          <Link to={`/r/${vendorProfile?.slug || "le-maquis-etoile"}`} target="_blank" className="text-xs text-primary font-bold">
            <i className="fa-solid fa-globe text-base"></i>
          </Link>
        </header>
        
        <main className="flex-1 p-4 md:p-8">
          {/* Écran de blocage si impayé après délai de grâce J+3 */}
          {isBlocked && location.pathname !== "/vendor/subscription" ? (
            <div className="min-h-[75vh] flex items-center justify-center">
              <div className="max-w-xl w-full p-8 md:p-12 rounded-[40px] bg-card border-2 border-red-500/30 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-inner border border-red-500/20 text-3xl">
                  <i className="fa-solid fa-lock"></i>
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
                    <i className="fa-solid fa-credit-card"></i> Débloquer maintenant ({payAmount.toLocaleString()} F)
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

      <AIChatBot />

      {/* Modal Déblocage Immédiat */}
      {showUnblockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider">
                <i className="fa-solid fa-shield-halved"></i> Paiement MoMo Sécurisé
              </div>
              <button onClick={() => setShowUnblockModal(false)} className="text-muted-foreground hover:text-foreground">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-black text-foreground">
                Renouveler Oresto Pro
              </h3>
              <p className="text-xs text-muted-foreground">
                Effectuez votre transfert de <strong>{payAmount.toLocaleString()} FCFA</strong> par Mobile Money pour réactiver instantanément votre boutique et vos commandes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Destinataire :</span>
                <span className="font-bold text-foreground">Oresto SAS (Maketou)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Numéro MoMo :</span>
                <span className="font-mono font-bold text-primary">+229 97 00 00 00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Montant net :</span>
                <span className="font-black text-foreground">{payAmount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Confirmation..." : "J'ai effectué le paiement"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
