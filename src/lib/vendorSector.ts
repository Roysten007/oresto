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
  // 1. Le profil de l'établissement actif dicte TOUJOURS son secteur en priorité absolue !
  if (vendorProfile?.business_type) {
    const bt = String(vendorProfile.business_type).toLowerCase();
    if (bt === "ecommerce" || bt === "boutique" || bt === "shop") return "ecommerce";
    if (bt === "hotel" || bt === "residence" || bt === "hebergement") return "hotel";
    if (bt === "restaurant" || bt === "resto" || bt === "fastfood") return "restaurant";
  }

  // 2. Analyse précise de la catégorie ou du nom de l'établissement
  const cat = `${vendorProfile?.category || ""} ${vendorProfile?.name || ""} ${vendorProfile?.description || ""}`.toLowerCase();
  if (
    cat.includes("boutique") ||
    cat.includes("mode") ||
    cat.includes("tech") ||
    cat.includes("e-commerce") ||
    cat.includes("commerce") ||
    cat.includes("vêtement") ||
    cat.includes("sneakers") ||
    cat.includes("chaussure") ||
    cat.includes("cosmétique") ||
    cat.includes("bijoux") ||
    cat.includes("accessoire")
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

  if (
    cat.includes("resto") ||
    cat.includes("restaurant") ||
    cat.includes("maquis") ||
    cat.includes("grill") ||
    cat.includes("cuisine") ||
    cat.includes("burger") ||
    cat.includes("plat")
  ) {
    return "restaurant";
  }

  // 3. Dernier espace de travail actif validé par l'utilisateur
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("oresto_active_workspace");
      if (stored === "ecommerce" || stored === "hotel" || stored === "restaurant") {
        return stored as BusinessSector;
      }
    } catch {}
  }

  // 4. Paramètre URL explicite en secours
  if (searchParamSector) {
    const s = searchParamSector.toLowerCase();
    if (s.includes("ecom") || s.includes("boutique") || s.includes("shop")) return "ecommerce";
    if (s.includes("hotel") || s.includes("residence") || s.includes("chambre")) return "hotel";
    if (s.includes("resto") || s.includes("restaurant") || s.includes("maquis")) return "restaurant";
  }

  // Par défaut : Boutique
  return "ecommerce";
}

export function setVendorSector(sector: BusinessSector): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("oresto_active_workspace", sector);
    } catch {}
  }
}

