import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Wallet, ChevronRight, Truck, Store, MapPin, Compass, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, get, child } from "firebase/database";

const PAYMENT_METHODS = [
  { id: "momo_mtn", label: "MTN MoMo", icon: "📱", color: "bg-yellow-400" },
  { id: "moov_money", label: "Moov Money", icon: "📱", color: "bg-blue-500" },
  { id: "cash", label: "Espèces à la livraison", icon: "💵", color: "bg-emerald-500" },
];

const DELIVERY_MODE = { id: "delivery", label: "Livraison à domicile", icon: Truck };
const PICKUP_MODE = { id: "pickup", label: "Je viens chercher", icon: Store };

// 120 FCFA par km, distance estimée par défaut à 3km si non connue
const RATE_PER_KM = 120;

function estimateDistance(userAddress: string): number {
  // Estimation simple — en production on utiliserait Google Maps Distance Matrix
  // On retourne une distance aléatoire entre 1.5 et 8km pour la démo
  const seed = userAddress.length % 10;
  return parseFloat((1.5 + seed * 0.65).toFixed(1));
}

export default function Cart() {
  const { items, updateQuantity, clearCart, totalPrice, totalItems, restaurantId } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("momo_mtn");
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState(
    user?.neighborhood ? `${user.neighborhood}, ${user.city}` : ""
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [vendorModes, setVendorModes] = useState<string[]>(["Livraison", "À Emporter", "Sur Place"]);
  const navigate = useNavigate();

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }
    
    setIsLocating(true);
    toast.loading("Recherche de votre position...", { id: "geo" });
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const road = data.address.road || "";
          const suburb = data.address.suburb || data.address.neighbourhood || "";
          const city = data.address.city || data.address.town || data.address.village || "";
          
          const newAddress = [road, suburb, city].filter(Boolean).join(", ");
          setAddress(newAddress || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success("Position trouvée !", { id: "geo" });
        } catch (error) {
          toast.error("Impossible de récupérer le nom de la rue", { id: "geo" });
          setAddress(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Erreur de géolocalisation";
        if (error.code === 1) errorMsg = "Vous avez refusé l'accès à la position";
        if (error.code === 2) errorMsg = "Position introuvable";
        toast.error(errorMsg, { id: "geo" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!db || !restaurantId) return;
    get(ref(db, `vendors/${restaurantId}/ordering_modes`)).then(snap => {
      if (snap.exists()) {
        const modes = snap.val() as string[];
        setVendorModes(modes);
        if (!modes.includes("Livraison")) {
          setDeliveryMode("pickup");
        }
      }
    });
  }, [restaurantId]);

  // Calcul dynamique de la livraison
  const distance = deliveryMode === "delivery" ? estimateDistance(address || "default") : 0;
  const deliveryFee = deliveryMode === "delivery" ? Math.round(distance * RATE_PER_KM) : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour commander");
      navigate("/login");
      return;
    }
    if (deliveryMode === "delivery" && !address.trim()) {
      toast.error("Veuillez indiquer votre adresse de livraison");
      return;
    }

    setIsProcessing(true);

    let actualVendorName = "Restaurant";
    if (restaurantId && db) {
      try {
        const snap = await get(child(ref(db), `vendors/${restaurantId}/name`));
        if (snap.exists()) {
          actualVendorName = snap.val();
        }
      } catch (e) {}
    }

    const orderData = {
      clientId: user.id,
      clientName: `${user.firstName || ""} ${user.name || ""}`.trim(),
      vendorId: restaurantId || "v1",
      vendorName: actualVendorName,
      items: items.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price
      })),
      total: finalTotal,
      deliveryFee,
      deliveryMode,
      distanceKm: distance,
      paymentMethod,
      address: deliveryMode === "delivery" ? address : "Retrait sur place",
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      clearCart();
      navigate(`/app/order/${result.orderId}`);
    }

    setIsProcessing(false);
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center text-gray-200"
        >
          <ShoppingBag size={64} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Votre panier est <span className="text-primary">vide</span></h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Les meilleures saveurs vous attendent !
          </p>
        </div>
        <button
          onClick={() => navigate('/app/decouvrir')}
          className="w-full max-w-xs py-5 rounded-[32px] bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl"
        >
          Explorer les restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Mon <span className="text-primary">Panier</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalItems} article{totalItems > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={clearCart}
          className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-4 p-4 rounded-[32px] bg-white border border-gray-50 shadow-sm"
            >
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-[24px] overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm uppercase truncate leading-tight">{item.product.name}</h3>
                <p className="text-sm font-black text-primary mt-0.5">{item.product.price.toLocaleString()} F</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-sm hover:text-primary transition-colors">
                  <Minus size={14} />
                </button>
                <span className="font-black text-sm w-5 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center shadow-sm hover:bg-primary transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delivery / Pickup Mode */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Mode de réception</h2>
        <div className="grid grid-cols-2 gap-3">
          {[DELIVERY_MODE, PICKUP_MODE].filter(m => m.id === "pickup" || vendorModes.includes("Livraison")).map(mode => {
            const active = deliveryMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setDeliveryMode(mode.id as "delivery" | "pickup")}
                className={`flex flex-col items-center gap-3 p-5 rounded-[28px] border-2 transition-all ${
                  active ? "border-black bg-black text-white shadow-xl" : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                }`}
              >
                <Icon size={24} className={active ? "text-primary" : ""} />
                <span className="font-black text-[10px] uppercase tracking-widest text-center leading-tight">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Address input (delivery only) */}
        <AnimatePresence>
          {deliveryMode === "delivery" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 p-4 rounded-[24px] bg-white border border-gray-100 shadow-sm mt-2">
                <MapPin size={18} className="text-primary mt-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Adresse de livraison</label>
                    <button 
                      onClick={handleLocateMe} 
                      disabled={isLocating}
                      className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:text-black transition-colors"
                    >
                      {isLocating ? <Loader2 size={10} className="animate-spin" /> : <Compass size={10} />}
                      Me localiser
                    </button>
                  </div>
                  <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Ex: Quartier Haïe Vive, Cotonou"
                    className="w-full text-sm font-bold text-black bg-transparent outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
              {address && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Distance estimée</span>
                  <span className="text-[10px] font-black text-primary uppercase">{distance} km · {deliveryFee.toLocaleString()} F</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Mode de paiement</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map(pm => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[24px] border-2 transition-all ${
                paymentMethod === pm.id
                  ? "border-black bg-black text-white shadow-xl"
                  : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${pm.color} flex items-center justify-center text-base`}>{pm.icon}</div>
                <span className="font-black text-xs uppercase tracking-widest">{pm.label}</span>
              </div>
              {paymentMethod === pm.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-[40px] bg-white border border-gray-50 shadow-xl space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Sous-total</span>
            <span className="text-black">{totalPrice.toLocaleString()} F</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>{deliveryMode === "delivery" ? `Livraison (${distance}km × ${RATE_PER_KM}F)` : "Retrait gratuit"}</span>
            <span className={deliveryMode === "pickup" ? "text-emerald-500 font-black" : "text-black"}>
              {deliveryMode === "pickup" ? "GRATUIT" : `${deliveryFee.toLocaleString()} F`}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total à régler</span>
            <p className="text-3xl font-black">{finalTotal.toLocaleString()} F</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full py-6 rounded-[40px] bg-black text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement...
          </span>
        ) : (
          <>Confirmer la commande <ChevronRight size={18} /></>
        )}
      </motion.button>
    </div>
  );
}
