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
    name: "", description: "", slug: "", logo_url: "", cover_url: "",
    primary_color: "#EA580C", secondary_color: "#FFFFFF", font_choice: "modern",
    sections_config: { hero: true, menu: true, daily: true, footer: true },
    daily_menus: {}, phone: "", whatsapp: "",
    social_links: { instagram: "", facebook: "", tiktok: "" },
    payment_methods: ["Espèces"], ordering_modes: [], is_published: false,
  });

  const isHotel = isHotelCategory(formData.category || vendorProfile?.category);

  const steps = [
    { id: 1, title: "Identité", icon: "fa-solid fa-globe", desc: "Définissez le nom, le lien web et le logo de votre établissement." },
    { id: 2, title: isHotel ? "Mes Chambres" : "La Carte", icon: isHotel ? "fa-solid fa-hotel" : "fa-solid fa-utensils", desc: "Ajoutez vos plats ou chambres avec photos et tarifs exacts." },
    { id: 3, title: "Menus", icon: "fa-solid fa-calendar-days", desc: "Programmez vos menus du jour et suggestions spéciales." },
    { id: 4, title: "Ventes & MoMo", icon: "fa-solid fa-money-bill-wave", desc: "Configurez vos numéros Mobile Money et modes de livraison." },
    { id: 5, title: "Design", icon: "fa-solid fa-palette", desc: "Personnalisez les couleurs et la typographie de votre vitrine." },
    { id: 6, title: "Lancement", icon: "fa-solid fa-rocket", desc: "Vérifiez votre checklist et publiez votre site en 1 clic." },
  ];

  useEffect(() => {
    if (!vendorProfile || !db) return;
    setFormData(prev => ({
      ...prev, ...vendorProfile,
      social_links: vendorProfile.social_links || { instagram: "", facebook: "", tiktok: "" },
      ordering_modes: vendorProfile.ordering_modes || [],
    }));
    setLocalLogo(vendorProfile.logo_url || null);
    setLocalCover(vendorProfile.cover_url || null);
    const unsubscribe = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] })).filter((p: any) => p.vendorId === vendorProfile.id) as Product[];
        setProducts(list);
      } else { setProducts([]); }
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
    } catch (err) {
      console.warn("Firebase Storage upload échoué, base64 conservé:", err);
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
      toast.success(isHotel ? "Chambre mise à jour" : "Plat mis à jour");
    } else {
      await set(push(ref(db, 'products')), data);
      toast.success(isHotel ? "Chambre ajoutée !" : "Plat ajouté !");
    }
  };

  const deleteProduct = (id: string) => {
    if (!db) return;
    set(ref(db, `products/${id}`), null);
    toast.success(isHotel ? "Chambre supprimée" : "Plat supprimé");
  };

  const saveChanges = async (publish = false) => {
    if (!vendorProfile || !db) return;
    setIsSaving(true);
    try {
      const updates = { ...formData };
      if (publish) updates.is_published = true;
      await update(ref(db, `vendors/${vendorProfile.id}`), updates);
      
      if (formData.slug) {
        await update(ref(db, `slugs/${formData.slug.toLowerCase()}`), { 
          vendorId: vendorProfile.id 
        });
      }

      if (publish) {
        setFormData(prev => ({ ...prev, is_published: true }));
        toast.success("🎉 Votre site est en ligne !");
      } else {
        toast.success("Brouillon sauvegardé");
      }
    } catch { toast.error("Erreur de sauvegarde"); } finally { setIsSaving(false); }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepIdentite formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} checkingSlug={checkingSlug} handleSlugChange={handleSlugChange} handleFileUpload={handleFileUpload} />;
      case 2: return <StepCarte products={products} vendorId={vendorProfile?.id || ""} onSave={saveProduct} onDelete={deleteProduct} category={formData.category || vendorProfile?.category} />;
      case 3: return <StepMenus formData={formData} setFormData={setFormData} products={products} vendorId={vendorProfile?.id || ""} />;
      case 4: return <StepVentes formData={formData} setFormData={setFormData} />;
      case 5: return <StepDesign formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} />;
      case 6: return <StepLancement formData={formData} products={products} isSaving={isSaving} onPublish={() => saveChanges(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col font-body">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-5 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
          </div>
          <div>
            <h1 className="font-black text-lg leading-none">Site Factory</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Création guidée en 12 min</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
              showLivePreview ? "bg-primary/10 border-primary/30 text-primary" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <i className="fa-solid fa-mobile-screen-button"></i>
            {showLivePreview ? "Masquer l'aperçu mobile" : "Afficher l'aperçu mobile"}
          </button>

          {formData.is_published && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
              <i className="fa-solid fa-circle text-[8px] text-emerald-500 animate-pulse"></i> Site en ligne
            </div>
          )}
          <button onClick={() => saveChanges(false)} disabled={isSaving} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <i className="fa-solid fa-floppy-disk"></i>
            <span>{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
          </button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 overflow-x-auto sticky top-[73px] z-20">
        <div className="flex items-center max-w-7xl mx-auto">
          {steps.map((step) => {
            const active = currentStep === step.id;
            const done = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2.5 px-5 py-4 border-b-2 transition-all whitespace-nowrap font-bold text-xs uppercase tracking-widest ${
                  active ? "border-primary text-primary" : done ? "border-transparent text-emerald-600" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                  active ? "bg-primary text-white shadow-sm" : done ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <i className="fa-solid fa-check text-[9px]"></i> : step.id}
                </div>
                <i className={step.icon}></i>
                {step.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area with Live Mobile Mockup */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8">
          
          {/* Step Guide Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-sm font-bold">
                <i className={steps[currentStep - 1].icon}></i>
              </div>
              <div>
                <h2 className="font-heading font-black text-sm text-gray-900">
                  Étape {currentStep} sur 6 : {steps[currentStep - 1].title}
                </h2>
                <p className="text-xs text-gray-500">{steps[currentStep - 1].desc}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-gray-400 font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-100 hidden sm:inline-block">
              {Math.round((currentStep / 6) * 100)}% complété
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Step Form & Configurations */}
            <div className={`${showLivePreview ? "lg:col-span-7" : "lg:col-span-12"} transition-all duration-300`}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 md:p-10 min-h-[500px] flex flex-col justify-between">
                <div className="flex-1">
                  {renderStep()}
                </div>

                {/* Footer Nav */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-100 transition-all disabled:opacity-0"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Précédent
                  </button>

                  <div className="flex gap-1.5">
                    {steps.map(s => (
                      <button key={s.id} onClick={() => setCurrentStep(s.id)} className={`h-1.5 rounded-full transition-all ${currentStep === s.id ? "bg-primary w-8" : currentStep > s.id ? "bg-emerald-500 w-3" : "bg-gray-200 w-3"}`} />
                    ))}
                  </div>

                  {currentStep < 6 ? (
                    <button
                      onClick={() => setCurrentStep(p => Math.min(6, p + 1))}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white text-sm font-bold hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                      Suivant <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => saveChanges(true)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-black uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 disabled:opacity-50 active:scale-95"
                    >
                      <i className="fa-solid fa-rocket"></i> Publier mon site
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Smartphone Mockup */}
            {showLivePreview && (
              <div className="lg:col-span-5 sticky top-[150px] hidden lg:block">
                <div className="p-4 rounded-[42px] bg-gray-900 border-4 border-gray-800 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-white/60 text-[11px] font-bold px-3">
                    <span className="flex items-center gap-1.5 text-primary">
                      <i className="fa-solid fa-mobile-screen"></i> Aperçu Smartphone Live
                    </span>
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-400">
                      Synchronisé
                    </span>
                  </div>

                  {/* Phone Screen Mockup */}
                  <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-inner h-[580px] overflow-y-auto text-gray-900 flex flex-col text-xs">
                    
                    {/* Cover & Header */}
                    <div 
                      className="h-28 bg-gray-800 bg-cover bg-center relative p-3 flex flex-col justify-between"
                      style={{ backgroundImage: localCover || formData.cover_url ? `url(${localCover || formData.cover_url})` : undefined }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="relative z-10 flex justify-between items-center text-white text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">oresto.me/{formData.slug || "votre-lien"}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black">Ouvert</span>
                      </div>
                      <div className="relative z-10 flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md overflow-hidden shrink-0">
                          {localLogo || formData.logo_url ? (
                            <img src={localLogo || formData.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full bg-primary text-white flex items-center justify-center font-black text-sm">
                              {formData.name ? formData.name.charAt(0).toUpperCase() : "R"}
                            </div>
                          )}
                        </div>
                        <div className="text-white">
                          <h4 className="font-heading font-black text-xs leading-none drop-shadow-sm">{formData.name || "Nom de votre restaurant"}</h4>
                          <p className="text-[9px] text-gray-200 mt-0.5">{formData.category || "Restaurant & Bar"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info & Action Bar */}
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <span><i className="fa-solid fa-clock text-primary"></i> 11h - 23h</span>
                        <span>•</span>
                        <span><i className="fa-solid fa-phone text-emerald-600"></i> MoMo direct</span>
                      </div>
                      <span className="font-bold text-primary">0% Commission</span>
                    </div>

                    {/* Menu preview */}
                    <div className="p-3 space-y-2.5 flex-1">
                      <div className="flex items-center justify-between font-heading font-black text-xs text-gray-900 border-b border-gray-100 pb-1">
                        <span>{isHotel ? "Chambres & Suites" : "La Carte des Plats"}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{products.length} {isHotel ? "chambres" : "plats"}</span>
                      </div>

                      {products.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 space-y-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <i className="fa-solid fa-utensils text-xl text-gray-300"></i>
                          <p className="text-[10px]">Vos plats ou chambres ajoutés à l'étape 2 apparaîtront ici en direct.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {products.slice(0, 3).map((p) => (
                            <div key={p.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">{p.name}</p>
                                <p className="text-[9px] text-gray-500 truncate">{p.description || "Délicieuse préparation maison"}</p>
                              </div>
                              <span className="font-heading font-black text-primary shrink-0">
                                {p.price.toLocaleString()} F
                              </span>
                            </div>
                          ))}
                          {products.length > 3 && (
                            <p className="text-[9px] text-center text-gray-400 font-bold">
                              + {products.length - 3} autres articles au menu
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mockup Sticky Order Footer */}
                    <div className="p-3 bg-white border-t border-gray-100 shadow-md">
                      <div className="py-2.5 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm">
                        <i className="fa-solid fa-bag-shopping"></i> Commander par Mobile Money
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
