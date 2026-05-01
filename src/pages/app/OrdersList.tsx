import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
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
  
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const filtered = filter === "all" ? orders : orders.filter(o => {
    if (filter === "active") return ["pending", "preparing", "delivering"].includes(o.status);
    return o.status === filter;
  });

  return (
    <div className="py-8 space-y-8 pb-40">
      <div className="space-y-1 px-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Mes <span className="text-primary">Commandes</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} Historique total</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
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
                      <div className="space-y-0.5">
                        <h3 className="font-black text-sm uppercase leading-tight">{order.vendorName}</h3>
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
