import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "restaurant" | "store" | "hotel";
  jsonLd?: Record<string, any> | null;
}

/**
 * Composant de gestion SEO dynamique (Title, Meta, OpenGraph, Twitter, Canonical & Schema.org JSON-LD)
 */
export default function SEOHead({
  title,
  description = "Créez et gérez votre vitrine en ligne, vos commandes directes et vos encaissements Mobile Money avec Oresto.",
  keywords = [
    "oresto",
    "site restaurant",
    "boutique en ligne bénin",
    "menu qr code",
    "mobile money mtn moov",
    "commande whatsapp",
    "vitrine hôtel",
    "commerce afrique"
  ],
  image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  url,
  type = "website",
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title.includes("Oresto") ? title : `${title} | Oresto`;
    document.title = fullTitle;

    // Helper pour mettre à jour ou créer une balise meta
    const setMeta = (nameAttr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameAttr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper pour mettre à jour ou créer une balise link
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "https://oresto.app");

    // 2. Meta Standard
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords.join(", "));
    setMeta("name", "robots", "index, follow, max-image-preview:large");
    setLink("canonical", currentUrl);

    // 3. OpenGraph (Facebook, WhatsApp, LinkedIn)
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:type", type === "restaurant" ? "restaurant.restaurant" : "website");
    setMeta("property", "og:site_name", "Oresto");
    setMeta("property", "og:locale", "fr_FR");

    // 4. Twitter Cards
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // 5. Schema.org JSON-LD Structured Data
    if (jsonLd) {
      let script = document.getElementById("oresto-seo-jsonld") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "oresto-seo-jsonld";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      // Nettoyage éventuel du JSON-LD spécifique
      const script = document.getElementById("oresto-seo-jsonld");
      if (script) script.remove();
    };
  }, [title, description, keywords, image, url, type, jsonLd]);

  return null;
}
