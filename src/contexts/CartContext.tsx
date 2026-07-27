import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/mockData";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  restaurantId: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [pendingSwitch, setPendingSwitch] = useState<Product | null>(null);

  // Persistence
  useEffect(() => {
    const savedCart = localStorage.getItem("oresto_cart");
    if (savedCart) {
      try {
        const { items, restaurantId } = JSON.parse(savedCart);
        setItems(items);
        setRestaurantId(restaurantId);
      } catch (e) {
        console.error("Erreur chargement panier:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("oresto_cart", JSON.stringify({ items, restaurantId }));
  }, [items, restaurantId]);

  const addToCart = (product: Product) => {
    if (restaurantId && restaurantId !== product.vendorId) {
      setPendingSwitch(product);
      return;
    }

    setRestaurantId(product.vendorId);
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.product.id !== productId);
      if (newItems.length === 0) setRestaurantId(null);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleSwitchConfirm = () => {
    if (!pendingSwitch) return;
    setItems([{ product: pendingSwitch, quantity: 1 }]);
    setRestaurantId(pendingSwitch.vendorId);
    toast.success(`${pendingSwitch.name} ajouté au nouveau panier`);
    setPendingSwitch(null);
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      restaurantId
    }}>
      {children}
      <AlertDialog open={!!pendingSwitch} onOpenChange={(open) => !open && setPendingSwitch(null)}>
        <AlertDialogContent className="rounded-3xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-lg uppercase tracking-tight">
              🏪 Changer de restaurant ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[11px] font-bold text-gray-500 leading-relaxed">
              Ton panier contient déjà des articles d'un autre restaurant.
              <br /><br />
              Veux-tu vider ton panier pour ajouter <strong className="text-black">{pendingSwitch?.name}</strong> à la place ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="rounded-full text-[10px] font-black uppercase tracking-widest px-6">
              Non, merci
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSwitchConfirm} className="rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 hover:bg-primary">
              Oui, vider le panier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
