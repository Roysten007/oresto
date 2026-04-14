import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { mockUsers, mockVendors, User, VendorProfile } from "@/data/mockData";

interface AuthState {
  user: User | null;
  role: "client" | "vendor" | null;
  vendorProfile: VendorProfile | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => { success: boolean; error?: string };
  failedAttempts: number;
  lockedUntil: number | null;
  sessionWarning: boolean;
  dismissWarning: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_DURATION = 30 * 60 * 1000; // 30 min
const WARNING_BEFORE = 5 * 60 * 1000; // 5 min before
const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, role: null, vendorProfile: null, isAuthenticated: false });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionWarning, setSessionWarning] = useState(false);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("oresto_token");
    const userData = localStorage.getItem("oresto_user");
    if (token && userData) {
      try {
        const user = JSON.parse(userData) as User;
        const vendor = user.vendorId ? mockVendors.find(v => v.id === user.vendorId) || null : null;
        setState({ user, role: user.role, vendorProfile: vendor, isAuthenticated: true });
      } catch { localStorage.removeItem("oresto_token"); localStorage.removeItem("oresto_user"); }
    }
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

  const login = useCallback((email: string, password: string) => {
    if (lockedUntil && Date.now() < lockedUntil) {
      return { success: false, error: "Compte bloqué. Réessayez dans 15 minutes." };
    }
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        return { success: false, error: "Compte bloqué pendant 15 minutes." };
      }
      return { success: false, error: "Identifiants incorrects." };
    }
    const vendor = user.vendorId ? mockVendors.find(v => v.id === user.vendorId) || null : null;
    const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + SESSION_DURATION }));
    localStorage.setItem("oresto_token", token);
    localStorage.setItem("oresto_user", JSON.stringify(user));
    setState({ user, role: user.role, vendorProfile: vendor, isAuthenticated: true });
    setFailedAttempts(0);
    setLastActivity(Date.now());
    return { success: true };
  }, [failedAttempts, lockedUntil]);

  const logout = useCallback(() => {
    localStorage.removeItem("oresto_token");
    localStorage.removeItem("oresto_user");
    setState({ user: null, role: null, vendorProfile: null, isAuthenticated: false });
    setSessionWarning(false);
  }, []);

  const register = useCallback((data: Partial<User> & { password: string }) => {
    const exists = mockUsers.find(u => u.email === data.email);
    if (exists) return { success: false, error: "Cet email est déjà utilisé." };
    const newUser: User = {
      id: `u${Date.now()}`,
      name: `${data.firstName || ""} ${data.name || ""}`.trim(),
      firstName: data.firstName || "",
      email: data.email || "",
      password: data.password,
      role: data.role || "client",
      phone: data.phone,
      vendorId: data.vendorId,
      city: data.city,
      neighborhood: data.neighborhood,
    };
    mockUsers.push(newUser);
    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + SESSION_DURATION }));
    localStorage.setItem("oresto_token", token);
    localStorage.setItem("oresto_user", JSON.stringify(newUser));
    setState({ user: newUser, role: newUser.role, vendorProfile: null, isAuthenticated: true });
    setLastActivity(Date.now());
    return { success: true };
  }, []);

  const dismissWarning = useCallback(() => {
    setSessionWarning(false);
    setLastActivity(Date.now());
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, failedAttempts, lockedUntil, sessionWarning, dismissWarning }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