export function getStarterProducts(type: BusinessSector, vId: string): any[] {
  if (type === "ecommerce") {
    return [
      {
        id: `prod_${vId}_ec1`,
        vendorId: vId,
        name: "Sneakers Streetwear Urban",
        price: 18500,
        originalPrice: 25000,
        category: "Chaussures & Baskets",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
        ],
        available: true,
        stock: 15,
        badge: "PROMO",
        variants: [{ name: "Pointure", options: ["40", "41", "42", "43", "44"] }, { name: "Couleur", options: ["Rouge/Noir", "Blanc/Gris"] }],
        features: ["Semelle amortissante haute qualité", "Livraison offerte dès 2 paires"],
        description: "Baskets ultra-confortables au design streetwear contemporain."
      },
      {
        id: `prod_${vId}_ec2`,
        vendorId: vId,
        name: "Smartwatch Ultra Pro 4G",
        price: 29000,
        originalPrice: 38000,
        category: "Téléphones & High-Tech",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
        ],
        available: true,
        stock: 8,
        badge: "BESTSELLER",
        variants: [{ name: "Bracelet", options: ["Silicone Noir", "Cuir Marron"] }],
        features: ["Autonomie 7 jours", "Cardiofréquencemètre & GPS", "Garantie 1 an"],
        description: "Montre connectée étanche avec écran AMOLED HD et suivi santé complet."
      },
      {
        id: `prod_${vId}_ec3`,
        vendorId: vId,
        name: "Chemise Lin Authentique",
        price: 12500,
        originalPrice: 16000,
        category: "Mode & Vêtements",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
        available: true,
        stock: 20,
        badge: "NOUVEAU",
        variants: [{ name: "Taille", options: ["M", "L", "XL", "XXL"] }, { name: "Couleur", options: ["Blanc", "Beige", "Bleu Ciel"] }],
        features: ["100% Lin naturel respirant", "Coupe moderne slim-fit"],
        description: "Chemise élégante idéale pour les fortes chaleurs et réceptions."
      }
    ];
  }
  if (type === "hotel") {
    return [
      {
        id: `prod_${vId}_h1`,
        vendorId: vId,
        name: "Suite Exécutive King & Balcon",
        price: 65000,
        originalPrice: 80000,
        category: "Suite Exécutive King",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
        ],
        available: true,
        stock: 2,
        badge: "SUITE VIP",
        features: ["Lit King Size Confort Palace", "Wi-Fi Fibre 100 Mbps", "Climatisation Split 24h", "Baignoire & Eau chaude", "Petit-déjeuner inclus"],
        description: "Suite spacieuse de 45m² avec grand balcon privé, literie d'exception et salon privé."
      },
      {
        id: `prod_${vId}_h2`,
        vendorId: vId,
        name: "Chambre Prestige Deluxe",
        price: 35000,
        originalPrice: 45000,
        category: "Chambre Deluxe",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
        ],
        available: true,
        stock: 4,
        badge: "PETIT-DÉJ INCLUS",
        features: ["Lit Queen Size", "Climatisation 24h", "Smart TV Canal+", "Salle de bain privée", "Wi-Fi Gratuit"],
        description: "Chambre lumineuse tout confort pour séjours d'affaires et escapades à deux."
      },
      {
        id: `prod_${vId}_h3`,
        vendorId: vId,
        name: "Appartement Meublé 2 Pièces",
        price: 45000,
        originalPrice: 55000,
        category: "Appartement Meublé",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
        available: true,
        stock: 2,
        badge: "RÉDUCTION LONG SÉJOUR",
        features: ["Cuisine équipée", "Salon & Table à manger", "Machine à laver", "Wi-Fi Fibre", "Gardiennage 24h"],
        description: "Appartement meublé autonome avec cuisine équipée pour courts et longs séjours."
      }
    ];
  }
  return [
    {
      id: `prod_${vId}_p1`,
      vendorId: vId,
      name: "Atassi Traditionnel & Piment Noir",
      price: 150,
      priceType: "flexible",
      minPrice: 150,
      priceStep: 50,
      suggestedAmounts: [150, 200, 250, 300, 500, 1000],
      category: "Spécialités Africaines",
      description: "Riz aux haricots et spaghetti cuisinés à l'africaine. Choisissez librement votre portion à partir de 150 FCFA.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "MONTANT AU CHOIX"
    },
    {
      id: `prod_${vId}_p2`,
      vendorId: vId,
      name: "Alloco Chaud & Piment Maison",
      price: 200,
      priceType: "flexible",
      minPrice: 200,
      priceStep: 50,
      suggestedAmounts: [200, 300, 500, 1000],
      category: "Accompagnements",
      description: "Bananes plantains mûres frites dorées et croustillantes. Portion au choix à partir de 200 FCFA.",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "PORTION AU CHOIX"
    },
    {
      id: `prod_${vId}_p3`,
      vendorId: vId,
      name: "Poulet Braisé & Alloco",
      price: 4500,
      category: "Plats Principaux & Grillades",
      description: "Cuisiné aux épices du terroir, alloco doré et piment vert maison",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "RECOMMANDÉ"
    },
    {
      id: `prod_${vId}_p4`,
      vendorId: vId,
      name: "Capitaine Braisé Royal",
      price: 6500,
      originalPrice: 7500,
      category: "Plats Principaux & Grillades",
      description: "Poisson frais du jour mariné aux herbes aromatiques, sauce pimentée maison",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "BESTSELLER"
    }
  ];
}

/**
 * Valide strictement qu'un produit correspond bien au secteur actif.
 * Empêche qu'une chambre d'hôtel n'apparaisse dans une boutique ou qu'un burger ne figure dans un hôtel.
 */
export function isProductMatchingSector(product: any, sector: BusinessSector): boolean {
  if (!product) return false;
  const cat = `${product.category || ""} ${product.name || ""} ${product.description || ""}`.toLowerCase();
  
  if (sector === "ecommerce") {
    // Rejeter formellement les chambres d'hôtel et plats de restaurant
    const isHotel = cat.includes("chambre") || cat.includes("suite") || cat.includes("nuitée") || cat.includes("balcon palace") || cat.includes("king size") || cat.includes("lit double") || cat.includes("hôtel");
    const isResto = cat.includes("poisson braisé") || cat.includes("poulet") || cat.includes("burger") || cat.includes("grillade") || cat.includes("brochette") || cat.includes("alloco") || cat.includes("sauce") || cat.includes("kankankan") || cat.includes("plat");
    return !isHotel && !isResto;
  }
  
  if (sector === "hotel") {
    // Rejeter formellement les sneakers/vêtements et les plats cuisinés
    const isEcom = cat.includes("sneaker") || cat.includes("chemise") || cat.includes("smartwatch") || cat.includes("streetwear") || cat.includes("chaussure") || cat.includes("pantalon") || cat.includes("t-shirt");
    const isResto = cat.includes("poisson braisé") || cat.includes("poulet") || cat.includes("burger") || cat.includes("grillade") || cat.includes("brochette") || cat.includes("alloco");
    return !isEcom && !isResto;
  }
  
  if (sector === "restaurant") {
    // Rejeter chambres d'hôtel et articles e-commerce
    const isHotel = cat.includes("chambre") || cat.includes("suite") || cat.includes("nuitée") || cat.includes("balcon palace") || cat.includes("king size") || cat.includes("hôtel");
    const isEcom = cat.includes("sneaker") || cat.includes("smartwatch") || cat.includes("chemise lin") || cat.includes("streetwear") || cat.includes("chaussure");
    return !isHotel && !isEcom;
  }
  
  return true;
}
