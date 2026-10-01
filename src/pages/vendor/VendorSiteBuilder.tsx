import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { ref, update, onValue, set, push, query, orderByChild, equalTo, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { VendorProfile, Product } from "@/data/mockData";
import { getVendorSector, getStarterProducts, isProductMatchingSector } from "@/lib/vendorSector";
import { slugify } from "@/lib/slugify";
import StepIdentite from "./builder/StepIdentite";
import StepCarte from "./builder/StepCarte";
import StepEcommerceCatalogue from "./builder/StepEcommerceCatalogue";
import StepEcommercePromos from "./builder/StepEcommercePromos";
import StepHotelChambres from "./builder/StepHotelChambres";
import StepHotelServices from "./builder/StepHotelServices";
import StepMenus from "./builder/StepMenus";
import StepVentes from "./builder/StepVentes";
import StepDesign from "./builder/StepDesign";
import StepLancement from "./builder/StepLancement";

export default function VendorSiteBuilder() {
  const { vendorProfile, user } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  // Business Type : 'restaurant' | 'ecommerce' | 'hotel'
  const initialType = getVendorSector(vendorProfile, sectorQuery);
  const [businessType, setBusinessType] = useState<"restaurant" | "ecommerce" | "hotel">(initialType);

  const vId = vendorProfile?.id || (user as any)?.vendorId || user?.id || "v_demo";
  
  // Nom & Visuels adaptés au secteur (ne jamais hériter d'un nom de restaurant pour une boutique)
  const isProfileRestaurantOnly = !vendorProfile?.business_type || vendorProfile?.business_type === "restaurant" || vendorProfile?.name === "L'Atelier du Chef & Grill";
  
  const defaultShopName = initialType === "ecommerce"
    ? (vendorProfile?.business_type === "ecommerce" && vendorProfile?.name ? vendorProfile.name : "KiffStyle & Tech Store")
    : initialType === "hotel"
    ? (vendorProfile?.business_type === "hotel" && vendorProfile?.name ? vendorProfile.name : "Palmier Royal Résidence & Suites")
    : (vendorProfile?.name || "L'Atelier du Chef & Grill");

  const defaultSlug = initialType === "ecommerce"
    ? (vendorProfile?.business_type === "ecommerce" && vendorProfile?.slug ? vendorProfile.slug : "kiffstyle-store")
    : initialType === "hotel"
    ? (vendorProfile?.business_type === "hotel" && vendorProfile?.slug ? vendorProfile.slug : "palmier-royal")
    : (vendorProfile?.slug || "latelier-du-chef");

  const defaultCover = initialType === "ecommerce"
    ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
    : initialType === "hotel"
    ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";

  const [formData, setFormData] = useState<Partial<VendorProfile>>({
    name: defaultShopName,
    category: initialType === "ecommerce" 
      ? "Mode, Vêtements & Prêt-à-porter" 
      : initialType === "hotel" 
      ? "Hôtel & Suites de Luxe" 
      : "Restaurant & Grillades",
    categories: initialType === "ecommerce" 
      ? ["Mode, Vêtements & Prêt-à-porter", "Chaussures & Sneakers Streetwear", "High-Tech, Smartphones & Gadgets"] 
      : initialType === "hotel" 
      ? ["Hôtel & Suites de Luxe", "Résidence Meublée & Appartements"] 
      : ["Restaurant & Grillades", "Maquis & Saveurs Africaines"],
    description: initialType === "ecommerce" 
      ? "Boutique en ligne spécialisée en sneakers streetwear, vêtements de marque et accessoires high-tech."
      : initialType === "hotel"
      ? "Hôtel de charme et résidence meublée de haut standing avec suites climatisées, piscine et Wi-Fi Fibre."
      : "Restaurant gastronomique et grillades au feu de bois. Spécialités africaines et saveurs du terroir.",
    slug: defaultSlug,
    business_type: initialType,
    logo_url: isProfileRestaurantOnly && initialType !== "restaurant" ? "" : (vendorProfile?.logo_url || ""),
    cover_url: isProfileRestaurantOnly && initialType !== "restaurant" ? defaultCover : (vendorProfile?.cover_url || defaultCover),
    primary_color: initialType === "ecommerce" ? "#9333EA" : initialType === "hotel" ? "#4F46E5" : "#EA580C",
    secondary_color: "#FFFFFF",
    font_choice: vendorProfile?.font_choice || "modern",
    sections_config: { hero: true, menu: true, daily: true, footer: true },
    daily_menus: {},
    phone: vendorProfile?.phone || "+229 97 00 00 00",
    whatsapp: vendorProfile?.whatsapp || vendorProfile?.phone || "+229 97 00 00 00",
    city: vendorProfile?.city || "Cotonou",
    neighborhood: vendorProfile?.neighborhood || (initialType === "ecommerce" ? "Ganhi" : initialType === "hotel" ? "Haie Vive" : "Cadjehoun"),
    social_links: vendorProfile?.social_links || { instagram: "", facebook: "", tiktok: "" },
    payment_methods: vendorProfile?.payment_methods || ["MTN MoMo", "Moov Money", "Espèces"],
    ordering_modes: initialType === "ecommerce" 
      ? ["Livraison Express", "Retrait Point Relais"] 
      : initialType === "hotel" 
      ? ["Réservation Directe", "Paiement à l'arrivée"] 
      : ["Livraison", "À Emporter", "WhatsApp Direct"],
    is_published: true,
  });

  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  const steps = [
    { 
      id: 1, 
      title: "Identité", 
      icon: isEcommerce ? "fa-solid fa-bag-shopping" : isHotel ? "fa-solid fa-hotel" : "fa-solid fa-store", 
      desc: isEcommerce ? "Nom de votre boutique, lien web et logo." : isHotel ? "Nom de votre établissement, lien et coordonnées." : "Nom, lien web et logo de votre restaurant." 
    },
    { 
      id: 2, 
      title: isEcommerce ? "Catalogue & Fiches" : isHotel ? "Chambres & Suites" : "La Carte", 
      icon: isEcommerce ? "fa-solid fa-boxes-stacked" : isHotel ? "fa-solid fa-bed" : "fa-solid fa-utensils", 
      desc: isEcommerce ? "Vos produits avec multi-photos, prix barrés et variantes." : isHotel ? "Vos chambres et suites avec tarifs par nuitée et équipements." : "Vos plats et grillades avec photos et tarifs." 
    },
    { 
      id: 3, 
      title: isEcommerce ? "Promotions" : isHotel ? "Services & Séjours" : "Menus du Jour", 
      icon: isEcommerce ? "fa-solid fa-bullhorn" : isHotel ? "fa-solid fa-bell-concierge" : "fa-solid fa-calendar-days", 
      desc: isEcommerce ? "Bandeau d'annonces, livraison offerte et codes promo." : isHotel ? "Équipements inclus, check-in/out et forfaits long séjour." : "Programmez vos suggestions quotidiennes." 
    },
    { 
      id: 4, 
      title: isEcommerce ? "Livraisons & MoMo" : isHotel ? "Réservations & MoMo" : "Ventes & MoMo", 
      icon: "fa-solid fa-money-bill-wave", 
      desc: "Modes de paiement Mobile Money et encaissements sans commission." 
    },
    { 
      id: 5, 
      title: "Design", 
      icon: "fa-solid fa-palette", 
      desc: "Couleurs et typographie de votre vitrine." 
    },
    { 
      id: 6, 
      title: "Lancement", 
      icon: "fa-solid fa-rocket", 
      desc: "Checklist et publication de votre vitrine." 
    },
  ];

  useEffect(() => {
    // Déterminer le business type de façon unifiée
    const detectedType = getVendorSector(vendorProfile, sectorQuery);
    setBusinessType(detectedType);

    const activeId = vendorProfile?.id || (user as any)?.vendorId || user?.id || "v_demo";

    // Charger les données sauvegardées en priorité depuis localStorage par secteur ou vendorProfile
    let mergedProfile = vendorProfile || {};
    try {
      const scopedSaved = localStorage.getItem(`oresto_vendor_profile_${activeId}_${detectedType}`);
      const globalSaved = localStorage.getItem("oresto_vendor_profile");
      const localSaved = scopedSaved || globalSaved;
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        // Ne charger le cache global que s'il correspond au secteur actif
        if (!parsed.business_type || parsed.business_type === detectedType) {
          mergedProfile = { ...mergedProfile, ...parsed };
        }
      }
    } catch {}

    // Adapter l'identité au secteur si le profil est resté sur la démo restaurant
    const isProfileRestoMismatch = (!mergedProfile.business_type || mergedProfile.business_type === "restaurant" || mergedProfile.name === "L'Atelier du Chef & Grill") && detectedType !== "restaurant";

    const shopName = isProfileRestoMismatch
      ? (detectedType === "ecommerce" ? "KiffStyle & Tech Store" : "Palmier Royal Résidence & Suites")
      : (mergedProfile.name || defaultShopName);

    const computedSlug = isProfileRestoMismatch
      ? (detectedType === "ecommerce" ? "kiffstyle-store" : "palmier-royal")
      : (mergedProfile.slug || slugify(shopName) || defaultSlug);

    const sectorCover = isProfileRestoMismatch
      ? defaultCover
      : (mergedProfile.cover_url || defaultCover);

    const sectorCategory = isProfileRestoMismatch
      ? (detectedType === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : "Hôtel & Suites de Luxe")
      : (mergedProfile.category || (detectedType === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : detectedType === "hotel" ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades"));

    const sectorCategories = isProfileRestoMismatch
      ? (detectedType === "ecommerce" 
          ? ["Mode, Vêtements & Prêt-à-porter", "Chaussures & Sneakers Streetwear", "High-Tech, Smartphones & Gadgets"] 
          : ["Hôtel & Suites de Luxe", "Résidence Meublée & Appartements"])
      : (mergedProfile.categories || [sectorCategory]);

    setFormData(prev => ({
      ...prev,
      ...mergedProfile,
      name: shopName,
      slug: computedSlug,
      cover_url: sectorCover,
      category: sectorCategory,
      categories: sectorCategories,
      business_type: detectedType,
      primary_color: detectedType === "ecommerce" ? "#9333EA" : detectedType === "hotel" ? "#4F46E5" : "#EA580C",
      social_links: mergedProfile.social_links || { instagram: "", facebook: "", tiktok: "" },
      ordering_modes: mergedProfile.ordering_modes || (detectedType === "ecommerce" ? ["Livraison Express", "Retrait Point Relais"] : detectedType === "hotel" ? ["Réservation Directe", "Paiement à l'arrivée"] : ["Livraison", "À Emporter", "WhatsApp Direct"]),
      payment_methods: mergedProfile.payment_methods || ["MTN MoMo", "Moov Money", "Espèces"]
    }));
    setLocalLogo(isProfileRestoMismatch ? null : (mergedProfile.logo_url || null));
    setLocalCover(sectorCover || null);

    // Charger les produits spécifiquement pour ce vendeur et CE SECTEUR
    let localProducts: Product[] = [];
    try {
      const savedProds = localStorage.getItem(`oresto_products_${activeId}_${detectedType}`);
      if (savedProds) {
        localProducts = JSON.parse(savedProds);
      }
    } catch {}

    // Filtrer pour éliminer rigoureusement tout produit d'un autre secteur (ex: chambres d'hôtel dans une boutique)
    const validLocal = localProducts.filter(p => isProductMatchingSector(p, detectedType));

    if (validLocal.length > 0) {
      setProducts(validLocal);
    } else {
      const defaultSamples = getStarterProducts(detectedType, activeId);
      setProducts(defaultSamples);
      try {
        localStorage.setItem(`oresto_products_${activeId}_${detectedType}`, JSON.stringify(defaultSamples));
      } catch {}
    }

    if (!db) return;

    const unsubscribe = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data)
          .map(k => ({ id: k, ...data[k] }))
          .filter((p: any) => p.vendorId === activeId && isProductMatchingSector(p, detectedType)) as Product[];
        
        if (list.length > 0) {
          setProducts(list);
          try {
            localStorage.setItem(`oresto_products_${activeId}_${detectedType}`, JSON.stringify(list));
          } catch {}
        }
      }
    });
    return () => unsubscribe();
  }, [vendorProfile, sectorQuery]);

  const getSampleProducts = (type: string, vId: string): Product[] => {
    return getStarterProducts((type as any) || "restaurant", vId);
  };

  const handleBusinessTypeChange = (newType: "restaurant" | "ecommerce" | "hotel") => {
    setBusinessType(newType);
    const updatedName = newType === "ecommerce" ? "KiffStyle & Tech Store" : newType === "hotel" ? "Palmier Royal Résidence" : "L'Atelier du Chef & Grill";
    const updatedCat = newType === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : newType === "hotel" ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades";
    
    setFormData(prev => ({
      ...prev,
      business_type: newType,
      name: updatedName,
      category: updatedCat,
    }));
    toast.success(`Mode ${newType === "ecommerce" ? "Boutique E-Commerce" : newType === "hotel" ? "Hôtel & Résidences" : "Restaurant & Grillades"} activé !`);
  };

  const handleSlugChange = async (val: string) => {
    const slug = slugify(val);
    setFormData(prev => ({ ...prev, slug }));
    if (!db || slug.length < 3) return;
    setCheckingSlug(true);
    try {
      const snap = await get(ref(db, `slugs/${slug}`));
      if (snap.exists()) {
        const ownerId = snap.val()?.vendorId || snap.val();
        if (ownerId && ownerId !== vId) {
          toast.warning("Ce lien est déjà réservé par un autre établissement.");
        }
      }
    } catch {} finally { 
      setCheckingSlug(false); 
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = type === 'logo' ? 'logo_url' : 'cover_url';

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'logo') setLocalLogo(base64);
      else setLocalCover(base64);
      setFormData(prev => ({ ...prev, [key]: base64 }));
    };
    reader.readAsDataURL(file);

    if (!storage || !vendorProfile || !db) return;
    try {
      const sRef = storageRef(storage, `vendors/${vendorProfile.id}/${type}_${Date.now()}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      setFormData(prev => ({ ...prev, [key]: url }));
      await update(ref(db, `vendors/${vendorProfile.id}`), { [key]: url });
      toast.success("Image mise à jour");
    } catch {
      if (db && vendorProfile) {
        try {
          const base64 = type === 'logo' ? localLogo : localCover;
          if (base64) await update(ref(db, `vendors/${vendorProfile.id}`), { [key]: base64 });
        } catch {}
      }
    }
  };

  const saveProduct = async (product: Partial<Product>) => {
    const activeVId = vendorProfile?.id || (user as any)?.vendorId || user?.id || "v_demo";
    const productId = product.id || `prod_${activeVId}_${Date.now()}`;
    
    const data: any = { 
      id: productId,
      name: product.name || (isHotel ? "Chambre Deluxe" : isEcommerce ? "Article" : "Plat"), 
      vendorId: activeVId, 
      available: true, 
      price: Number(product.price || 0),
      category: product.category || (isEcommerce ? "Mode, Vêtements & Prêt-à-porter" : isHotel ? "Chambre Deluxe" : "Plats Principaux & Grillades"),
      description: product.description || "",
      image: product.image || (product.images?.[0] || ""),
      stock: product.stock !== undefined ? Number(product.stock) : (isHotel ? 3 : 10),
      inStock: product.stock !== undefined ? Number(product.stock) > 0 : true
    };

    if (product.originalPrice) data.originalPrice = Number(product.originalPrice);
    if (product.badge) data.badge = product.badge;
    if (product.images && product.images.length > 0) data.images = product.images;
    if (product.variants && product.variants.length > 0) data.variants = product.variants;
    if (product.features && product.features.length > 0) data.features = product.features;

    // Mise à jour immédiate de l'état React local
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...data };
        return copy;
      }
      return [data, ...prev];
    });

    // Sauvegarde immédiate dans localStorage pour persistance garantie
    try {
      const savedProducts = JSON.parse(localStorage.getItem(`oresto_products_${activeVId}`) || "[]");
      const pIdx = savedProducts.findIndex((p: any) => p.id === productId);
      if (pIdx >= 0) {
        savedProducts[pIdx] = data;
      } else {
        savedProducts.unshift(data);
      }
      localStorage.setItem(`oresto_products_${activeVId}`, JSON.stringify(savedProducts));
    } catch {}

    // Sauvegarde en ligne Firebase
    if (db) {
      try {
        if (product.id) {
          await update(ref(db, `products/${product.id}`), data);
        } else {
          const newRef = ref(db, `products/${productId}`);
          await set(newRef, data);
        }
      } catch (err: any) {
        console.warn("Firebase product save warning:", err);
      }
    }

    toast.success(product.id ? (isHotel ? "Chambre mise à jour" : isEcommerce ? "Fiche article mise à jour" : "Plat mis à jour") : (isHotel ? "Chambre ajoutée avec succès" : isEcommerce ? "Article ajouté à votre vitrine" : "Plat ajouté à la carte"));
  };

  const deleteProduct = async (id: string) => {
    const activeVId = vendorProfile?.id || (user as any)?.vendorId || user?.id || "v_demo";
    // Suppression locale immédiate
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const savedProducts = JSON.parse(localStorage.getItem(`oresto_products_${activeVId}`) || "[]");
      const filtered = savedProducts.filter((p: any) => p.id !== id);
      localStorage.setItem(`oresto_products_${activeVId}`, JSON.stringify(filtered));
    } catch {}

    if (db) {
      try {
        await set(ref(db, `products/${id}`), null);
      } catch (err) {
        console.warn("Firebase delete warning:", err);
      }
    }
    toast.success(isHotel ? "Chambre supprimée" : isEcommerce ? "Article supprimé" : "Plat supprimé");
  };

  const saveChanges = async (publish = false) => {
    const activeVId = vendorProfile?.id || (user as any)?.vendorId || user?.id || "v_demo";
    setIsSaving(true);
    try {
      const shopTitle = (formData.name || defaultShopName).trim();
      const cleanSlug = slugify(formData.slug || shopTitle) || `vitrine-${Date.now().toString().slice(-4)}`;

      const updates: any = {
        id: activeVId,
        userId: user?.id || (user as any)?.uid || vendorProfile?.userId,
        name: shopTitle,
        description: formData.description || "",
        slug: cleanSlug,
        category: formData.category || (isEcommerce ? "Mode, Vêtements & Prêt-à-porter" : isHotel ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades"),
        categories: formData.categories && formData.categories.length > 0 
          ? formData.categories 
          : (formData.category ? formData.category.split(",").map(s => s.trim()).filter(Boolean) : []),
        business_type: businessType,
        logo_url: formData.logo_url || localLogo || "",
        cover_url: formData.cover_url || localCover || "",
        primary_color: formData.primary_color || (isEcommerce ? "#000000" : isHotel ? "#4F46E5" : "#EA580C"),
        secondary_color: formData.secondary_color || "#FFFFFF",
        font_choice: formData.font_choice || "modern",
        phone: formData.phone || "+229 97 00 00 00",
        whatsapp: formData.whatsapp || formData.phone || "+229 97 00 00 00",
        city: formData.city || "Cotonou",
        neighborhood: formData.neighborhood || "Haie Vive",
        payment_methods: formData.payment_methods || ["MTN MoMo", "Moov Money", "Espèces"],
        ordering_modes: formData.ordering_modes || (isEcommerce ? ["Livraison Express", "Retrait Point Relais"] : isHotel ? ["Réservation Directe", "Paiement à l'arrivée"] : ["Livraison", "À Emporter", "WhatsApp Direct"]),
        open: true,
        is_published: true,
        status: "active"
      };

      // 1. Sauvegarde locale immédiate (garantie zéro perte de données)
      const fullProfile = { ...(vendorProfile || {}), ...updates };
      setFormData(prev => ({ ...prev, ...updates }));
      try {
        localStorage.setItem("oresto_vendor_profile", JSON.stringify(fullProfile));
        localStorage.setItem(`oresto_products_${activeVId}`, JSON.stringify(products));
      } catch {}

      // 2. Synchronisation Firebase Realtime Database
      if (db) {
        try {
          await update(ref(db, `vendors/${activeVId}`), updates);
          await set(ref(db, `slugs/${cleanSlug}`), { vendorId: activeVId });

          // SAUVEGARDE EN LOT DE TOUS LES PRODUITS DU CATALOGUE
          for (const prod of products) {
            const prodId = prod.id || `prod_${activeVId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            const prodData = {
              ...prod,
              id: prodId,
              vendorId: activeVId,
              available: prod.available !== false,
              inStock: prod.stock !== undefined ? Number(prod.stock) > 0 : true
            };
            await set(ref(db, `products/${prodId}`), prodData);
          }
        } catch (dbErr: any) {
          console.warn("Firebase sync warning (données sécurisées en local):", dbErr);
        }
      }

      if (publish) {
        toast.success("🎉 Votre vitrine en ligne est publiée avec succès !", {
          action: {
            label: "Voir le site",
            onClick: () => window.open(`/r/${cleanSlug}`, "_blank")
          }
        });
      } else {
        toast.success("Modifications enregistrées avec succès");
      }
    } catch (err: any) { 
      console.error("Erreur saveChanges:", err);
      toast.error("Erreur lors de l'enregistrement");
    } finally { 
      setIsSaving(false); 
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: 
        return (
          <StepIdentite 
            formData={formData} 
            setFormData={setFormData} 
            localLogo={localLogo} 
            localCover={localCover} 
            checkingSlug={checkingSlug} 
            handleSlugChange={handleSlugChange} 
            handleFileUpload={handleFileUpload}
            businessType={businessType}
            onBusinessTypeChange={handleBusinessTypeChange}
          />
        );
      case 2: 
        return isEcommerce 
          ? <StepEcommerceCatalogue products={products} vendorId={vendorProfile?.id || "v_demo"} onSave={saveProduct} onDelete={deleteProduct} />
          : isHotel
          ? <StepHotelChambres products={products} vendorId={vendorProfile?.id || "v_demo"} onSave={saveProduct} onDelete={deleteProduct} />
          : <StepCarte products={products} vendorId={vendorProfile?.id || "v_demo"} onSave={saveProduct} onDelete={deleteProduct} />;
      case 3: 
        return isEcommerce 
          ? <StepEcommercePromos formData={formData} setFormData={setFormData} />
          : isHotel
          ? <StepHotelServices formData={formData} setFormData={setFormData} />
          : <StepMenus formData={formData} setFormData={setFormData} products={products} vendorId={vendorProfile?.id || "v_demo"} />;
      case 4: 
        return <StepVentes formData={formData} setFormData={setFormData} />;
      case 5: 
        return <StepDesign formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} />;
      case 6: 
        return <StepLancement formData={formData} products={products} isSaving={isSaving} onPublish={() => saveChanges(true)} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 font-body pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-primary/25">
            <i className={`fa-solid ${isEcommerce ? "fa-bag-shopping" : isHotel ? "fa-hotel" : "fa-wand-magic-sparkles"}`}></i>
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-foreground">
              {isEcommerce ? "Boutique" : isHotel ? "Hôtel" : "Site"} <span className="text-primary">Factory</span>
            </h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              {isEcommerce ? "Générateur de Boutique E-Commerce (Fiches multi-photos & Stocks)" : isHotel ? "Gestionnaire de Chambres & Nuitées" : "Création et personnalisation de votre vitrine restaurant"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <a 
            href={`/r/${formData.slug || (isEcommerce ? "ma-boutique-chic" : "le-maquis-etoile")}`} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs text-primary"></i>
            <span>Voir en direct</span>
          </a>

          <button 
            type="button"
            onClick={() => saveChanges(false)} 
            disabled={isSaving} 
            className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <span>{isSaving ? "Enregistrement..." : "Sauvegarder"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="bg-card rounded-2xl border border-border p-2 overflow-x-auto scrollbar-hide shadow-sm">
        <div className="flex items-center gap-1.5 min-w-max">
          {steps.map((step) => {
            const active = currentStep === step.id;
            const done = currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all font-heading text-xs font-black uppercase tracking-wider ${
                  active 
                    ? "bg-black text-white shadow-md" 
                    : done 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  active 
                    ? "bg-primary text-white" 
                    : done 
                      ? "bg-emerald-500 text-white" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {done ? <i className="fa-solid fa-check text-[8px]"></i> : step.id}
                </div>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Form */}
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="bg-card rounded-[36px] border border-border p-6 sm:p-10 shadow-sm flex flex-col justify-between min-h-[560px]">
          
          {/* Step Body */}
          <div className="flex-1">
            {renderStep()}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="flex items-center justify-between pt-8 mt-10 border-t border-border gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-0"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Précédent</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              {steps.map(s => (
                <button 
                  key={s.id} 
                  type="button"
                  onClick={() => setCurrentStep(s.id)} 
                  className={`h-2 rounded-full transition-all ${
                    currentStep === s.id ? "bg-primary w-8" : currentStep > s.id ? "bg-emerald-500 w-3" : "bg-muted w-3"
                  }`} 
                />
              ))}
            </div>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(p => Math.min(6, p + 1))}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-black text-white text-xs font-heading font-black uppercase tracking-wider hover:bg-primary transition-all shadow-lg active:scale-95"
              >
                <span>Continuer</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => saveChanges(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white text-xs font-heading font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 disabled:opacity-50 active:scale-95"
              >
                <i className="fa-solid fa-rocket"></i>
                <span>Publier mon site</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
