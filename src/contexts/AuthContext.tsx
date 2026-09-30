import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, VendorProfile } from "@/data/mockData";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  sendEmailVerification
} from "firebase/auth";
import { ref, get, set, update, child, onValue } from "firebase/database";
import { calculateTrialDates } from "@/services/subscriptionService";
import { dispatchVendorNotification } from "@/services/notificationService";
import { slugify } from "@/lib/slugify";
import { getStarterProducts, BusinessSector, setVendorSector } from "@/lib/vendorSector";

interface AuthState {
  user: User | null;
  role: "client" | "vendor" | null;
  vendorProfile: VendorProfile | null;
  userVendors: VendorProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  loginAsGuest: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; error?: string; role?: string; uid?: string }>;
  switchVendor: (vendorId: string) => Promise<void>;
  updateVendorBusinessType: (businessType: BusinessSector) => Promise<void>;
  createEstablishment: (data: {
    name: string;
    business_type: BusinessSector;
    city: string;
    neighborhood?: string;
    whatsapp?: string;
    phone?: string;
    category?: string;
    billingCycle?: "monthly" | "annual";
  }) => Promise<{ success: boolean; vendorId?: string; error?: string }>;
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

const DEMO_VENDOR: VendorProfile = {
  id: "v_demo",
  userId: "u_demo",
  name: "Ma Boutique Tendance",
  description: "Boutique officielle de mode, sneakers streetwear et accessoires tendance",
  category: "Boutique & E-Commerce",
  categories: ["Mode, Vêtements & Prêt-à-porter", "Chaussures & Sneakers Streetwear", "High-Tech & Gadgets"],
  business_type: "ecommerce",
  status: "active",
  joinedDate: "2026-01-01",
  plan: "pro",
  subscriptionPlan: "pro",
  subscriptionStatus: "active",
  trialStartedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  trialEndsAt: new Date(Date.now() + 11 * 86400000).toISOString(),
  nextBillingDate: new Date(Date.now() + 11 * 86400000).toISOString(),
  verified: true,
  open: true,
  phone: "+229 97 00 00 00",
  whatsapp: "+229 97 00 00 00",
  city: "Cotonou",
  neighborhood: "Haie Vive",
  logo_url: "",
  cover_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  primary_color: "#9333EA",
  secondary_color: "#FFFFFF",
  slug: "ma-boutique",
  is_published: true,
  rating: 4.9,
  reviewCount: 48,
  totalSales: 1250000,
  totalOrders: 184,
  revenue: 1250000,
  deliveryTime: "24-48h",
  payment_methods: ["MTN MoMo", "Moov Money", "Espèces"],
  ordering_modes: ["Livraison Express", "Retrait Point Relais"],
  sections_config: { hero: true, menu: true, daily: true, footer: true }
};

