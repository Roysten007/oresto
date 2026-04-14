import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface AdminState {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
}

interface AdminContextType extends AdminState {
  adminLogin: (email: string, password: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  adminFailedAttempts: number;
  adminLockedUntil: number | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_EMAIL = "admin@oresto.com";
const ADMIN_PASSWORD = "oresto2025!";
const ADMIN_SESSION = 15 * 60 * 1000;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>({ isAdminAuthenticated: false, adminEmail: null });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const token = localStorage.getItem("oresto_admin_token");
    if (token) {
      try {
        const data = JSON.parse(atob(token));
        if (data.exp > Date.now()) {
          setState({ isAdminAuthenticated: true, adminEmail: data.email });
        } else {
          localStorage.removeItem("oresto_admin_token");
        }
      } catch { localStorage.removeItem("oresto_admin_token"); }
    }
  }, []);

  useEffect(() => {
    if (!state.isAdminAuthenticated) return;
    const resetActivity = () => setLastActivity(Date.now());
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetActivity));
    return () => events.forEach(e => window.removeEventListener(e, resetActivity));
  }, [state.isAdminAuthenticated]);

  useEffect(() => {
    if (!state.isAdminAuthenticated) return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivity >= ADMIN_SESSION) {
        adminLogout();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [state.isAdminAuthenticated, lastActivity]);

  const adminLogin = useCallback((email: string, password: string) => {
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Compte bloqué. Réessayez dans 15 minutes." };
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = btoa(JSON.stringify({ email, exp: Date.now() + ADMIN_SESSION }));
      localStorage.setItem("oresto_admin_token", token);
      setState({ isAdminAuthenticated: true, adminEmail: email });
      setFailedAttempts(0);
      setLastActivity(Date.now());
      return { success: true };
    }
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    if (newAttempts >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_DURATION);
      return { success: false, error: "Compte bloqué pendant 15 minutes." };
    }
    return { success: false, error: "Identifiants incorrects." };
  }, [failedAttempts, lockedUntil]);

  const adminLogout = useCallback(() => {
    localStorage.removeItem("oresto_admin_token");
    setState({ isAdminAuthenticated: false, adminEmail: null });
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
