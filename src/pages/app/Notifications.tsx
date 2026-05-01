import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Check, Trash2, Clock, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClient } from "@/contexts/ClientContext";

const mockNotifications = [
  { id: 1, title: "Commande confirmée", message: "Votre commande chez 'Burger King' est en préparation.", time: "Il y a 2 min", type: "order", read: false },
  { id: 2, title: "Livreur en route", message: "Moussa est en chemin avec votre délicieux repas !", time: "Il y a 15 min", type: "delivery", read: false },
  { id: 3, title: "Points de fidélité", message: "Félicitations ! Vous avez gagné 50 points Oresto.", time: "Hier", type: "loyalty", read: true },
  { id: 4, title: "Promotion exclusive", message: "-20% sur tout le menu chez 'Pizza Hut' aujourd'hui.", time: "Il y a 2 jours", type: "promo", read: true },
];

export default function Notifications() {
  const navigate = useNavigate();
  const { markAllAsRead } = useClient();
  const [notifications, setNotifications] = useState(mockNotifications);

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag size={18} />;
      case "delivery": return <Clock size={18} />;
      case "loyalty": return <Star size={18} />;
      case "promo": return <MessageCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <div className="py-8 space-y-8 pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Centre <span className="text-primary">Notifications</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Restez informé de vos commandes</p>
          </div>
        </div>
        <button 
          onClick={markAllAsRead}
          className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all"
          title="Tout marquer comme lu"
        >
          <Check size={20} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="px-2 space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <Bell size={40} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucune notification</p>
            </motion.div>
          ) : (
            notifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className={`group relative p-6 rounded-[32px] border transition-all ${
                  n.read ? "bg-white border-gray-50" : "bg-white border-primary/20 shadow-lg shadow-primary/5"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    n.read ? "bg-gray-50 text-gray-400" : "bg-primary/10 text-primary"
                  }`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xs font-black uppercase tracking-tight ${n.read ? "text-gray-600" : "text-black"}`}>
                        {n.title}
                      </h3>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{n.time}</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
                
                {/* Delete button on hover */}
                <button 
                  onClick={() => deleteNotification(n.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>

                {!n.read && (
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary" />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
