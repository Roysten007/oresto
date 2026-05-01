/**
 * Service pour communiquer avec Claude (Anthropic)
 * Note: En production, il est fortement recommandé de passer par un proxy (Backend ou Cloud Function)
 * pour ne pas exposer votre clé API dans le navigateur.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function askClaude(prompt: string, history: { role: string; content: string }[] = []) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("La clé API Anthropic (VITE_ANTHROPIC_API_KEY) n'est pas configurée dans le fichier .env");
  }

  // Préparation du système de messages pour Claude
  // On convertit l'historique au format attendu (Claude sépare system, user, assistant)
  const messages = history.map(msg => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content
  }));

  // On ajoute le message actuel
  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true" // Nécessaire pour le dev direct
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: "Tu es Oresto IA, un assistant expert pour la plateforme Oresto Connect. Ton but est d'aider les administrateurs et les vendeurs à optimiser leur restaurant, gérer leurs stocks et comprendre leurs ventes. Sois professionnel, bienveillant et concis.",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erreur de communication avec Claude");
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Claude API Error:", error);
    throw error;
  }
}
