import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { ref, get, set, update, onValue } from "firebase/database";
import { Prestataire } from "@/data/prestataireTypes";

interface PrestataireContextType {
  prestataire: Prestataire | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registerPrestataire: (data: { nom: string; telephone: string; ville: string; password: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  loginPrestataire: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutPrestataire: () => Promise<void>;
}

const PrestataireContext = createContext<PrestataireContextType | null>(null);

export function PrestataireProvider({ children }: { children: ReactNode }) {
  const [prestataire, setPrestataire] = useState<Prestataire | null>(() => {
    try {
      const saved = localStorage.getItem("oresto_prestataire");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Générateur de code de parrainage unique (ex: "JEA482")
  const generateReferralCode = (name: string): string => {
    const clean = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "ORE";
    const prefix = clean.padEnd(3, "X");
    const num = Math.floor(100 + Math.random() * 900);
    return `${prefix}${num}`;
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    let unsubDb: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        if (db) {
          const pRef = ref(db, `prestataires/${fbUser.uid}`);
          unsubDb = onValue(pRef, (snap) => {
            if (snap.exists()) {
              const pData = snap.val() as Prestataire;
              setPrestataire(pData);
              try { localStorage.setItem("oresto_prestataire", JSON.stringify(pData)); } catch {}
            }
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } else {
        if (unsubDb) unsubDb();
        setPrestataire(null);
        try { localStorage.removeItem("oresto_prestataire"); } catch {}
        setIsLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubDb) unsubDb();
    };
  }, []);

  const registerPrestataire = async (data: { nom: string; telephone: string; ville: string; password: string; email?: string }) => {
    try {
      if (!auth) {
        return { success: false, error: "Firebase Auth non configuré" };
      }

      // Email effectif pour Firebase Auth
      const cleanPhone = data.telephone.replace(/\D/g, "");
      const email = data.email?.trim() || `prestataire_${cleanPhone || Date.now()}@oresto.bj`;

      // 1. Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
      const uid = userCredential.user.uid;

      // 2. Générer le code referral
      const codeReferral = generateReferralCode(data.nom);

      const newPrestataire: Prestataire = {
        uid,
        nom: data.nom.trim(),
        telephone: data.telephone.trim(),
        ville: data.ville.trim(),
        email,
        code_referral: codeReferral,
        date_inscription: new Date().toISOString(),
        statut: "actif",
        total_gagne: 0,
        total_en_attente: 0,
      };

      // 3. Enregistrer dans la base de données
      if (db) {
        await set(ref(db, `prestataires/${uid}`), newPrestataire);
        // Index referral pour recherche rapide
        await set(ref(db, `referrals/${codeReferral}`), {
          prestataire_id: uid,
          nom: newPrestataire.nom,
          telephone: newPrestataire.telephone,
          code: codeReferral,
        });
      }

      setPrestataire(newPrestataire);
      try { localStorage.setItem("oresto_prestataire", JSON.stringify(newPrestataire)); } catch {}

      return { success: true };
    } catch (err: any) {
      console.error("Erreur registerPrestataire:", err);
      let errorMsg = "Erreur lors de la création du compte";
      if (err.code === "auth/email-already-in-use") errorMsg = "Ce numéro ou email est déjà utilisé";
      if (err.code === "auth/weak-password") errorMsg = "Le mot de passe doit comporter au moins 6 caractères";
      return { success: false, error: errorMsg };
    }
  };

  const loginPrestataire = async (identifier: string, password: string) => {
    try {
      if (!auth) return { success: false, error: "Firebase Auth non configuré" };

      // Identifier peut être un email ou un téléphone
      let email = identifier.trim();
      if (!email.includes("@")) {
        const cleanPhone = email.replace(/\D/g, "");
        email = `prestataire_${cleanPhone}@oresto.bj`;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      if (db) {
        const snap = await get(ref(db, `prestataires/${uid}`));
        if (snap.exists()) {
          const pData = snap.val() as Prestataire;
          setPrestataire(pData);
          try { localStorage.setItem("oresto_prestataire", JSON.stringify(pData)); } catch {}
          return { success: true };
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("Erreur loginPrestataire:", err);
      let errorMsg = "Identifiants incorrects";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMsg = "Numéro/Email ou mot de passe incorrect";
      }
      return { success: false, error: errorMsg };
    }
  };

  const logoutPrestataire = async () => {
    if (auth) {
      await signOut(auth);
    }
    setPrestataire(null);
    try { localStorage.removeItem("oresto_prestataire"); } catch {}
  };

  return (
    <PrestataireContext.Provider
      value={{
        prestataire,
        isAuthenticated: !!prestataire,
        isLoading,
        registerPrestataire,
        loginPrestataire,
        logoutPrestataire,
      }}
    >
      {children}
    </PrestataireContext.Provider>
  );
}

export function usePrestataire() {
  const context = useContext(PrestataireContext);
  if (!context) {
    throw new Error("usePrestataire doit être utilisé dans un PrestataireProvider");
  }
  return context;
}
