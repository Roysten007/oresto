import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences, ClientNotification } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { ref, onValue, set, update } from "firebase/database";
import { useAuth } from "./AuthContext";

interface ClientContextType {
  preferences: UserPreferences | null;
  location: { lat: number; lng: number } | null;
  city: string | null;
  updateLocation: (lat: number, lng: number, city?: string) => Promise<void>;
  updateCity: (city: string) => Promise<void>;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  favorites: string[];
  toggleFavorite: (vendorId: string) => Promise<void>;
  loyaltyPoints: number;
  updateLoyaltyPoints: (points: number) => Promise<void>;
  notifications: ClientNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem("oresto_onboarding_completed") === "true";
  });
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // Load preferences from Firebase
  useEffect(() => {
    if (!user || !db) return;
    const prefRef = ref(db, `user_preferences/${user.id}`);
    const unsubscribe = onValue(prefRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPreferences(data);
        if (data.location_lat && data.location_lng) {
          setLocation({ lat: data.location_lat, lng: data.location_lng });
        }
        if (data.city) setCity(data.city);
        if (data.favorites) setFavorites(data.favorites);
        if (data.loyalty_points) setLoyaltyPoints(data.loyalty_points);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Load notifications
  useEffect(() => {
    if (!user || !db) return;
    const notifRef = ref(db, `notifications/${user.id}`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNotifications(list);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const updateLocation = async (lat: number, lng: number, cityName?: string) => {
    setLocation({ lat, lng });
    if (cityName) setCity(cityName);
    if (user && db) {
      await update(ref(db, `user_preferences/${user.id}`), {
        location_lat: lat,
        location_lng: lng,
        city: cityName || city
      });
    }
  };

  const updateCity = async (cityName: string) => {
    setCity(cityName);
    if (user && db) {
      await update(ref(db, `user_preferences/${user.id}`), { city: cityName });
    }
  };

  const toggleFavorite = async (vendorId: string) => {
    const newFavs = favorites.includes(vendorId) 
      ? favorites.filter(id => id !== vendorId)
      : [...favorites, vendorId];
    
    setFavorites(newFavs);
    if (user && db) {
      await update(ref(db, `user_preferences/${user.id}`), { favorites: newFavs });
    }
  };

  const updateLoyaltyPoints = async (points: number) => {
    setLoyaltyPoints(points);
    if (user && db) {
      await update(ref(db, `user_preferences/${user.id}`), { loyalty_points: points });
    }
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    localStorage.setItem("oresto_onboarding_completed", "true");
  };

  const markAsRead = async (id: string) => {
    if (user && db) {
      await update(ref(db, `notifications/${user.id}/${id}`), { is_read: true });
    }
  };

  const markAllAsRead = async () => {
    if (user && db && notifications.length > 0) {
      const updates: any = {};
      notifications.forEach(n => {
        if (!n.is_read) updates[`notifications/${user.id}/${n.id}/is_read`] = true;
      });
      await update(ref(db), updates);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <ClientContext.Provider value={{
      preferences,
      location,
      city,
      updateLocation,
      updateCity,
      onboardingCompleted,
      completeOnboarding,
      favorites,
      toggleFavorite,
      loyaltyPoints,
      updateLoyaltyPoints,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error("useClient must be used within a ClientProvider");
  return context;
};
