import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Order } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, update, get, child } from "firebase/database";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!db || !user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        })) as Order[];
        
        // Filter orders for current user (client or vendor)
        const filteredOrders = ordersList.filter(o => 
          o.clientId === user.id || o.vendorId === user.vendorId
        );
        
        setOrders(filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const placeOrder = async (orderData: Partial<Order>) => {
    if (!db) return { success: false, error: "Base de données non disponible" };
    
    try {
      const ordersRef = ref(db, "orders");
      const newOrderRef = push(ordersRef);
      const orderId = newOrderRef.key;
      
      const fullOrder = {
        ...orderData,
        id: orderId,
        status: "pending",
        date: new Date().toISOString(),
      };

      await set(newOrderRef, fullOrder);
      
      // Update vendor stats (totalOrders)
      if (orderData.vendorId) {
        const vendorOrdersRef = ref(db, `vendors/${orderData.vendorId}/totalOrders`);
        const snapshot = await get(vendorOrdersRef);
        const currentTotal = snapshot.exists() ? snapshot.val() : 0;
        await set(vendorOrdersRef, currentTotal + 1);
      }

      toast.success("Commande passée avec succès !");
      return { success: true, orderId: orderId || undefined };
    } catch (error) {
      console.error("Erreur commande:", error);
      toast.error("Impossible de passer la commande");
      return { success: false, error: "Erreur serveur" };
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    if (!db) return;
    try {
      await update(ref(db, `orders/${orderId}`), { status });
      toast.info(`Commande mise à jour : ${status}`);
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
