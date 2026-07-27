import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runIZA } from "./_lib/iza-core";

/**
 * Fonction serverless Vercel — point d'entrée de l'assistant IZA.
 * La clé Anthropic est lue depuis l'environnement serveur (ANTHROPIC_API_KEY),
 * jamais exposée au navigateur.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY non configurée côté serveur." });
    return;
  }

  try {
    const result = await runIZA(req.body, apiKey);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("IZA error:", error);
    res.status(500).json({ error: error?.message || "Erreur de communication avec IZA" });
  }
}
