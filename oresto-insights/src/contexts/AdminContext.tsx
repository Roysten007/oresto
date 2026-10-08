import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

interface AdminState {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  isAdminLoading: boolean;
}

interface AdminContextType extends AdminState {
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLoginWithPasscode: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  adminFailedAttempts: number;
  adminLockedUntil: number | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const ADMIN_SESSION_KEY = "oresto_insights_admin_auth";

async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!db) return false;
  try {
    const adminSnap = await get(ref(db, `admins/${uid}`));
    if (adminSnap.exists() && adminSnap.val() !== false) return true;
  } catch {}
  return false;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(() => {
    const hasSession = typeof window !== "undefined" && sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
    return {
      isAdminAuthenticated: hasSession,
      adminEmail: hasSession ? "direction@oresto.bj" : null,
      isAdminLoading: !hasSession,
    };
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  useEffect(() => {
    // Si déjà authentifié par session, ne pas attendre Firebase
    if (typeof window !== "undefined" && sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
      setState({ isAdminAuthenticated: true, adminEmail: "direction@oresto.bj", isAdminLoading: false });
      return;
    }

    if (!auth) {
      setState((s) => ({ ...s, isAdminLoading: false }));
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && (await checkIsAdmin(fbUser.uid))) {
        setState({ isAdminAuthenticated: true, adminEmail: fbUser.email, isAdminLoading: false });
      } else {
        setState({ isAdminAuthenticated: false, adminEmail: null, isAdminLoading: false });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (lockedUntil && Date.now() >= lockedUntil) {
      setLockedUntil(null);
      setFailedAttempts(0);
    }
  }, [lockedUntil]);

  // Authentification rapide par code d'accès administrateur
  const adminLoginWithPasscode = useCallback(async (passcode: string) => {
    const cleanPass = passcode.trim();
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Trop de tentatives. Accès temporairement verrouillé pendant 15 minutes." };
    }

    // Codes autorisés : Code principal et numéro WhatsApp officiel
    const validPasscodes = ["Oresto2026!", "0146305190", "oresto2026", "+2290146305190"];
    if (validPasscodes.includes(cleanPass)) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      }
      setState({ isAdminAuthenticated: true, adminEmail: "direction@oresto.bj", isAdminLoading: false });
      setFailedAttempts(0);
      return { success: true };
    }

    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    if (newAttempts >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_DURATION);
      return { success: false, error: "Trop de tentatives échouées. Accès verrouillé pendant 15 minutes." };
    }
    return { success: false, error: "Code d'accès administrateur incorrect." };
  }, [failedAttempts, lockedUntil]);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!auth || !db) return { success: false, error: "Service indisponible." };
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Compte verrouillé suite à plusieurs échecs. Réessayez dans 15 minutes." };
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const isAdmin = await checkIsAdmin(cred.user.uid);
      if (!isAdmin) {
        await signOut(auth);
        return { success: false, error: "Ce compte ne possède pas les privilèges administrateur." };
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      }
      setState({ isAdminAuthenticated: true, adminEmail: cred.user.email, isAdminLoading: false });
      setFailedAttempts(0);
      return { success: true };
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        return { success: false, error: "Trop d'échecs. Accès verrouillé pendant 15 minutes." };
      }
      return { success: false, error: "Email ou mot de passe incorrect." };
    }
  }, [failedAttempts, lockedUntil]);

  const adminLogout = useCallback(async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    if (auth) await signOut(auth);
    setState({ isAdminAuthenticated: false, adminEmail: null, isAdminLoading: false });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        ...state,
        adminLogin,
        adminLoginWithPasscode,
        adminLogout,
        adminFailedAttempts: failedAttempts,
        adminLockedUntil: lockedUntil,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
