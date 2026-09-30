import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runIZA } from "./_lib/iza-core.js";

/**
 * Route serverless IZI IA — point d'entrée unique.
 * Cascade : Gemini → NVIDIA NIM → Mistral → Fallback local
 * Les clés API sont lues côté serveur uniquement, jamais exposées au navigateur.
 *
 * Body attendu :
 *   { message, history?, platformContext?, mode: "landing" | "dashboard" }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const keys = {
    gemini: process.env.GEMINI_API_KEY || undefined,
    nvidia: process.env.NVIDIA_API_KEY || undefined,
    mistral: process.env.MISTRAL_API_KEY || undefined,
  };

  // Au moins un provider doit être configuré
  if (!keys.gemini && !keys.nvidia && !keys.mistral) {
    // Pas d'erreur 500 : on laisse runIZA utiliser le fallback local
    console.warn("[IZI] Aucune clé API configurée — mode fallback local");
  }

  try {
    const result = await runIZA(req.body, keys);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("[IZI] Erreur handler:", error);
    res.status(500).json({ error: error?.message || "Erreur de communication avec IZI IA" });
  }
}

