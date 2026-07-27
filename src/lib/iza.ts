/**
 * Client IZA — appelle la fonction serverless /api/iza.
 * Aucune clé API ici : tout passe par le serveur (voir api/iza.ts).
 */

export interface IZAResponse {
  text: string;
  functionCalls: { name: string; args: Record<string, any> }[];
}

export async function askIZA(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string,
): Promise<IZAResponse> {
  const res = await fetch("/api/iza", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, history, platformContext }),
  });

  if (!res.ok) {
    let message = "Erreur de communication avec IZA";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // réponse non-JSON, on garde le message générique
    }
    throw new Error(message);
  }

  return res.json();
}
