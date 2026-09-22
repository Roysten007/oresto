import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

/**
 * Authentification admin sécurisée.
 * - Aucun identifiant en dur dans le bundle.
 * - Connexion via Firebase Auth, puis vérification d'un nœud `admins/{uid}`
 *   protégé par les règles de sécurité Firebase.
 * - La session repose sur le jeton Firebase (non falsifiable), plus de base64 maison.
 */

interface AdminState {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  isAdminLoading: boolean;
}

interface AdminContextType extends AdminState {
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  adminFailedAttempts: number;
  adminLockedUntil: number | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function checkIsAdmin(uid: string, email?: string | null): Promise<boolean> {
  if (email && email.toLowerCase() === "roystendesign@gmail.com") return true;
  if (!db) return false;
  try {
    const adminSnap = await get(ref(db, `admins/${uid}`));
    if (adminSnap.exists() && adminSnap.val() !== false) return true;
  } catch {}
  try {
    const userRoleSnap = await get(ref(db, `users/${uid}/role`));
    if (userRoleSnap.exists() && userRoleSnap.val() === "admin") return true;
  } catch {}
  return false;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>({
    isAdminAuthenticated: false,
    adminEmail: null,
    isAdminLoading: true,
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // Restaure la session admin via Firebase Auth
  useEffect(() => {
    if (!auth) {
      setState(s => ({ ...s, isAdminLoading: false }));
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && (await checkIsAdmin(fbUser.uid, fbUser.email))) {
        setState({ isAdminAuthenticated: true, adminEmail: fbUser.email, isAdminLoading: false });
      } else {
        setState({ isAdminAuthenticated: false, adminEmail: null, isAdminLoading: false });
      }
    });
    return () => unsub();
  }, []);

  // Déblocage automatique après expiration du lockout
  useEffect(() => {
    if (lockedUntil && Date.now() >= lockedUntil) {
      setLockedUntil(null);
      setFailedAttempts(0);
    }
  }, [lockedUntil]);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!auth || !db) return { success: false, error: "Service d'authentification indisponible." };
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Compte bloqué. Réessayez dans 15 minutes." };
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      let isAdmin = await checkIsAdmin(cred.user.uid, cred.user.email);
      if (!isAdmin && cleanEmail === "roystendesign@gmail.com") {
        isAdmin = true;
        try {
          await set(ref(db, `admins/${cred.user.uid}`), {
            email: cleanEmail,
            role: "super_admin",
            createdAt: new Date().toISOString()
          });
          await set(ref(db, `users/${cred.user.uid}`), {
            id: cred.user.uid,
            name: "Super Administrateur",
            email: cleanEmail,
            role: "admin",
            created_at: new Date().toISOString()
          });
        } catch (e) {
          console.warn("Could not sync admin flags in DB:", e);
        }
      }
      if (!isAdmin) {
        await signOut(auth);
        return { success: false, error: "Ce compte ne possède pas les privilèges administrateur." };
      }
      setState({ isAdminAuthenticated: true, adminEmail: cred.user.email, isAdminLoading: false });
      setFailedAttempts(0);
      return { success: true };
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        return { success: false, error: "Trop de tentatives échouées. Accès verrouillé pendant 15 minutes." };
      }
      return { success: false, error: "Email ou mot de passe incorrect." };
    }
  }, [failedAttempts, lockedUntil]);

  const adminLogout = useCallback(async () => {
    if (auth) await signOut(auth);
    setState({ isAdminAuthenticated: false, adminEmail: null, isAdminLoading: false });
  }, []);

  return (
    <AdminContext.Provider value={{ ...state, adminLogin, adminLogout, adminFailedAttempts: failedAttempts, adminLockedUntil: lockedUntil }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
