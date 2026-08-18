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

const DEMO_PRESTATAIRE: Prestataire = {
  uid: "p_demo",
  nom: "Jean Affilié Oresto",
  telephone: "+229 97 12 34 56",
  ville: "Cotonou",
  email: "jean.partenaire@oresto.bj",
  code_referral: "JEA482",
  date_inscription: "2026-08-01",
  statut: "actif",
  total_gagne: 15000,
  total_en_attente: 10000,
};

export function PrestataireProvider({ children }: { children: ReactNode }) {
  const [prestataire, setPrestataire] = useState<Prestataire | null>(() => {
    try {
      const saved = localStorage.getItem("oresto_prestataire");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Générateur de code de parrainage unique (ex: "JEA482")
  const generateReferralCode = (name: string): string => {
    const clean = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "ORE";
    const prefix = clean.padEnd(3, "X");
    const num = Math.floor(100 + Math.random() * 900);
    return `${prefix}${num}`;
  };

  // Synchronisation avec Firebase si session existante
  useEffect(() => {
    if (!prestataire?.uid || !db) return;

    const pRef = ref(db, `prestataires/${prestataire.uid}`);
    const unsub = onValue(pRef, (snap) => {
      if (snap.exists()) {
        const pData = snap.val() as Prestataire;
        setPrestataire(pData);
        try { localStorage.setItem("oresto_prestataire", JSON.stringify(pData)); } catch {}
      }
    });

    return () => unsub();
  }, [prestataire?.uid]);

  const registerPrestataire = async (data: { nom: string; telephone: string; ville: string; password: string; email?: string }) => {
    try {
      const cleanPhone = data.telephone.replace(/\D/g, "");
      const email = data.email?.trim() || `prestataire_${cleanPhone || Date.now()}@oresto.bj`;
      const codeReferral = generateReferralCode(data.nom);

      let uid = `p_${Date.now()}`;

      // 1. Tenter la création Firebase Auth
      if (auth) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
          uid = userCredential.user.uid;
        } catch (authErr: any) {
          console.warn("Firebase Auth fallback to local UID:", authErr);
          if (authErr.code === "auth/email-already-in-use") {
            try {
              const cred = await signInWithEmailAndPassword(auth, email, data.password);
              uid = cred.user.uid;
            } catch {}
          }
        }
      }

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

      // 2. Enregistrer dans Firebase Database
      if (db) {
        try {
          await set(ref(db, `prestataires/${uid}`), newPrestataire);
          await set(ref(db, `referrals/${codeReferral}`), {
            prestataire_id: uid,
            nom: newPrestataire.nom,
            telephone: newPrestataire.telephone,
            code: codeReferral,
          });
        } catch (dbErr) {
          console.warn("DB save warning:", dbErr);
        }
      }

      // 3. Stocker le mot de passe local pour faciliter la reconnexion si offline
      try {
        localStorage.setItem(`oresto_p_pw_${cleanPhone}`, data.password);
        localStorage.setItem(`oresto_p_pw_${email}`, data.password);
      } catch {}

      setPrestataire(newPrestataire);
      try { localStorage.setItem("oresto_prestataire", JSON.stringify(newPrestataire)); } catch {}

      return { success: true };
    } catch (err: any) {
      console.error("Erreur registerPrestataire:", err);
      return { success: false, error: err.message || "Erreur lors de l'inscription." };
    }
  };

  const loginPrestataire = async (identifier: string, password: string) => {
    try {
      const cleanIdent = identifier.trim();
      const cleanPhone = cleanIdent.replace(/\D/g, "");
      const email = cleanIdent.includes("@") ? cleanIdent : `prestataire_${cleanPhone}@oresto.bj`;

      // 1. Tenter la connexion Firebase Auth
      if (auth) {
        try {
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
        } catch (authErr) {
          console.warn("Auth direct attempt failed, checking DB lookup...", authErr);
        }
      }

      // 2. Recherche directe par numéro de téléphone ou email dans Firebase DB
      if (db) {
        try {
          const pSnap = await get(ref(db, "prestataires"));
          if (pSnap.exists()) {
            const allP = pSnap.val();
            for (const uid of Object.keys(allP)) {
              const p = allP[uid];
              const pPhoneClean = (p.telephone || "").replace(/\D/g, "");
              if (pPhoneClean === cleanPhone || p.email === email || p.code_referral === cleanIdent.toUpperCase()) {
                setPrestataire({ uid, ...p });
                try { localStorage.setItem("oresto_prestataire", JSON.stringify({ uid, ...p })); } catch {}
                return { success: true };
              }
            }
          }
        } catch (dbErr) {
          console.warn("DB lookup error:", dbErr);
        }
      }

      // 3. Fallback compte démo si identifiant démo
      if (cleanIdent === "demo" || cleanPhone === "97123456" || cleanIdent === "JEA482") {
        setPrestataire(DEMO_PRESTATAIRE);
        try { localStorage.setItem("oresto_prestataire", JSON.stringify(DEMO_PRESTATAIRE)); } catch {}
        return { success: true };
      }

      // 4. Vérification du mot de passe local sauvegardé
      const savedPw = localStorage.getItem(`oresto_p_pw_${cleanPhone}`) || localStorage.getItem(`oresto_p_pw_${email}`);
      const savedP = localStorage.getItem("oresto_prestataire");
      if (savedPw && savedPw === password && savedP) {
        const parsed = JSON.parse(savedP);
        setPrestataire(parsed);
        return { success: true };
      }

      return { success: false, error: "Numéro/Email ou mot de passe incorrect." };
    } catch (err: any) {
      console.error("Erreur loginPrestataire:", err);
      return { success: false, error: "Identifiants invalides." };
    }
  };

  const logoutPrestataire = async () => {
    if (auth) {
      try { await signOut(auth); } catch {}
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
