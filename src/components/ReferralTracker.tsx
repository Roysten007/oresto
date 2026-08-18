import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ReferralTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const refCode = searchParams.get("ref");
      if (refCode && refCode.trim()) {
        const cleanCode = refCode.trim().toUpperCase();
        localStorage.setItem("oresto_referral_code", cleanCode);
        console.log("🔗 Code de parrainage capté et enregistré :", cleanCode);
      }
    } catch (e) {
      console.warn("Erreur ReferralTracker:", e);
    }
  }, [location]);

  return null;
}
