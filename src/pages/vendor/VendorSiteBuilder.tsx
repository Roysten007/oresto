import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { ref, update, onValue, set, push, query, orderByChild, equalTo, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Globe, Utensils, Calendar, Settings, Palette, Rocket, ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { VendorProfile, Product } from "@/data/mockData";
import StepIdentite from "./builder/StepIdentite";
import StepCarte from "./builder/StepCarte";
import StepMenus from "./builder/StepMenus";
import StepVentes from "./builder/StepVentes";
import StepDesign from "./builder/StepDesign";
import StepLancement from "./builder/StepLancement";

const STEPS = [
  { id: 1, title: "Identité", icon: Globe },
  { id: 2, title: "La Carte", icon: Utensils },
  { id: 3, title: "Menus", icon: Calendar },
  { id: 4, title: "Ventes", icon: Settings },
  { id: 5, title: "Design", icon: Palette },
  { id: 6, title: "Lancement", icon: Rocket },
];

export default function VendorSiteBuilder() {
  const { vendorProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<VendorProfile>>({
    name: "", description: "", slug: "", logo_url: "", cover_url: "",
    primary_color: "#111111", secondary_color: "#FFFFFF", font_choice: "modern",
    sections_config: { hero: true, menu: true, daily: true, footer: true },
    daily_menus: {}, phone: "", whatsapp: "",
    social_links: { instagram: "", facebook: "", tiktok: "" },
    payment_methods: ["Espèces"], ordering_modes: [], is_published: false,
  });

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

    // 1. Instant local preview + update formData immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'logo') setLocalLogo(base64);
      else setLocalCover(base64);
      // Update formData so checklist detects the image right away
      setFormData(prev => ({ ...prev, [key]: base64 }));
    };
    reader.readAsDataURL(file);

    // 2. Try Firebase Storage upload in background (optional)
    if (!storage || !vendorProfile || !db) return;
    try {
      const sRef = storageRef(storage, `vendors/${vendorProfile.id}/${type}_${Date.now()}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      // Replace base64 with permanent URL
      setFormData(prev => ({ ...prev, [key]: url }));
      await update(ref(db, `vendors/${vendorProfile.id}`), { [key]: url });
      toast.success("Image mise à jour");
    } catch (err) {
      console.warn("Firebase Storage upload échoué, base64 conservé:", err);
      // Save the base64 to DB as fallback
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
      await set(push(ref(db, 'products')), data);
      toast.success("Plat ajouté !");
    }
  };

  const deleteProduct = (id: string) => {
    if (!db) return;
    set(ref(db, `products/${id}`), null);
    toast.success("Plat supprimé");
  };

  const saveChanges = async (publish = false) => {
    if (!vendorProfile || !db) return;
    setIsSaving(true);
    try {
      const updates = { ...formData };
      if (publish) updates.is_published = true;
      await update(ref(db, `vendors/${vendorProfile.id}`), updates);
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
      case 2: return <StepCarte products={products} vendorId={vendorProfile?.id || ""} onSave={saveProduct} onDelete={deleteProduct} />;
      case 3: return <StepMenus formData={formData} setFormData={setFormData} products={products} vendorId={vendorProfile?.id || ""} />;
      case 4: return <StepVentes formData={formData} setFormData={setFormData} />;
      case 5: return <StepDesign formData={formData} setFormData={setFormData} localLogo={localLogo} localCover={localCover} />;
      case 6: return <StepLancement formData={formData} products={products} isSaving={isSaving} onPublish={() => saveChanges(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none">Site Factory</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Oresto Connect</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {formData.is_published && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Site en ligne
            </div>
          )}
          <button onClick={() => saveChanges(false)} disabled={isSaving} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors disabled:opacity-50">
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 overflow-x-auto">
        <div className="flex items-center max-w-5xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const active = currentStep === step.id;
            const done = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-3 px-5 py-4 border-b-2 transition-all whitespace-nowrap font-bold text-xs uppercase tracking-widest ${active ? "border-black text-black" : done ? "border-transparent text-green-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${active ? "bg-black text-white" : done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {done ? "✓" : step.id}
                </div>
                <Icon size={14} />
                {step.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 min-h-[500px] flex flex-col">
            <div className="flex-1">
              {renderStep()}
            </div>

            {/* Footer Nav */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-100 transition-all disabled:opacity-0"
              >
                <ChevronLeft size={18} /> Précédent
              </button>

              <div className="flex gap-1.5">
                {STEPS.map(s => (
                  <button key={s.id} onClick={() => setCurrentStep(s.id)} className={`h-1.5 rounded-full transition-all ${currentStep === s.id ? "bg-black w-8" : currentStep > s.id ? "bg-green-500 w-3" : "bg-gray-200 w-3"}`} />
                ))}
              </div>

              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep(p => Math.min(6, p + 1))}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Suivant <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => saveChanges(true)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                >
                  🚀 Publier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
