import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { confirmVendorSubscriptionPayment, STANDARD_PLAN_PRICE } from "@/services/subscriptionService";
import { getVendorSector, setVendorSector, BusinessSector, SECTORS } from "@/lib/vendorSector";
import AIChatBot from "@/components/AIChatBot";
import EstablishmentSwitcher from "@/components/vendor/EstablishmentSwitcher";
import { toast } from "sonner";

const restoNavItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Tableau de bord" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Site restaurant" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-utensils", label: "Ma carte & plats" },
  { path: "/vendor/orders", icon: "fa-solid fa-bell-concierge", label: "Commandes & MoMo" },
  { path: "/vendor/delivery", icon: "fa-solid fa-motorcycle", label: "Livraisons & tables" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques" },
  { path: "/vendor/subscription", icon: "fa-solid fa-crown", label: "Abonnement Pro" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres" },
];

const ecommerceNavItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Tableau de bord" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Boutique en ligne" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-boxes-stacked", label: "Articles & stocks" },
  { path: "/vendor/orders", icon: "fa-solid fa-box", label: "Commandes & colis" },
  { path: "/vendor/delivery", icon: "fa-solid fa-truck-fast", label: "Expéditions & envois" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques" },
  { path: "/vendor/subscription", icon: "fa-solid fa-crown", label: "Abonnement Pro" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres boutique" },
];

const hotelNavItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Tableau de bord" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Vitrine hôtel" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-bed", label: "Chambres & suites" },
  { path: "/vendor/orders", icon: "fa-solid fa-calendar-check", label: "Réservations séjours" },
  { path: "/vendor/delivery", icon: "fa-solid fa-key", label: "Arrivées & check-in" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques" },
  { path: "/vendor/subscription", icon: "fa-solid fa-crown", label: "Abonnement Pro" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres hôtel" },
];

export default function VendorLayout() {
  const { vendorProfile, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");

  const isBlocked = vendorProfile?.subscriptionStatus === "blocked" || vendorProfile?.subscriptionStatus === "restricted";
  const payAmount = STANDARD_PLAN_PRICE;

  // Secteur d'activité unifié
  const currentSector: BusinessSector = getVendorSector(vendorProfile, sectorQuery);
  const sectorMeta = SECTORS[currentSector];



  const handlePayNow = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, vendorProfile.pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre espace est débloqué.");
      setShowUnblockModal(false);
    } catch {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeNavItems = currentSector === "hotel" 
    ? hotelNavItems 
    : currentSector === "ecommerce" 
    ? ecommerceNavItems 
    : restoNavItems;

  const displayName = vendorProfile?.name || vendorProfile?.restaurantName || (user as any)?.firstName || "Mon établissement";
  const showcaseSlug = vendorProfile?.slug || vendorProfile?.id || (user as any)?.uid || "";

  return (
    <div className="min-h-screen flex bg-zinc-50/60 font-sub">
      
      {/* Sidebar desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200/90 transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          
          {/* Logo Branding */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shadow-xs"
                style={{ backgroundColor: sectorMeta.primaryColor }}
              >
                <i className={sectorMeta.icon}></i>
              </div>
              <div>
                <span className="font-heading text-base font-black tracking-tight text-zinc-950 block leading-tight">
                  Oresto <span style={{ color: sectorMeta.primaryColor }}>{sectorMeta.label.split(" ")[0]}</span>
                </span>
                <span className="text-[10px] font-sub text-zinc-500 block">Espace professionnel</span>
              </div>
            </Link>
            <button className="md:hidden text-zinc-500 hover:text-zinc-950" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Sélecteur et basculeur multi-établissements */}
          <EstablishmentSwitcher />

          {/* Dedicated Nav Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {activeNavItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={isBlocked ? "/vendor/subscription" : `${item.path}?sector=${currentSector}`} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sub text-xs font-bold transition-all ${
                    active 
                      ? "text-white shadow-xs" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  } ${isBlocked && item.path !== "/vendor/subscription" ? "opacity-50" : ""}`}
                  style={active ? { backgroundColor: sectorMeta.primaryColor } : {}}
                >
                  <i className={`${item.icon} text-xs w-4 text-center`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-1.5 pt-3 border-t border-zinc-200/80 text-xs">
            <Link 
              to={showcaseSlug ? `/r/${showcaseSlug}` : "#"} 
              target="_blank" 
              className="flex items-center gap-2 px-3 py-2 text-zinc-600 hover:text-zinc-950 font-sub font-bold rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" style={{ color: sectorMeta.primaryColor }}></i>
              <span>Voir ma vitrine en ligne</span>
            </Link>
            <button 
              onClick={() => { logout(); navigate("/login"); }} 
              className="flex items-center gap-2 px-3 py-2 text-red-600 font-sub font-bold hover:bg-red-50 rounded-xl w-full transition-colors"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 px-4 py-3 md:hidden flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-700">
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-black text-zinc-950">
              Oresto <span style={{ color: sectorMeta.primaryColor }}>{sectorMeta.label}</span>
            </span>
          </div>
          <Link 
            to={showcaseSlug ? `/r/${showcaseSlug}` : "#"} 
            target="_blank" 
            className="text-xs font-bold"
            style={{ color: sectorMeta.primaryColor }}
          >
            <i className="fa-solid fa-globe text-base"></i>
          </Link>
        </header>
        
        <main className="flex-1 p-4 md:p-8">
          {/* Écran de blocage si impayé après délai de grâce J+3 */}
          {isBlocked && location.pathname !== "/vendor/subscription" ? (
            <div className="min-h-[75vh] flex items-center justify-center">
              <div className="max-w-xl w-full p-8 md:p-12 rounded-3xl bg-white border-2 border-red-500/30 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl shadow-xs border border-red-200">
                  <i className="fa-solid fa-lock"></i>
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-heading font-black text-2xl text-zinc-950 tracking-tight">
                    Accès suspendu pour impayé
                  </h2>
                  <p className="text-zinc-600 text-sm font-sub max-w-md mx-auto leading-relaxed">
                    Votre période de grâce de 3 jours est arrivée à échéance. Veuillez régulariser votre abonnement Oresto Pro ({payAmount.toLocaleString("fr-FR")} FCFA) par Mobile Money pour réactiver immédiatement votre vitrine et vos commandes.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setShowUnblockModal(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-950 text-white font-sub font-bold text-xs hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    Régulariser par Mobile Money
                  </button>
                  <Link
                    to="/vendor/subscription"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sub font-bold text-xs transition-colors text-center"
                  >
                    Voir les détails de la facture
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Modal de régularisation instantanée */}
      {showUnblockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="font-heading font-black text-base text-zinc-950">
                Paiement Mobile Money
              </h3>
              <button onClick={() => setShowUnblockModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Abonnement Oresto Pro</p>
                  <p className="text-[11px] text-zinc-500 font-sub">Facturation mensuelle sans engagement</p>
                </div>
                <span className="font-heading font-black text-base text-emerald-600">
                  {payAmount.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sub leading-relaxed">
                Le paiement s'effectue directement via votre compte MTN Mobile Money ou Moov Money. Votre boutique sera débloquée instantanément dès confirmation.
              </p>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-sub font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validation en cours...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-mobile-screen"></i>
                  <span>Payer {payAmount.toLocaleString("fr-FR")} FCFA par MoMo</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bot Assistant IA */}
      <AIChatBot />

    </div>
  );
}
