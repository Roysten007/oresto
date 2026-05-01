import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/mockData";
import { toast } from "sonner";

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
      // Le client essaie d'ajouter un produit d'un autre resto
      // On pourrait afficher une modal ici, mais pour l'instant on prévient
      const confirmClear = window.confirm("Votre panier contient déjà des produits d'un autre restaurant. Voulez-vous vider votre panier pour commander ici ?");
      if (confirmClear) {
        setItems([{ product, quantity: 1 }]);
        setRestaurantId(product.vendorId);
        toast.success(`${product.name} ajouté au nouveau panier`);
      }
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
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
