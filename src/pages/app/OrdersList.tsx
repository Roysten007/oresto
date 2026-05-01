import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, get, child } from "firebase/database";

function VendorNameDisplay({ vendorId, fallbackName }: { vendorId: string, fallbackName: string }) {
  const [name, setName] = useState(fallbackName || "Restaurant Inconnu");

  useEffect(() => {
    if (!vendorId || !db) return;
    if (fallbackName && fallbackName !== "Restaurant" && fallbackName !== "Restaurant Inconnu") return;
    
    get(child(ref(db), `vendors/${vendorId}/name`)).then(snap => {
      if (snap.exists()) {
        setName(snap.val());
      }
    }).catch(() => {});
  }, [vendorId, fallbackName]);

  return <>{name}</>;
}
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  XCircle, 
  ChevronRight,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: "En attente", color: "text-orange-500", bg: "bg-orange-50", icon: Clock },
  preparing: { label: "Préparation", color: "text-blue-500", bg: "bg-blue-50", icon: Package },
  delivering: { label: "En route", color: "text-purple-500", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Livré", color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 },
  cancelled: { label: "Annulé", color: "text-red-500", bg: "bg-red-50", icon: XCircle },
};

export default function OrdersList() {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const filtered = orders.filter(o => {
    // Status
    if (filter === "active" && !["pending", "preparing", "delivering"].includes(o.status)) return false;
    if (filter !== "all" && filter !== "active" && o.status !== filter) return false;

    // Time
    if (timeFilter !== "all" && o.createdAt) {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === "7days" && diffDays > 7) return false;
      if (timeFilter === "1month" && diffDays > 30) return false;
      if (timeFilter === "3months" && diffDays > 90) return false;
    }
    return true;
  });

  return (
    <div className="py-8 space-y-8 pb-40">
      <div className="space-y-1 px-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Mes <span className="text-primary">Commandes</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} Historique total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 px-2">
        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "Toutes" },
            { key: "active", label: "En cours" },
            { key: "delivered", label: "Livrées" },
            { key: "cancelled", label: "Annulées" }
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === f.key ? "bg-black text-white shadow-xl" : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Time Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "Tout le temps" },
            { key: "7days", label: "7 derniers jours" },
            { key: "1month", label: "Mois en cours" },
            { key: "3months", label: "3 derniers mois" }
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setTimeFilter(f.key)}
              className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                timeFilter === f.key ? "bg-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 px-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <ShoppingBag size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase">Aucune commande</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Il est temps de se faire plaisir !</p>
              </div>
              <button 
                onClick={() => navigate('/app/decouvrir')}
                className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest"
              >
                Commander
              </button>
            </motion.div>
          ) : (
            filtered.map(order => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div 
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-[40px] border border-gray-50 shadow-sm space-y-6 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center`}>
                        <StatusIcon size={24} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-black text-xs uppercase tracking-widest truncate">
                          <VendorNameDisplay vendorId={order.vendorId} fallbackName={order.vendorName} />
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${config.bg} ${config.color} text-[9px] font-black uppercase tracking-widest`}>
                      {config.label}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-gray-50 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-gray-500">
                        <span>{item.qty}x {item.name}</span>
                        <span className="text-black">{item.price.toLocaleString()} F</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Total réglé</p>
                      <p className="text-xl font-black">{order.total.toLocaleString()} F</p>
                    </div>
                    <div className="flex gap-3">
                      <Link 
                        to={`/app/order/${order.id}`} 
                        className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg"
                      >
                        <ChevronRight size={20} />
                      </Link>
                      {order.status === "delivered" && (
                        <Link 
                          to={`/app/rate/${order.id}`} 
                          className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg"
                        >
                          <Star size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
