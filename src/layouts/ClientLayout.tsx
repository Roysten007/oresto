import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClient } from "@/contexts/ClientContext";
import { useCart } from "@/contexts/CartContext";
import { Home, Search, ClipboardList, MessageCircle, UserCircle, Bell, MapPin, ChevronDown, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Onboarding from "@/components/app/Onboarding";

const navItems = [
  { path: "/app/home",     icon: Home,          label: "Accueil" },
  { path: "/app/decouvrir",icon: Search,         label: "Découvrir" },
  { path: "/app/orders",   icon: ClipboardList,  label: "Commandes" },
  { path: "/app/messages", icon: MessageCircle,  label: "Messages" },
  { path: "/app/profile",  icon: UserCircle,     label: "Profil" },
];

export default function ClientLayout() {
  const { user } = useAuth();
  const { onboardingCompleted, city, unreadCount } = useClient();
  const { totalItems } = useCart();
  const location = useLocation();

  // Pages immersives qui gèrent leur propre nav
  const isImmersivePage =
    location.pathname.includes("/app/shop/") ||
    location.pathname.includes("/app/order/") ||
    location.pathname.includes("/app/cart") ||
    location.pathname.includes("/app/rate/");

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <div className={`min-h-screen bg-[#FAFAFA] ${isImmersivePage ? "" : "pb-24"}`}>
      {/* Header */}
      <AnimatePresence>
        {!isImmersivePage && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 px-6 py-3 shadow-sm shadow-gray-100/60"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link to="/app/addresses" className="flex flex-col group min-w-0 flex-1 mr-4">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 leading-none mb-1 group-hover:text-primary transition-colors">Livraison à</span>
                <div className="flex items-center gap-1.5 text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                  <MapPin size={13} className="text-primary" />
                  <span className="truncate">{city || "Cotonou"}</span>
                  <ChevronDown size={13} className="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  to="/app/notifications"
                  className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-0 right-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border-2 border-white"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Link>
                <Link
                  to="/app/cart"
                  className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <ShoppingCart size={19} />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute top-0 right-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border-2 border-white"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <Link
                  to="/app/profile"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-sm shadow-lg hover:bg-primary transition-colors"
                >
                  {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"}
                </Link>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={`max-w-7xl mx-auto ${isImmersivePage ? "" : "px-6"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav — visible uniquement sur pages non-immersives */}
      <AnimatePresence>
        {!isImmersivePage && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-t border-gray-100/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]" />

            <div className="relative max-w-md mx-auto px-4 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
              <div className="flex items-end justify-around">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex flex-col items-center gap-1 relative group"
                    >
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className={`relative flex items-center justify-center transition-all duration-200 ${
                          active
                            ? "w-12 h-12 rounded-2xl bg-primary/12 text-primary"
                            : "w-10 h-10 text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        <Icon
                          size={active ? 22 : 21}
                          strokeWidth={active ? 2.5 : 1.8}
                        />
                        {/* Active dot */}
                        {active && (
                          <motion.span
                            layoutId="navDot"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          />
                        )}
                      {/* Cart badge on orders, unread badge on messages */}
                        {item.path === "/app/orders" && totalItems > 0 && !active && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                      </motion.div>
                      <span
                        className={`text-[8px] font-black uppercase tracking-wider transition-all ${
                          active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
