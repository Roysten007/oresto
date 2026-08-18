import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { confirmVendorSubscriptionPayment, FIRST_MONTH_PRICE, STANDARD_PLAN_PRICE } from "@/services/subscriptionService";
import AIChatBot from "@/components/AIChatBot";
import { toast } from "sonner";

const restoNavItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Tableau de Bord" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Site Factory Resto" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-utensils", label: "Ma Carte & Plats" },
  { path: "/vendor/orders", icon: "fa-solid fa-bell-concierge", label: "Commandes & MoMo" },
  { path: "/vendor/delivery", icon: "fa-solid fa-motorcycle", label: "Livraisons & Tables" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques Repas" },
  { path: "/vendor/subscription", icon: "fa-solid fa-crown", label: "Abonnement Pro" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres" },
];

const ecommerceNavItems = [
  { path: "/vendor/dashboard", icon: "fa-solid fa-chart-pie", label: "Tableau de Bord" },
  { path: "/vendor/site", icon: "fa-solid fa-wand-magic-sparkles", label: "Boutique Factory" },
  { path: "/vendor/catalogue", icon: "fa-solid fa-boxes-stacked", label: "Mon Catalogue & Stocks" },
  { path: "/vendor/orders", icon: "fa-solid fa-box", label: "Commandes & Colis" },
  { path: "/vendor/delivery", icon: "fa-solid fa-truck-fast", label: "Expéditions & Livraisons" },
  { path: "/vendor/stats", icon: "fa-solid fa-chart-line", label: "Statistiques Ventes" },
  { path: "/vendor/subscription", icon: "fa-solid fa-crown", label: "Abonnement Pro" },
  { path: "/vendor/settings", icon: "fa-solid fa-gear", label: "Paramètres Boutique" },
];

export default function VendorLayout() {
  const { vendorProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");

  const isBlocked = vendorProfile?.subscriptionStatus === "blocked" || vendorProfile?.subscriptionStatus === "restricted";
  const isFirstPayment = !vendorProfile?.paymentHistory || vendorProfile.paymentHistory.length === 0;
  const payAmount = isFirstPayment ? FIRST_MONTH_PRICE : STANDARD_PLAN_PRICE;

  // Secteur d'activité fixé par le compte du vendeur ou le test actif
  const businessType = sectorQuery || vendorProfile?.business_type ||
    ((vendorProfile?.category || "").toLowerCase().includes("boutique") ||
     (vendorProfile?.category || "").toLowerCase().includes("mode") ||
     (vendorProfile?.category || "").toLowerCase().includes("tech") ||
     (vendorProfile?.category || "").toLowerCase().includes("e-commerce")
      ? "ecommerce"
      : "restaurant");

  const handlePayNow = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, vendorProfile.pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre espace est débloqué.");
      setShowUnblockModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeNavItems = businessType === "ecommerce" ? ecommerceNavItems : restoNavItems;

  return (
    <div className="min-h-screen flex bg-background font-body">
      {/* Sidebar desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          
          {/* Logo Branding */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-md shadow-primary/25">
                <i className={`fa-solid ${businessType === "ecommerce" ? "fa-bag-shopping" : "fa-utensils"}`}></i>
              </div>
              <div>
                <span className="font-heading text-base font-black tracking-tight uppercase text-foreground block leading-tight">
                  Oresto <span className="text-primary">{businessType === "ecommerce" ? "Boutique" : "Resto"}</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Espace Admin Dédié</span>
              </div>
            </Link>
            <button className="md:hidden text-gray-500 hover:text-black" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Profile Card */}
          {vendorProfile && (
            <div className="mb-4 p-3 rounded-2xl bg-muted/60 border border-border shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-heading text-xs font-bold text-foreground truncate max-w-[140px]">
                  {sectorQuery 
                    ? (businessType === "ecommerce" ? "KiffStyle & Tech Store" : businessType === "hotel" ? "Palmier Royal" : "L'Atelier du Chef & Grill")
                    : (vendorProfile.name && !vendorProfile.name.toLowerCase().includes("maquis")
                        ? vendorProfile.name 
                        : (businessType === "ecommerce" ? "KiffStyle & Tech Store" : businessType === "hotel" ? "Palmier Royal" : "L'Atelier du Chef & Grill"))}
                </p>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[8px] font-black uppercase tracking-wider">
                  {businessType === "ecommerce" ? "ESPACE BOUTIQUE" : businessType === "hotel" ? "ESPACE HÔTEL" : "ESPACE RESTAURANT"}
                </span>
                <span className="text-[9px] text-muted-foreground font-bold">0% Comm</span>
              </div>
            </div>
          )}

          {/* Dedicated Nav Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {activeNavItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={isBlocked ? "/vendor/subscription" : `${item.path}${sectorQuery ? `?sector=${sectorQuery}` : ''}`} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sub text-xs font-bold transition-all ${
                    active 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${isBlocked && item.path !== "/vendor/subscription" ? "opacity-50" : ""}`}
                >
                  <i className={`${item.icon} text-xs w-4 text-center`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-1.5 pt-3 border-t border-border text-xs">
            <Link 
              to={`/r/${vendorProfile?.slug || (businessType === "ecommerce" ? "kiffstyle-store" : businessType === "hotel" ? "palmier-royal" : "latelier-du-chef")}`} 
              target="_blank" 
              className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary font-bold rounded-xl hover:bg-muted transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs text-primary"></i>
              <span>Voir ma vitrine en ligne</span>
            </Link>
            <button 
              onClick={() => { logout(); navigate("/login"); }} 
              className="flex items-center gap-2 px-3 py-2 text-destructive font-bold hover:bg-red-50 rounded-xl w-full transition-colors"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 md:hidden flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-700">
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-black text-primary uppercase">
              {businessType === "ecommerce" ? "Oresto Boutique Pro" : "Oresto Resto Pro"}
            </span>
          </div>
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
                  <h2 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">
                    Accès temporairement suspendu
                  </h2>
                  <p className="font-sub text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Votre période de grâce est expirée. Veuillez régulariser votre abonnement Oresto Pro pour réactiver votre espace de gestion et rouvrir votre vitrine web.
                  </p>
                </div>

                <div className="p-4 bg-muted/60 rounded-2xl border border-border inline-block text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Montant à régler :</p>
                  <p className="font-heading text-2xl font-black text-foreground">{payAmount.toLocaleString()} FCFA</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/vendor/subscription")}
                    className="px-8 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
                  >
                    Régulariser par Mobile Money
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Floating IZI IA Assistant */}
      <AIChatBot />
    </div>
  );
}