const DEMO_USER: User = {
  id: "u_demo",
  name: "Responsable Boutique",
  firstName: "Chef",
  email: "contact@oresto.me",
  password: "",
  role: "vendor",
  phone: "+229 97 00 00 00",
  verificationMethod: "email",
  phoneVerified: true,
  vendorId: "v_demo",
  city: "Cotonou",
  neighborhood: "Haie Vive"
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ 
    user: null, 
    role: null, 
    vendorProfile: null, 
    userVendors: [],
    isAuthenticated: false, 
    isLoading: true 
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionWarning, setSessionWarning] = useState(false);

  // Écouteur global de Firebase Auth
  useEffect(() => {
    if (!auth) {
      setState({ user: null, role: null, vendorProfile: null, userVendors: [], isAuthenticated: false, isLoading: false });
      return;
    }
    let unsubUser: (() => void) | null = null;
    let unsubVendor: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous listeners
      if (unsubUser) { unsubUser(); unsubUser = null; }
      if (unsubVendor) { unsubVendor(); unsubVendor = null; }

      if (firebaseUser) {
        if (!db) {
          setState({ 
            user: { id: firebaseUser.uid, name: firebaseUser.email || "Utilisateur", firstName: "", email: firebaseUser.email || "", password: "", role: "vendor" }, 
            role: "vendor", 
            vendorProfile: null, 
            userVendors: [],
            isAuthenticated: true, 
            isLoading: false 
          });
          return;
        }

        // 1. Vérification Admin prioritaire
        const isSuperAdminEmail = (firebaseUser.email || "").toLowerCase() === "roystendesign@gmail.com";
        let isConfirmedAdmin = isSuperAdminEmail;

        if (!isConfirmedAdmin) {
          try {
            const adminSnap = await get(ref(db, `admins/${firebaseUser.uid}`));
            if (adminSnap.exists() && adminSnap.val() !== false) isConfirmedAdmin = true;
          } catch {}
        }

        if (isConfirmedAdmin) {
          const adminUser: User = {
            id: firebaseUser.uid,
            name: "Super Administrateur",
            firstName: "Admin",
            email: firebaseUser.email || "roystendesign@gmail.com",
            role: "admin" as any,
            created_at: new Date().toISOString()
          };
          setState({
            user: adminUser,
            role: "admin" as any,
            vendorProfile: null,
            userVendors: [],
            isAuthenticated: true,
            isLoading: false
          });
          setLastActivity(Date.now());
          return;
        }

        // 2. Utilisateur Vendeur ou Client
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        unsubUser = onValue(userRef, async (userSnap) => {
          if (!userSnap.exists()) {
            // Vérifier encore une fois admin
            try {
              const aSnap = await get(ref(db, `admins/${firebaseUser.uid}`));
              if (aSnap.exists()) {
                const adminUser: User = {
                  id: firebaseUser.uid,
                  name: "Administrateur",
                  email: firebaseUser.email || "",
                  role: "admin" as any,
                  created_at: new Date().toISOString()
                };
                setState({
                  user: adminUser,
                  role: "admin" as any,
                  vendorProfile: null,
                  userVendors: [],
                  isAuthenticated: true,
                  isLoading: false
                });
                return;
              }
            } catch {}

            // Fallback profil vendeur pour ce nouvel inscrit
            const defaultVendorId = `v_${firebaseUser.uid}`;
            const fallbackUser: User = {
              id: firebaseUser.uid,
              name: (firebaseUser.email || "").split("@")[0] || "Restaurateur",
              firstName: "",
              email: firebaseUser.email || "",
              password: "",
              role: "vendor",
              vendorId: defaultVendorId
            };
            const fallbackVendor = { ...DEMO_VENDOR, id: defaultVendorId, userId: firebaseUser.uid };
            setState({
              user: fallbackUser,
              role: "vendor",
              vendorProfile: fallbackVendor,
              userVendors: [fallbackVendor],
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }

          const userData = userSnap.val() as User;
          const effectiveRole = userData.role === "admin" ? "admin" : "vendor";
          const effectiveVendorId = userData.vendorId || `v_${firebaseUser.uid}`;
          
          if (effectiveRole === "admin") {
            setState({
              user: userData,
              role: "admin" as any,
              vendorProfile: null,
              userVendors: [],
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }

          // Écoute en temps réel de tous les établissements
          if (unsubVendor) unsubVendor();
          unsubVendor = onValue(ref(db, "vendors"), (vendorsSnap) => {
            const allVendors = vendorsSnap.exists() ? (vendorsSnap.val() as Record<string, VendorProfile>) : {};
            
            // Tous les établissements appartenant à l'utilisateur
            let myVendors: VendorProfile[] = Object.entries(allVendors)
              .map(([id, val]: [string, any]) => ({ id, ...val } as VendorProfile))
              .filter(v => v.userId === firebaseUser.uid || v.id === effectiveVendorId || (userData as any)?.vendorIds?.includes(v.id));

            if (myVendors.length === 0) {
              const fallbackVendor: VendorProfile = {
                ...DEMO_VENDOR,
                id: effectiveVendorId,
                userId: firebaseUser.uid,
                name: userData.name || "Mon Établissement",
              };
              myVendors = [fallbackVendor];
            }

            // Déterminer l'établissement actif :
            // 1. Choix persisté dans localStorage s'il fait partie de myVendors
            // 2. userData.vendorId s'il fait partie de myVendors
            // 3. Premier établissement de la liste
            const savedActiveId = typeof window !== "undefined" ? localStorage.getItem("oresto_active_vendor_id") : null;
            const activeVendor = myVendors.find(v => v.id === savedActiveId) 
              || myVendors.find(v => v.id === userData.vendorId) 
              || myVendors.find(v => v.id === effectiveVendorId)
              || myVendors[0];

            const activeVendorId = activeVendor?.id || effectiveVendorId;

            if (typeof window !== "undefined" && activeVendor) {
              try {
                localStorage.setItem("oresto_active_vendor_id", activeVendor.id);
                localStorage.setItem("oresto_vendor_profile", JSON.stringify(activeVendor));
              } catch {}
            }

            setState({
              user: { ...userData, role: "vendor", vendorId: activeVendorId },
              role: "vendor",
              vendorProfile: activeVendor,
              userVendors: myVendors,
              isAuthenticated: true,
              isLoading: false
            });
          });
          setLastActivity(Date.now());
        }, (err) => {
          console.error("Auth DB Error:", err);
          setState({ 
            user: { id: firebaseUser.uid, name: firebaseUser.email || "Utilisateur", firstName: "", email: firebaseUser.email || "", password: "", role: "vendor" }, 
            role: "vendor", 
            vendorProfile: DEMO_VENDOR, 
            userVendors: [DEMO_VENDOR],
            isAuthenticated: true, 
            isLoading: false 
          });
        });
      } else {
        // Déconnecté propre : aucun utilisateur actif
        setState({ user: null, role: null, vendorProfile: null, userVendors: [], isAuthenticated: false, isLoading: false });
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
      const mockVendorId = "v_mock_" + cleanEmail.split("@")[0];
      const mockUser: User = {
        id: "mock_" + cleanEmail.split("@")[0],
        name: cleanEmail === "kofi@test.com" ? "Kofi Test" : "Aminat Test",
        firstName: cleanEmail === "kofi@test.com" ? "Kofi" : "Aminat",
        email: cleanEmail,
        password: "",
        role: "vendor",
        phone: "+229 00000000",
        city: "Cotonou",
        neighborhood: "Cadjèhoun",
        vendorId: mockVendorId
      };
      
      const mockVendor: VendorProfile = {
        id: mockVendorId,
        userId: mockUser.id,
        name: cleanEmail === "kofi@test.com" ? "Kofi's Restaurant" : "Aminat's Kitchen",
        description: "Boutique de test Oresto B2B",
        category: "Restaurants",
        status: "active",
        joinedDate: "2024-01-01",
        plan: "pro",
        subscriptionPlan: "pro",
        subscriptionStatus: "trial",
        verified: true,
        open: true
      } as any;

      setState({
        user: mockUser,
        role: "vendor",
        vendorProfile: mockVendor,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true, role: "vendor" };
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

      // 1. Détection Admin immédiate
      let isAdminAccount = cleanEmail === "roystendesign@gmail.com";
      if (!isAdminAccount) {
        try {
          const adminSnap = await get(ref(db, `admins/${uid}`));
          if (adminSnap.exists() && adminSnap.val() !== false) isAdminAccount = true;
        } catch {}
      }

      if (isAdminAccount) {
        const adminUser: User = {
          id: uid,
          name: "Super Administrateur",
          firstName: "Admin",
          email: cleanEmail,
          role: "admin" as any,
          created_at: new Date().toISOString()
        };
        try {
          await set(ref(db, `admins/${uid}`), {
            email: cleanEmail,
            role: "super_admin",
            createdAt: new Date().toISOString()
          });
          await set(ref(db, `users/${uid}`), adminUser);
        } catch {}

        setState({
          user: adminUser,
          role: "admin" as any,
          vendorProfile: null,
          isAuthenticated: true,
          isLoading: false
        });
        setFailedAttempts(0);
        setLastActivity(Date.now());
        return { success: true, role: "admin" };
      }

      // 2. Fetch user data pour Vendeur / Client
      let userSnap = await get(child(ref(db), `users/${uid}`));
      const defaultVendorId = `v_${uid}`;
      
      if (!userSnap.exists()) {
        console.warn("User profile missing in DB, creating...");
        const newUser = {
          id: uid,
          name: cleanEmail.split("@")[0],
          email: cleanEmail,
          role: "vendor",
          vendorId: defaultVendorId,
          created_at: new Date().toISOString()
        };
        try {
          await set(ref(db, `users/${uid}`), newUser);
          userSnap = await get(child(ref(db), `users/${uid}`));
        } catch (dbErr) {
          console.error("Database write error during login:", dbErr);
        }
      }

      const rawUserData = userSnap.exists() ? userSnap.val() as User : { id: uid, email: cleanEmail, role: "vendor" } as User;
      const role = rawUserData.role === "admin" ? "admin" : "vendor";
      const vendorId = rawUserData.vendorId || defaultVendorId;
      
      const userData: User = {
        ...rawUserData,
        role: role as any,
        vendorId: vendorId
      };

      let vendorData: VendorProfile | null = null;

      if (vendorId) {
        try {
          const vendorSnap = await get(child(ref(db), `vendors/${vendorId}`));
          if (vendorSnap.exists()) {
            vendorData = vendorSnap.val() as VendorProfile;
          } else {
            // Auto-create vendor profile if it doesn't exist yet
            const { trialStartedAt, trialEndsAt } = calculateTrialDates();
            vendorData = {
              id: vendorId,
              userId: uid,
              name: userData.name || cleanEmail.split("@")[0],
              description: "Mon Établissement",
              category: "Restaurants",
              status: "active",
              joinedDate: new Date().toISOString().split("T")[0],
              plan: "pro",
              subscriptionPlan: "pro",
              subscriptionStatus: "trial",
              trialStartedAt,
              trialEndsAt,
              nextBillingDate: trialEndsAt,
              verified: true,
              open: true,
              deliveryTime: "30-45 min"
            } as any;
            try {
              await set(ref(db, `vendors/${vendorId}`), vendorData);
            } catch (e) {
              console.error("Error creating vendor profile fallback:", e);
            }
          }
        } catch (vErr) {
          console.error("Vendor fetch error:", vErr);
        }
      }

      setState({
        user: userData,
        role: role as any,
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
    return { success: false, error: "La connexion invité n'est plus disponible." };
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut error:", e);
      }
    }
    setState({
      user: null,
      role: null,
      vendorProfile: null,
      isAuthenticated: false,
      isLoading: false
    });
    setSessionWarning(false);
  }, []);

  const register = useCallback(async (data: any) => {
    if (!auth || !db) return { success: false, error: "Firebase n'est pas configuré" };
    
    try {
      // 1. Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email!, data.password);
      const uid = userCredential.user.uid;

      // 1b. Envoyer l'email de vérification
      try {
        await sendEmailVerification(userCredential.user);
        console.log("Email de vérification envoyé à", data.email);
      } catch (emailErr) {
        console.error("Erreur envoi email vérification:", emailErr);
        // On ne bloque pas l'inscription si l'email échoue
      }

      // 2. Préparer les données
      let vendorId = data.vendorId || `v_${uid}`;
      
      const newUser: User = {
        id: uid,
        name: `${data.firstName || ""} ${data.name || ""}`.trim(),
        firstName: data.firstName || "",
        email: data.email || "",
        password: "", 
        role: "vendor",
        phone: data.phone || "",
        verificationMethod: data.verificationMethod || "email",
        phoneVerified: false,
        vendorId: vendorId,
        city: data.city || "",
        neighborhood: data.neighborhood || "",
      };

      // 3. Sauvegarder dans Realtime Database (Écriture atomique pour éviter les race conditions de onValue)
      const dbUpdates: Record<string, any> = {
        [`users/${uid}`]: newUser,
      };

      let createdVendorProfile: VendorProfile | null = null;

      // 4. On crée le profil vendeur
      if (vendorId) {
        const { trialStartedAt, trialEndsAt } = calculateTrialDates();
        const selectedPlan = data.subscriptionPlan === "pro" ? "pro" : "starter";

        // Recherche du code de parrainage apporteur d'affaires (prestataire)
        let refCode = data.referral_code || "";
        if (!refCode && typeof window !== "undefined") {
          try {
            refCode = localStorage.getItem("oresto_referral_code") || "";
          } catch {}
        }

        let matchedPrestataireId: string | null = null;
        if (refCode && db) {
          try {
            const refSnap = await get(ref(db, `referrals/${refCode.toUpperCase()}`));
            if (refSnap.exists()) {
              matchedPrestataireId = refSnap.val().prestataire_id || null;
            }
          } catch (refErr) {
            console.warn("Erreur recherche referral code:", refErr);
          }
        }

        const shopTitle = (data.shopName || `${data.firstName || "Mon"} Commerce`).trim();
        const rawSlug = slugify(shopTitle);
        const cleanSlug = rawSlug && rawSlug.length >= 3 ? rawSlug : `boutique-${Date.now().toString().slice(-5)}`;
        const bType = (data.business_type || "restaurant") as BusinessSector;

        createdVendorProfile = {
          id: vendorId,
          userId: uid,
          name: shopTitle,
          slug: cleanSlug,
          description: bType === "ecommerce" 
            ? "Boutique en ligne officielle. Articles de qualité, livraison rapide et service client réactif." 
            : bType === "hotel" 
            ? "Hôtel de charme et résidence de haut standing. Chambres confortables et services personnalisés." 
            : "Restaurant et saveurs authentiques. Cuisine raffinée, grillades braisées et spécialités du terroir.",
          category: data.category || (bType === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : bType === "hotel" ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades"),
          categories: [data.category || (bType === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : bType === "hotel" ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades")],
          business_type: bType,
          rating: 4.9,
          reviewCount: 3,
          totalSales: 0,
          totalOrders: 0,
          revenue: 0,
          phone: data.shopPhone || data.phone || "+229 97 00 00 00",
          whatsapp: data.shopPhone || data.phone || "+229 97 00 00 00",
          city: data.city || "Cotonou",
          neighborhood: data.neighborhood || "Haie Vive",
          status: "active",
          joinedDate: new Date().toISOString().split("T")[0],
          plan: selectedPlan,
          subscriptionPlan: selectedPlan,
          subscriptionStatus: "trial",
          trialStartedAt,
          trialEndsAt,
          nextBillingDate: trialEndsAt,
          pendingInvoice: null,
          paymentHistory: [],
          verified: true,
          open: true,
          is_published: true,
          primary_color: bType === "ecommerce" ? "#000000" : bType === "hotel" ? "#4F46E5" : "#EA580C",
          secondary_color: "#FFFFFF",
          font_choice: "modern",
          payment_methods: ["MTN MoMo", "Moov Money", "Espèces"],
          ordering_modes: bType === "ecommerce" 
            ? ["Livraison Express", "Retrait Point Relais"] 
            : bType === "hotel" 
            ? ["Réservation Directe", "Paiement à l'arrivée"] 
            : ["Livraison", "À Emporter", "WhatsApp Direct"],
          deliveryTime: "30-45 min",
          prestataire_id: matchedPrestataireId,
          referral_code: matchedPrestataireId ? refCode.toUpperCase() : null
        };
        dbUpdates[`vendors/${vendorId}`] = createdVendorProfile;
        dbUpdates[`slugs/${cleanSlug}`] = { vendorId: vendorId };

        // Génération et insertion des 3 premiers articles/chambres de démonstration
        const starterProducts = getStarterProducts(bType, vendorId);
        for (const p of starterProducts) {
          dbUpdates[`products/${p.id}`] = p;
        }

        // Sauvegarde immédiate dans le stockage local pour affichage instantané
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("oresto_vendor_profile", JSON.stringify(createdVendorProfile));
            localStorage.setItem(`oresto_products_${vendorId}`, JSON.stringify(starterProducts));
          } catch {}
        }

        // Si apporté par un prestataire : création de la commission 20%
        if (matchedPrestataireId) {
          const commId = `comm_${Date.now()}`;
          const currentMonth = new Date().toISOString().slice(0, 7);
          const montantAbonnement = 5000; // Tarif officiel unique Oresto Pro 5 000 FCFA
          const montantCommission = Math.round(montantAbonnement * 0.20); // 20% récurrents = 1 000 FCFA

          dbUpdates[`commissions/${commId}`] = {
            id: commId,
            prestataire_id: matchedPrestataireId,
            client_id: vendorId,
            client_name: createdVendorProfile.name,
            client_category: createdVendorProfile.category,
            client_city: createdVendorProfile.city,
            mois: currentMonth,
            montant_abonnement: montantAbonnement,
            montant_commission: montantCommission,
            statut: "en_attente",
            date_paiement: null,
            created_at: new Date().toISOString()
          };

          try {
            localStorage.removeItem("oresto_referral_code");
          } catch {}
        }
      }

      await update(ref(db), dbUpdates);

      if (vendorId && createdVendorProfile) {
        // Envoyer la notification de bienvenue essai gratuit
        try {
          await dispatchVendorNotification(db, vendorId, "welcome_trial", {
            plan: createdVendorProfile.subscriptionPlan,
            trialEndsAt: createdVendorProfile.trialEndsAt,
            phone: createdVendorProfile.phone,
            email: data.email,
          });
        } catch (nErr) {
          console.warn("Erreur envoi notification bienvenue:", nErr);
        }
      }

      setLastActivity(Date.now());
      // Trigger a state update immediately with what we have
      setState({
        user: newUser,
        role: newUser.role,
        vendorProfile: createdVendorProfile,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true, role: newUser.role, uid };
    } catch (error: any) {
      console.error("Erreur inscription Firebase:", error);
      
      // Si l'email existe déjà dans Firebase Auth, tenter une connexion directe et mettre à jour le restaurant
      if (error.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, data.email!, data.password);
          const uid = userCredential.user.uid;
          const vendorId = data.vendorId || `v_${uid}`;
          
          const newUser: User = {
            id: uid,
            name: `${data.firstName || ""} ${data.name || ""}`.trim() || data.email!.split("@")[0],
            firstName: data.firstName || "",
            email: data.email || "",
            password: "",
            role: "vendor",
            phone: data.phone || "",
            verificationMethod: data.verificationMethod || "email",
            phoneVerified: false,
            vendorId: vendorId,
            city: data.city || "",
            neighborhood: data.neighborhood || "",
          };

          const { trialStartedAt, trialEndsAt } = calculateTrialDates();
          const existingVendorSnap = await get(child(ref(db), `vendors/${vendorId}`));
          const existingVendor = existingVendorSnap.exists() ? existingVendorSnap.val() as VendorProfile : null;

          const updatedVendorProfile: VendorProfile = {
            ...(existingVendor || {}),
            id: vendorId,
            userId: uid,
            name: data.shopName || existingVendor?.name || `${data.firstName || "Mon"} Restaurant`,
            category: data.category || existingVendor?.category || "Restaurants",
            city: data.city || existingVendor?.city || "",
            neighborhood: data.neighborhood || existingVendor?.neighborhood || "",
            phone: data.shopPhone || data.phone || existingVendor?.phone || "",
            whatsapp: data.shopPhone || data.phone || existingVendor?.whatsapp || "",
            subscriptionPlan: "pro",
            plan: "pro",
            subscriptionStatus: existingVendor?.subscriptionStatus || "trial",
            trialStartedAt: existingVendor?.trialStartedAt || trialStartedAt,
            trialEndsAt: existingVendor?.trialEndsAt || trialEndsAt,
            nextBillingDate: existingVendor?.nextBillingDate || trialEndsAt,
          } as any;

          await update(ref(db), {
            [`users/${uid}`]: newUser,
            [`vendors/${vendorId}`]: updatedVendorProfile
          });

          setState({
            user: newUser,
            role: "vendor",
            vendorProfile: updatedVendorProfile,
            isAuthenticated: true,
            isLoading: false
          });

          return { success: true, role: "vendor", uid };
        } catch (loginErr: any) {
          return { 
            success: false, 
            error: "Cet email possède déjà un compte avec un mot de passe différent. Cliquez sur 'Se connecter' ci-dessous." 
          };
        }
      }

      let errMsg = "Une erreur est survenue lors de l'inscription.";
      if (error.code === 'auth/weak-password') errMsg = "Le mot de passe doit faire au moins 6 caractères.";
      else if (error.code === 'auth/invalid-email') errMsg = "L'adresse email saisie est invalide.";
      else if (error.message) errMsg = error.message;

      return { success: false, error: errMsg };
    }
  }, []);

  const switchVendor = useCallback(async (newVendorId: string) => {
    if (!newVendorId) return;
    const target = state.userVendors.find(v => v.id === newVendorId);
    if (!target) {
      console.warn("Établissement introuvable dans la liste:", newVendorId);
      return;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("oresto_active_vendor_id", newVendorId);
        localStorage.setItem("oresto_vendor_profile", JSON.stringify(target));
      } catch {}
    }

    if (auth?.currentUser && db) {
      try {
        await update(ref(db, `users/${auth.currentUser.uid}`), {
          vendorId: newVendorId
        });
      } catch (e) {
        console.warn("Erreur mise à jour vendorId:", e);
      }
    }

    if (target.business_type) {
      setVendorSector(target.business_type as BusinessSector);
    }

    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, vendorId: newVendorId } : null,
      vendorProfile: target
    }));
  }, [state.userVendors]);

  const updateVendorBusinessType = useCallback(async (newSector: BusinessSector) => {
    if (!state.vendorProfile) return;
    const vendorId = state.vendorProfile.id;

    setVendorSector(newSector);
    const updatedCategory = newSector === "ecommerce"
      ? "Boutique & E-Commerce"
      : newSector === "hotel"
      ? "Hôtel & Résidence"
      : "Restaurant & Cuisine";

    const updatedProfile: VendorProfile = {
      ...state.vendorProfile,
      business_type: newSector,
      category: updatedCategory,
      primary_color: newSector === "ecommerce" ? "#9333EA" : newSector === "hotel" ? "#4F46E5" : "#EA580C",
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("oresto_active_workspace", newSector);
        localStorage.setItem("oresto_vendor_profile", JSON.stringify(updatedProfile));
      } catch {}
    }

    setState(prev => ({
      ...prev,
      vendorProfile: updatedProfile,
      userVendors: prev.userVendors.map(v => v.id === vendorId ? { ...v, business_type: newSector, category: updatedCategory } : v)
    }));

    if (db && vendorId) {
      try {
        await update(ref(db, `vendors/${vendorId}`), {
          business_type: newSector,
          category: updatedCategory
        });
      } catch (err) {
        console.warn("Erreur mise à jour business_type Firebase:", err);
      }
    }
  }, [state.vendorProfile]);

  const createEstablishment = useCallback(async (data: {
    name: string;
    business_type: BusinessSector;
    city: string;
    neighborhood?: string;
    whatsapp?: string;
    phone?: string;
    category?: string;
    billingCycle?: "monthly" | "annual";
  }) => {
    if (!auth?.currentUser || !db) {
      return { success: false, error: "Vous devez être connecté pour ajouter un établissement." };
    }

    const uid = auth.currentUser.uid;
    const isAnnual = data.billingCycle === "annual";

    try {
      const newVendorId = `v_${uid}_${Date.now().toString(36)}`;
      const rawSlug = slugify(data.name.trim());
      const cleanSlug = rawSlug && rawSlug.length >= 3 ? rawSlug : `commerce-${Date.now().toString().slice(-5)}`;
      const bType = data.business_type || "restaurant";

      const activeVendor = state.vendorProfile;
      const { trialStartedAt, trialEndsAt } = calculateTrialDates();
      const planId = isAnnual ? "annual" : "monthly";
      const nextBilling = isAnnual ? trialEndsAt + 365 * 24 * 60 * 60 * 1000 : trialEndsAt;

      const newVendor: VendorProfile = {
        id: newVendorId,
        userId: uid,
        name: data.name.trim(),
        slug: cleanSlug,
        business_type: bType,
        category: data.category || (bType === "ecommerce" ? "Mode & Boutique" : bType === "hotel" ? "Hôtel & Résidence" : "Restaurant & Grillades"),
        categories: [data.category || (bType === "ecommerce" ? "Mode & Boutique" : bType === "hotel" ? "Hôtel & Résidence" : "Restaurant & Grillades")],
        city: data.city.trim() || activeVendor?.city || "Cotonou",
        neighborhood: data.neighborhood?.trim() || activeVendor?.neighborhood || "Haie Vive",
        phone: data.phone?.trim() || activeVendor?.phone || "+229 97 00 00 00",
        whatsapp: data.whatsapp?.trim() || activeVendor?.whatsapp || "+229 97 00 00 00",
        description: bType === "ecommerce"
          ? "Boutique en ligne officielle. Articles de qualité et livraison rapide."
          : bType === "hotel"
          ? "Hôtel de charme et résidence de haut standing. Chambres confortables."
          : "Restaurant et saveurs authentiques. Cuisine raffinée et grillades.",
        status: "active",
        is_published: true,
        open: true,
        rating: 5.0,
        reviewCount: 1,
        totalSales: 0,
        totalOrders: 0,
        revenue: 0,
        joinedDate: new Date().toISOString().split("T")[0],
        plan: planId,
        subscriptionPlan: planId,
        subscriptionStatus: "trial",
        trialStartedAt,
        trialEndsAt,
        nextBillingDate: nextBilling,
        verified: true,
        primary_color: bType === "ecommerce" ? "#000000" : bType === "hotel" ? "#4F46E5" : "#EA580C",
        secondary_color: "#FFFFFF",
        payment_methods: ["MTN MoMo", "Moov Money", "Espèces"],
        ordering_modes: bType === "ecommerce"
          ? ["Livraison Express", "Retrait Point Relais"]
          : bType === "hotel"
          ? ["Réservation Directe", "Paiement à l'arrivée"]
          : ["Livraison", "À Emporter", "WhatsApp Direct"],
        deliveryTime: "30-45 min"
      };

      const starterProducts = getStarterProducts(bType, newVendorId);

      const dbUpdates: Record<string, any> = {
        [`vendors/${newVendorId}`]: newVendor,
        [`slugs/${cleanSlug}`]: { vendorId: newVendorId },
        [`users/${uid}/vendorId`]: newVendorId,
      };

      for (const p of starterProducts) {
        dbUpdates[`products/${p.id}`] = p;
      }

      await update(ref(db), dbUpdates);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("oresto_active_vendor_id", newVendorId);
          localStorage.setItem("oresto_vendor_profile", JSON.stringify(newVendor));
          localStorage.setItem(`oresto_products_${newVendorId}`, JSON.stringify(starterProducts));
        } catch {}
      }

      setVendorSector(bType);

      setState(prev => {
        const updatedList = [...prev.userVendors.filter(v => v.id !== newVendorId), newVendor];
        return {
          ...prev,
          user: prev.user ? { ...prev.user, vendorId: newVendorId } : null,
          vendorProfile: newVendor,
          userVendors: updatedList,
        };
      });

      return { success: true, vendorId: newVendorId };
    } catch (err: any) {
      console.error("Erreur création nouvel établissement:", err);
      return { success: false, error: err.message || "Erreur lors de la création de l'établissement." };
    }
  }, [state.userVendors, state.vendorProfile]);

  const dismissWarning = useCallback(() => {
    setSessionWarning(false);
    setLastActivity(Date.now());
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login,
      loginAsGuest,
      logout,
      register,
      switchVendor,
      updateVendorBusinessType,
      createEstablishment,
      failedAttempts, 
      lockedUntil, 
      sessionWarning, 
      dismissWarning 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      role: null,
      vendorProfile: null,
      userVendors: [],
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false }),
      loginAsGuest: async () => ({ success: false }),
      logout: async () => {},
      register: async () => ({ success: false }),
      switchVendor: async () => {},
      updateVendorBusinessType: async () => {},
      createEstablishment: async () => ({ success: false }),
      failedAttempts: 0,
      lockedUntil: null,
      sessionWarning: false,
      dismissWarning: () => {},
    };
  }
  return ctx;
}

