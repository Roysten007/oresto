/**
 * Transforme une chaîne en slug URL propre, sans accents, sans caractères spéciaux.
 * Exemple: "L'Atelier du Chef & Grillades" -> "latelier-du-chef-grillades"
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "") // Supprime les apostrophes
    .replace(/[^a-z0-9]+/g, "-") // Remplace les caractères non-alphanumériques par des tirets
    .replace(/^-+|-+$/g, "") // Supprime les tirets de début et de fin
    .substring(0, 50); // Limite à 50 caractères
}
