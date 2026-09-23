export type BusinessSector = "restaurant" | "ecommerce" | "hotel";

export interface SectorMeta {
  id: BusinessSector;
  label: string;
  badge: string;
  icon: string;
  primaryColor: string;
  tagline: string;
  orderTitle: string;
  orderActionLabel: string;
}

export const SECTORS: Record<BusinessSector, SectorMeta> = {
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    badge: "Cuisine & Salle",
    icon: "fa-solid fa-utensils",
    primaryColor: "#FF6B00",
    tagline: "Carte, cuisine en direct, tables et livraison",
    orderTitle: "Commandes & Cuisine",
    orderActionLabel: "Prêt ➔ Livrer"
  },
  ecommerce: {
    id: "ecommerce",
    label: "Boutique & E-Commerce",
    badge: "Boutique en ligne",
    icon: "fa-solid fa-bag-shopping",
    primaryColor: "#9333EA",
    tagline: "Articles, stocks, expéditions et colis",
    orderTitle: "Commandes & Expéditions",
    orderActionLabel: "Emballé ➔ Expédier"
  },
  hotel: {
    id: "hotel",
    label: "Hôtel & Résidence",
    badge: "Réception & Séjours",
    icon: "fa-solid fa-hotel",
    primaryColor: "#4F46E5",
    tagline: "Chambres, réservations, arrivées et nuitées",
    orderTitle: "Réservations & Séjours",
    orderActionLabel: "Check-in (Installé)"
  }
};

export function getVendorSector(
  vendorProfile?: any,
  searchParamSector?: string | null
): BusinessSector {
  // 1. URL Query param if explicitly requested
  if (searchParamSector) {
    const s = searchParamSector.toLowerCase();
    if (s.includes("ecom") || s.includes("boutique") || s.includes("shop")) return "ecommerce";
    if (s.includes("hotel") || s.includes("residence") || s.includes("chambre")) return "hotel";
    if (s.includes("resto") || s.includes("restaurant") || s.includes("maquis")) return "restaurant";
  }

  // 2. Vendor profile stored business_type
  if (vendorProfile?.business_type) {
    const bt = String(vendorProfile.business_type).toLowerCase();
    if (bt === "ecommerce" || bt === "boutique") return "ecommerce";
    if (bt === "hotel" || bt === "residence") return "hotel";
    if (bt === "restaurant") return "restaurant";
  }

  // 3. Browser active workspace persistence
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("oresto_active_workspace");
      if (stored === "ecommerce" || stored === "hotel" || stored === "restaurant") {
        return stored as BusinessSector;
      }
    } catch {}
  }

  // 4. Analysis of profile category or name
  const cat = `${vendorProfile?.category || ""} ${vendorProfile?.name || ""}`.toLowerCase();
  if (
    cat.includes("boutique") ||
    cat.includes("mode") ||
    cat.includes("tech") ||
    cat.includes("e-commerce") ||
    cat.includes("commerce") ||
    cat.includes("vêtement") ||
    cat.includes("sneakers") ||
    cat.includes("chaussure") ||
    cat.includes("cosmétique")
  ) {
    return "ecommerce";
  }

  if (
    cat.includes("hôtel") ||
    cat.includes("hotel") ||
    cat.includes("résidence") ||
    cat.includes("residence") ||
    cat.includes("auberge") ||
    cat.includes("chambre") ||
    cat.includes("suite") ||
    cat.includes("hébergement")
  ) {
    return "hotel";
  }

  return "restaurant";
}

export function setVendorSector(sector: BusinessSector): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("oresto_active_workspace", sector);
    } catch {}
  }
}
