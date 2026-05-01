import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Order } from "@/data/mockData";
import { ArrowLeft, Clock, Package, Truck, CheckCircle2, ShoppingBag, MapPin, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderChat from "@/components/OrderChat";

const statusSteps = [
  { key: "pending",   label: "Commande reçue",    sub: "Le restaurant a reçu votre commande",   icon: Clock,         color: "text-orange-500",  bg: "bg-orange-500" },
  { key: "preparing", label: "En préparation",     sub: "Votre repas est en cours de préparation", icon: Package,    color: "text-blue-500",    bg: "bg-blue-500" },
  { key: "delivering",label: "En route",           sub: "Un livreur est en chemin vers vous",    icon: Truck,         color: "text-purple-500",  bg: "bg-purple-500" },
  { key: "delivered", label: "Livré !",            sub: "Votre commande a bien été livrée",       icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500" },
];

const modeLabels: Record<string, string> = {
  delivery: "Livraison à domicile",
  pickup: "Retrait sur place",
};

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the order directly from Firebase for immediate display (fixes white screen)
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!id || !db) { setIsLoading(false); return; }
    const orderRef = ref(db, `orders/${id}`);
    const unsub = onValue(orderRef, snap => {
      if (snap.exists()) {
        setOrder({ id: snap.key!, ...snap.val() } as Order);
      } else {
        setOrder(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [id]);

  // Loading state
  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Chargement de votre commande...</p>
      </div>
    </div>
  );

  // Not found
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6 bg-[#FAFAFA]">
      <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-200 border border-gray-50">
        <Package size={48} />
      </div>
      <div className="text-center space-y-2">
        <p className="text-base font-black uppercase tracking-tighter">Commande introuvable</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Le lien est peut-être incorrect ou expiré</p>
      </div>
      <button
        onClick={() => navigate("/app/orders")}
        className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
      >
        Mes commandes
      </button>
    </div>
  );

  const currentIdx = statusSteps.findIndex(s => s.key === order.status);
  const currentStep = statusSteps[currentIdx] || statusSteps[0];
  const CurrentIcon = currentStep.icon;
  const isDelivered = order.status === "delivered";
  const deliveryMode = (order as any).deliveryMode as string | undefined;
  const distanceKm = (order as any).distanceKm as number | undefined;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      {/* Top sticky header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-90 transition-all border border-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-sm uppercase tracking-tight truncate">Suivi de commande</h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">#{id?.slice(-8)}</p>
        </div>
        {/* Chat toggle button */}
        <button
          onClick={() => setShowChat(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
        >
          <MessageCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Message</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">

        {/* Status Hero Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-[40px] bg-black text-white p-8 shadow-2xl shadow-black/30"
        >
          {/* Animated gradient background */}
          <div className={`absolute inset-0 opacity-20 transition-all duration-1000 ${currentStep.bg}`} style={{ filter: "blur(60px)" }} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                <span className={`w-2 h-2 rounded-full ${isDelivered ? "bg-emerald-400" : "bg-primary animate-pulse"}`} />
                {isDelivered ? "Terminée" : "En cours"}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">{currentStep.label}</h2>
              <p className="text-[10px] opacity-60 font-bold">{currentStep.sub}</p>
            </div>
            <div className={`w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10`}>
              <CurrentIcon size={28} className="text-primary" />
            </div>
          </div>
          {/* ETA */}
          {!isDelivered && (
            <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Arrivée estimée</span>
              <span className="font-black text-lg">15-25 <span className="text-xs opacity-60 font-bold">min</span></span>
            </div>
          )}
        </motion.div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-[36px] border border-gray-50 shadow-sm p-6 space-y-1">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5">Progression</h3>
          {statusSteps.map((step, i) => {
            const isDone = i <= currentIdx;
            const isActive = i === currentIdx;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: isDone ? "#000" : "#F3F4F6",
                      scale: isActive ? [1, 1.08, 1] : 1,
                    }}
                    transition={{ repeat: isActive ? Infinity : 0, duration: 1.8 }}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center z-10 shadow-sm border-4 border-white"
                  >
                    <Icon size={18} className={isDone ? "text-white" : "text-gray-300"} />
                  </motion.div>
                  {i < statusSteps.length - 1 && (
                    <motion.div
                      animate={{ backgroundColor: isDone ? "#000" : "#F3F4F6" }}
                      className="w-0.5 h-10 -mt-0.5"
                    />
                  )}
                </div>
                <div className="pt-2.5 pb-8 flex-1">
                  <p className={`text-xs font-black uppercase tracking-wide ${isDone ? "text-black" : "text-gray-300"}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-primary mt-0.5">
                      ● Action en cours...
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order details */}
        <div className="bg-white rounded-[36px] border border-gray-50 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <ShoppingBag size={17} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-black uppercase">Récapitulatif</h3>
            <span className="ml-auto text-[9px] font-bold text-gray-400 uppercase">{order.vendorName}</span>
          </div>
          <div className="space-y-2.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-gray-500">
                <span>{item.qty}× {item.name}</span>
                <span className="text-black">{item.price.toLocaleString()} F</span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          {deliveryMode && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{modeLabels[deliveryMode] || deliveryMode}</p>
                <p className="text-[10px] font-bold text-black truncate">{order.address || "—"}</p>
              </div>
              {distanceKm && deliveryMode === "delivery" && (
                <span className="text-[9px] font-black text-primary uppercase whitespace-nowrap">{distanceKm}km</span>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Total payé</span>
              <p className="text-2xl font-black">{order.total.toLocaleString()} F</p>
            </div>
            {(order as any).deliveryFee > 0 && (
              <span className="text-[9px] font-bold text-gray-400">dont {(order as any).deliveryFee?.toLocaleString()} F de livraison</span>
            )}
          </div>
        </div>

        {/* Inline Chat section */}
        <div>
          <button
            onClick={() => setShowChat(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-[28px] bg-white border border-gray-100 shadow-sm hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageCircle size={17} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tight">Contacter {order.vendorName || "le restaurant"}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Discussion en temps réel</p>
              </div>
            </div>
            {showChat ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden mt-3"
              >
                <OrderChat
                  orderId={id!}
                  vendorName={order.vendorName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delivered — rate button */}
        {isDelivered && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/app/rate/${id}`)}
            className="w-full py-5 rounded-[32px] bg-primary text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:opacity-90 active:scale-95 transition-all"
          >
            ⭐ Évaluer cette commande
          </motion.button>
        )}
      </div>
    </div>
  );
}
