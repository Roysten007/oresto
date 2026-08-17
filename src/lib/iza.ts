import type { IZARequestBody, IZAResponse } from "../../api/_lib/iza-core";

export type { IZAResponse };

/**
 * Service client IZA — communique exclusivement avec le backend sécurisé (/api/iza).
 * La clé API Gemini reste 100% protégée côté serveur et n'est jamais exposée au navigateur.
 */
export async function askIZA(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string,
): Promise<IZAResponse> {
  const body: IZARequestBody = { message: userMessage, history, platformContext };

  try {
    const res = await fetch("/api/iza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur serveur IZA (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("Erreur communication IZA:", err);
    throw new Error(err.message || "Impossible de joindre l'assistant IZA. Veuillez réessayer.");
  }
}
