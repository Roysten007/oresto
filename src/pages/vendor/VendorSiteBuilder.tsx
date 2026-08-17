import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { ref, update, onValue, set, push, query, orderByChild, equalTo, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { VendorProfile, Product } from "@/data/mockData";
import StepIdentite from "./builder/StepIdentite";
import StepCarte from "./builder/StepCarte";
import StepMenus from "./builder/StepMenus";
import StepVentes from "./builder/StepVentes";
import StepDesign from "./builder/StepDesign";
import StepLancement from "./builder/StepLancement";

const isHotelCategory = (cat?: string) => {
  if (!cat) return false;
  const c = cat.toLowerCase();
  return c.includes("hôtel") || c.includes("hotel") || c.includes("auberge");
};

export default function VendorSiteBuilder() {
  const { vendorProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const [formData, setFormData] = useState<Partial<VendorProfile>>({
    name: "Le Maquis Étoilé",
    description: "Restaurant, Grillades authentiques et saveurs locales",
    slug: "le-maquis-etoile",
    logo_url: "",
    cover_url: "",
    primary_color: "#EA580C",
    secondary_color: "#FFFFFF",
    font_choice: "modern",
    sections_config: { hero: true, menu: true, daily: true, footer: true },
    daily_menus: {},
    phone: "+229 97 00 00 00",
    whatsapp: "+229 97 00 00 00",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    social_links: { instagram: "", facebook: "", tiktok: "" },
    payment_methods: ["MTN MoMo", "Moov Money", "Espèces"],
    ordering_modes: ["Livraison", "À Emporter", "WhatsApp Direct"],
    is_published: true,
  });

  const isHotel = isHotelCategory(formData.category || vendorProfile?.category);

  const steps = [
    { id: 1, title: "Identité", icon: "fa-solid fa-store", desc: "Définissez le nom, le lien web et le logo de votre établissement." },
    { id: 2, title: isHotel ? "Chambres" : "La Carte", icon: isHotel ? "fa-solid fa-hotel" : "fa-solid fa-utensils", desc: "Ajoutez vos plats ou chambres avec photos et tarifs." },
    { id: 3, title: "Menus", icon: "fa-solid fa-calendar-days", desc: "Programmez vos suggestions du jour et formules." },
    { id: 4, title: "Ventes & MoMo", icon: "fa-solid fa-money-bill-wave", desc: "Configurez la réception de vos paiements Mobile Money." },
    { id: 5, title: "Design", icon: "fa-solid fa-palette", desc: "Personnalisez les couleurs et la police de votre vitrine." },
    { id: 6, title: "Lancement", icon: "fa-solid fa-rocket", desc: "Vérifiez votre checklist et publiez votre site en 1 clic." },
  ];

  useEffect(() => {
    if (!vendorProfile || !db) return;
    setFormData(prev => ({
      ...prev,
      ...vendorProfile,
      social_links: vendorProfile.social_links || { instagram: "", facebook: "", tiktok: "" },
      ordering_modes: vendorProfile.ordering_modes || ["Livraison", "À Emporter", "WhatsApp Direct"],
      payment_methods: vendorProfile.payment_methods || ["MTN MoMo", "Moov Money", "Espèces"]
    }));
    setLocalLogo(vendorProfile.logo_url || null);
    setLocalCover(vendorProfile.cover_url || null);

    const unsubscribe = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] })).filter((p: any) => p.vendorId === vendorProfile.id) as Product[];
        setProducts(list.length > 0 ? list : [
          { id: "p1", vendorId: vendorProfile.id, name: "Poulet Braisé & Alloco", price: 4500, category: "Plats", description: "Cuisiné aux épices du terroir, alloco doré", available: true },
          { id: "p2", vendorId: vendorProfile.id, name: "Capitaine Braisé", price: 6000, category: "Plats", description: "Poisson frais du jour, sauce pimentée maison", available: true },
          { id: "p3", vendorId: vendorProfile.id, name: "Brochettes de Mérou", price: 3500, category: "Plats", description: "Grillées au feu de bois", available: true },
        ]);
      } else {
        setProducts([
          { id: "p1", vendorId: vendorProfile.id, name: "Poulet Braisé & Alloco", price: 4500, category: "Plats", description: "Cuisiné aux épices du terroir, alloco doré", available: true },
          { id: "p2", vendorId: vendorProfile.id, name: "Capitaine Braisé", price: 6000, category: "Plats", description: "Poisson frais du jour, sauce pimentée maison", available: true },
        ]);
      }
    });
    return () => unsubscribe();
  }, [vendorProfile]);

  const handleSlugChange = async (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug }));
    if (!db || slug.length < 3) return;
    setCheckingSlug(true);
    try {
      const snap = await get(query(ref(db, 'vendors'), orderByChild('slug'), equalTo(slug)));
      if (snap.exists()) {
        const ownerId = Object.keys(snap.val())[0];
        if (ownerId !== vendorProfile?.id) toast.warning("Ce lien est déjà pris.");
      }
    } finally { setCheckingSlug(false); }
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
    if (!vendorProfile || !db) return;
    const data = { ...product, vendorId: vendorProfile.id, available: true, price: Number(product.price) };
    if (product.id) {
      await update(ref(db, `products/${product.id}`), data);
      toast.success("Plat mis à jour");
    } else {
      const newRef = push(ref(db, 'products'));
      await set(newRef, { ...data, id: newRef.key });
      toast.success("Plat ajouté au menu");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!db) return;
    await set(ref(db, `products/${id}`), null);
    toast.success("Plat supprimé");
  };

  const saveChanges = async (publish = false) => {
    if (!vendorProfile || !db) return;
    setIsSaving(true);
    try {
      const updates: any = {
        name: formData.name || "Le Maquis Étoilé",
        description: formData.description || "",
        slug: formData.slug || "le-maquis-etoile",
        logo_url: formData.logo_url || localLogo || "",
        cover_url: formData.cover_url || localCover || "",
        primary_color: formData.primary_color || "#EA580C",
        secondary_color: formData.secondary_color || "#FFFFFF",
        font_choice: formData.font_choice || "modern",
        phone: formData.phone || "",
        whatsapp: formData.whatsapp || "",
        city: formData.city || "",
        neighborhood: formData.neighborhood || "",
        payment_methods: formData.payment_methods || [],
        ordering_modes: formData.ordering_modes || [],
      };
      if (publish) updates.is_published = true;
      await update(ref(db, `vendors/${vendorProfile.id}`), updates);
      
      if (formData.slug) {
        await update(ref(db, `slugs/${formData.slug.toLowerCase()}`), { 
          vendorId: vendorProfile.id 
        });
      }

      if (publish) {
        setFormData(prev => ({ ...prev, is_published: true }));
        toast.success("🎉 Votre site est en ligne avec succès !");
      } else {
        toast.success("Modifications enregistrées");
      }
    } catch { 
      toast.error("Erreur d'enregistrement"); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepIdentite formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} checkingSlug={checkingSlug} handleSlugChange={handleSlugChange} handleFileUpload={handleFileUpload} />;
      case 2: return <StepCarte products={products} vendorId={vendorProfile?.id || "v_demo"} onSave={saveProduct} onDelete={deleteProduct} category={formData.category || vendorProfile?.category} />;
      case 3: return <StepMenus formData={formData} setFormData={setFormData} products={products} vendorId={vendorProfile?.id || "v_demo"} />;
      case 4: return <StepVentes formData={formData} setFormData={setFormData} />;
      case 5: return <StepDesign formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} />;
      case 6: return <StepLancement formData={formData} products={products} isSaving={isSaving} onPublish={() => saveChanges(true)} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 font-body pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-primary/25">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-foreground">
              Site <span className="text-primary">Factory</span>
            </h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Création et personnalisation de votre vitrine web
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              showLivePreview ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <i className="fa-solid fa-mobile-screen-button"></i>
            <span>{showLivePreview ? "Masquer smartphone" : "Afficher smartphone"}</span>
          </button>

          <a 
            href={`/r/${formData.slug || "le-maquis-etoile"}`} 
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

      {/* Main Content Grid : Form (Left) + Interactive Smartphone (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Step Card */}
        <div className={`${showLivePreview ? "xl:col-span-7" : "xl:col-span-12"} space-y-6`}>
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

        {/* Right Column: Sleek iPhone 16 Pro Live Interactive Mockup */}
        {showLivePreview && (
          <div className="hidden xl:block xl:col-span-5 sticky top-24">
            <div className="p-4 rounded-[44px] bg-[#0A0A0A] border-4 border-gray-800 shadow-2xl shadow-black/30 space-y-3">
              
              {/* Phone Frame Status Header */}
              <div className="flex items-center justify-between text-white/70 text-[11px] font-bold px-3">
                <span className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-wider">
                  <i className="fa-solid fa-mobile-screen"></i> Aperçu Smartphone Live
                </span>
                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-400 font-mono">
                  ● Temps réel
                </span>
              </div>

              {/* Smartphone Viewport Screen */}
              <div 
                className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-inner flex flex-col text-xs text-gray-900"
                style={{ height: "600px", fontFamily: formData.font_choice === "elegant" ? "'Cormorant Garamond', serif" : formData.font_choice === "bold" ? "'Montserrat', sans-serif" : "'Inter', sans-serif" }}
              >
                
                {/* Scrollable Phone Body */}
                <div className="flex-1 overflow-y-auto">
                  
                  {/* Banner & Header Card */}
                  <div 
                    className="h-32 bg-gray-900 bg-cover bg-center relative p-3 flex flex-col justify-between"
                    style={{ 
                      backgroundImage: localCover || formData.cover_url ? `url(${localCover || formData.cover_url})` : undefined,
                      backgroundColor: formData.primary_color || "#EA580C"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    
                    <div className="relative z-10 flex justify-between items-center text-white text-[10px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md font-mono text-[9px]">
                        oresto.app/r/{formData.slug || "votre-lien"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px]">
                        Ouvert
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-lg overflow-hidden shrink-0">
                        {localLogo || formData.logo_url ? (
                          <img src={localLogo || formData.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <div className="w-full h-full bg-primary text-white flex items-center justify-center font-heading font-black text-sm">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : "O"}
                          </div>
                        )}
                      </div>
                      <div className="text-white min-w-0">
                        <h4 className="font-heading font-black text-sm leading-tight drop-shadow-sm truncate">
                          {formData.name || "Le Maquis Étoilé"}
                        </h4>
                        <p className="text-[10px] text-gray-200 truncate">{formData.neighborhood || "Haie Vive"}, {formData.city || "Cotonou"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2 text-gray-600 font-bold">
                      <span><i className="fa-solid fa-clock text-primary"></i> 11h - 23h</span>
                      <span>•</span>
                      <span><i className="fa-solid fa-shield-halved text-emerald-600"></i> MoMo direct</span>
                    </div>
                    <span className="font-black text-primary">0% Commission</span>
                  </div>

                  {/* Products / Rooms List */}
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center justify-between font-heading font-black text-xs text-gray-900 border-b border-gray-100 pb-1.5">
                      <span>{isHotel ? "Chambres disponibles" : "La Carte du Chef"}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{products.length} {isHotel ? "chambres" : "plats"}</span>
                    </div>

                    {products.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 space-y-1.5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <i className={`fa-solid ${isHotel ? "fa-bed" : "fa-utensils"} text-xl text-gray-300`}></i>
                        <p className="text-[10px]">Vos articles ajoutés s'afficheront ici.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {products.slice(0, 4).map((p) => (
                          <div key={p.id} className="p-2 rounded-2xl bg-white border border-gray-150 shadow-sm flex items-center justify-between gap-2.5">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                  <i className={`fa-solid ${isHotel ? "fa-bed" : "fa-utensils"}`}></i>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[11px] text-gray-900 truncate">{p.name}</p>
                              <p className="text-[9px] text-gray-500 truncate">{p.description || "Spécialité maison"}</p>
                            </div>
                            <span 
                              className="font-heading font-black text-xs shrink-0" 
                              style={{ color: formData.primary_color || "#EA580C" }}
                            >
                              {p.price.toLocaleString()} F
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modes de paiement */}
                  <div className="p-3 bg-gray-50/70 border-t border-gray-100 text-[10px] space-y-1.5">
                    <p className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Paiements acceptés :</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(formData.payment_methods || ["MTN MoMo", "Moov Money"]).map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-[9px]">
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-3 bg-white border-t border-gray-100 shadow-md">
                  <div 
                    className="py-2.5 rounded-2xl text-white font-heading font-black text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm"
                    style={{ backgroundColor: formData.primary_color || "#EA580C" }}
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                    <span>Commander par Mobile Money</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
