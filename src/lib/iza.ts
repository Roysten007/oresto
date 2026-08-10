import { runIZA, IZARequestBody, IZAResponse } from "../../api/_lib/iza-core";

export type { IZAResponse };

export async function askIZA(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string,
): Promise<IZAResponse> {
  const body: IZARequestBody = { message: userMessage, history, platformContext };

  // 1. Essayer le serveur Vercel /api/iza
  try {
    const res = await fetch("/api/iza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Si l'API serveur échoue (ex: dev local Vite sans Vercel), fallback sur l'appel direct
  }

  // 2. Fallback client-side avec la clé d'environnement VITE_GEMINI_API_KEY
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API Gemini non configurée.");
  }

  return await runIZA(body, apiKey);
}
