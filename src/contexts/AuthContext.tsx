import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, VendorProfile } from "@/data/mockData";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";
import { ref, get, set, child, onValue } from "firebase/database";

interface AuthState {
  user: User | null;
  role: "client" | "vendor" | null;
  vendorProfile: VendorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  loginAsGuest: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; error?: string; role?: string; uid?: string }>;
  failedAttempts: number;
  lockedUntil: number | null;
  sessionWarning: boolean;
  dismissWarning: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_DURATION = 30 * 60 * 1000; // 30 min
const WARNING_BEFORE = 5 * 60 * 1000;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ 
    user: null, role: null, vendorProfile: null, isAuthenticated: false, isLoading: true 
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionWarning, setSessionWarning] = useState(false);

  // Écouteur global de Firebase Auth
  useEffect(() => {
    if (!auth) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }
    let unsubUser: (() => void) | null = null;
    let unsubVendor: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous listeners
      if (unsubUser) { unsubUser(); unsubUser = null; }
      if (unsubVendor) { unsubVendor(); unsubVendor = null; }

      if (firebaseUser) {
        if (!db) {
          setState(s => ({ ...s, isLoading: false }));
          return;
        }

        const userRef = ref(db, `users/${firebaseUser.uid}`);
        unsubUser = onValue(userRef, async (userSnap) => {
          if (!userSnap.exists()) {
            console.log("User profile missing in DB, waiting...");
            // If it's a fresh registration, the profile might be created in a few ms.
            // We give it a short window before giving up.
            setTimeout(() => {
              if (state.isLoading) {
                 setState(s => ({ ...s, isLoading: false, isAuthenticated: false }));
              }
            }, 2000);
            return;
          }

          const userData = userSnap.val() as User;
          
          if (userData.vendorId) {
            if (unsubVendor) unsubVendor();
            unsubVendor = onValue(ref(db, `vendors/${userData.vendorId}`), (vendorSnap) => {
              const vendorData = vendorSnap.exists() ? vendorSnap.val() as VendorProfile : null;
              setState({
                user: userData,
                role: userData.role as any,
                vendorProfile: vendorData,
                isAuthenticated: true,
                isLoading: false
              });
            });
          } else {
            setState({
              user: userData,
              role: userData.role as any,
              vendorProfile: null,
              isAuthenticated: true,
              isLoading: false
            });
          }
          setLastActivity(Date.now());
        }, (err) => {
          console.error("Auth DB Error:", err);
          setState(s => ({ ...s, isLoading: false }));
        });
      } else {
        setState({ user: null, role: null, vendorProfile: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      unsubscribe();
      if (unsubUser) unsubUser();
      if (unsubVendor) unsubVendor();
    };
  }, []);

  // Activity tracking
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const resetActivity = () => setLastActivity(Date.now());
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetActivity));
    return () => events.forEach(e => window.removeEventListener(e, resetActivity));
  }, [state.isAuthenticated]);

  // Session timeout
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      if (elapsed >= SESSION_DURATION) {
        logout();
      } else if (elapsed >= SESSION_DURATION - WARNING_BEFORE) {
        setSessionWarning(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, lastActivity]);

  // Check lockout
  useEffect(() => {
    if (lockedUntil && Date.now() >= lockedUntil) {
      setLockedUntil(null);
      setFailedAttempts(0);
    }
  }, [lockedUntil]);

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // === Dev Fallback for test accounts ===
    const isDemoAccount = (cleanEmail === "aminat@test.com" || cleanEmail === "aminata@test.com" || cleanEmail === "kofi@test.com") && cleanPassword === "password";
    
    if (isDemoAccount) {
      console.log("Demo login triggered for:", cleanEmail);
      const mockUser: User = {
        id: "mock_" + cleanEmail.split("@")[0],
        name: cleanEmail === "kofi@test.com" ? "Kofi Test" : "Aminat Test",
        firstName: cleanEmail === "kofi@test.com" ? "Kofi" : "Aminat",
        email: cleanEmail,
        password: "",
        role: cleanEmail === "kofi@test.com" ? "vendor" : "client",
        phone: "+229 00000000",
        city: "Cotonou",
        neighborhood: "Cadjèhoun",
        vendorId: cleanEmail === "kofi@test.com" ? "v_mock_kofi" : undefined
      };
      
      let mockVendor: VendorProfile | null = null;
      if (mockUser.vendorId) {
        mockVendor = {
          id: mockUser.vendorId,
          userId: mockUser.id,
          name: "Kofi's Shop",
          description: "Boutique de test",
          category: "Restaurants",
          status: "active",
          joinedDate: "2024-01-01",
          verified: true,
          open: true
        } as any;
      }

      setState({
        user: mockUser,
        role: mockUser.role as any,
        vendorProfile: mockVendor,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true, role: mockUser.role };
    }

    if (!auth || !db) {
      console.error("Firebase not initialized");
      return { success: false, error: "Le service d'authentification est indisponible." };
    }
    
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Compte bloqué. Réessayez dans 15 minutes." };
    }
    
    try {
      console.log("Attempting Firebase login for:", cleanEmail);
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const uid = userCredential.user.uid;

      // Fetch user data
      let userSnap = await get(child(ref(db), `users/${uid}`));
      
      if (!userSnap.exists()) {
        console.warn("User profile missing in DB, creating...");
        const newUser = {
          id: uid,
          name: cleanEmail.split("@")[0],
          email: cleanEmail,
          role: "client",
          created_at: new Date().toISOString()
        };
        try {
          await set(ref(db, `users/${uid}`), newUser);
          userSnap = await get(child(ref(db), `users/${uid}`));
        } catch (dbErr) {
          console.error("Database write error during login:", dbErr);
          // Still allow login but warn
        }
      }

      const userData = userSnap.exists() ? userSnap.val() as User : { id: uid, email: cleanEmail, role: "client" } as User;
      let vendorData: VendorProfile | null = null;

      if (userData.vendorId) {
        try {
          const vendorSnap = await get(child(ref(db), `vendors/${userData.vendorId}`));
          if (vendorSnap.exists()) {
            vendorData = vendorSnap.val() as VendorProfile;
          }
        } catch (vErr) {
          console.error("Vendor fetch error:", vErr);
        }
      }

      const role = userData.role;

      setState({
        user: userData,
        role: role,
        vendorProfile: vendorData,
        isAuthenticated: true,
        isLoading: false
      });

      setFailedAttempts(0);
      setLastActivity(Date.now());
      return { success: true, role };
    } catch (error: any) {
      console.error("Firebase Login Error:", error.code, error.message);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        return { success: false, error: "Compte bloqué pendant 15 minutes." };
      }
      
      let errMsg = "Email ou mot de passe incorrect.";
      if (error.code === 'auth/network-request-failed') errMsg = "Problème de connexion réseau.";
      if (error.code === 'auth/user-not-found') errMsg = "Cet utilisateur n'existe pas.";
      
      return { success: false, error: errMsg };
    }
  }, [failedAttempts, lockedUntil]);

  const loginAsGuest = useCallback(async () => {
    if (!auth) return { success: false, error: "Auth non initialisé" };
    try {
      const cred = await signInAnonymously(auth);
      if (db) {
        // Enregistrer le profil invité en base
        await set(child(ref(db), `users/${cred.user.uid}`), {
          id: cred.user.uid,
          role: "client",
          name: "Invité",
          firstName: "Client",
          email: "invite@oresto.app",
          isGuest: true,
          created_at: new Date().toISOString()
        });
      }
      return { success: true };
    } catch (error: any) {
      console.error("Erreur connexion invité:", error);
      return { success: false, error: "Impossible de continuer sans compte." };
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth) await signOut(auth);
    setSessionWarning(false);
  }, []);

  const register = useCallback(async (data: any) => {
    if (!auth || !db) return { success: false, error: "Firebase n'est pas configuré" };
    
    try {
      // 1. Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email!, data.password);
      const uid = userCredential.user.uid;

      // 2. Préparer les données
      let vendorId = data.vendorId || (data.role === "vendor" ? `v_${uid}` : null);
      
      const newUser: User = {
        id: uid,
        name: `${data.firstName || ""} ${data.name || ""}`.trim(),
        firstName: data.firstName || "",
        email: data.email || "",
        password: "", 
        role: data.role || "client",
        phone: data.phone || "",
        verificationMethod: data.verificationMethod || "email",
        phoneVerified: false,
        vendorId: vendorId,
        city: data.city || "",
        neighborhood: data.neighborhood || "",
      };

      // 3. Sauvegarder l'utilisateur dans Realtime Database
      await set(ref(db, `users/${uid}`), newUser);

      // 4. Si c'est un vendeur, on crée aussi un profil vendeur
      if (data.role === "vendor" && vendorId) {
        const newVendorProfile: VendorProfile = {
          id: vendorId,
          userId: uid,
          name: data.shopName || `${data.firstName} Store`,
          description: "Nouvelle boutique",
          category: data.category || "Général",
          rating: 0,
          reviewCount: 0,
          totalSales: 0,
          totalOrders: 0,
          revenue: 0,
          phone: data.shopPhone || data.phone || "",
          whatsapp: data.shopPhone || data.phone || "",
          city: data.city || "",
          neighborhood: data.neighborhood || "",
          status: "pending",
          joinedDate: new Date().toISOString().split("T")[0],
          plan: "starter",
          verified: false,
          open: false,
          deliveryTime: "30-45 min"
        };
        await set(ref(db, `vendors/${vendorId}`), newVendorProfile);
      }

      setLastActivity(Date.now());
      // Trigger a state update immediately with what we have
      setState({
        user: newUser,
        role: newUser.role,
        vendorProfile: null, // Will be fetched by onValue listener starting up
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true, role: newUser.role, uid };
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: "Cet email est déjà utilisé." };
      }
      return { success: false, error: "Une erreur est survenue lors de l'inscription." };
    }
  }, []);

  const dismissWarning = useCallback(() => {
    setSessionWarning(false);
    setLastActivity(Date.now());
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login,
      loginAsGuest,
      logout,
      register,
      failedAttempts, lockedUntil, sessionWarning, dismissWarning }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

