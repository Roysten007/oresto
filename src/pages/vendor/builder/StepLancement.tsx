import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { VendorProfile, Product } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  products: Product[];
  isSaving: boolean;
  onPublish: () => void;
}

export default function StepLancement({ formData, products, isSaving, onPublish }: Props) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const displaySlug = formData.slug || "le-maquis-etoile";
  const displayUrl = typeof window !== 'undefined' ? `${window.location.host}/r/${displaySlug}` : `oresto.app/r/${displaySlug}`;
  const fullUrl = `${baseUrl}/r/${displaySlug}`;

  const checks = [
    { label: "Nom de l'établissement", ok: !!formData.name, fix: "Étape 1" },
    { label: "Lien URL personnalisé", ok: !!formData.slug, fix: "Étape 1" },
    { label: `Catalogue (${products.length} article${products.length > 1 ? 's' : ''})`, ok: products.length > 0, fix: "Étape 2" },
    { label: "Numéro WhatsApp", ok: !!formData.whatsapp, fix: "Étape 4" },
    { label: "Modes de paiement MoMo", ok: (formData.payment_methods?.length || 0) > 0, fix: "Étape 4" },
  ];

  const allGood = checks.every(c => c.ok);

  return (
    <div className="space-y-8 font-body max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/25 text-2xl">
          <i className="fa-solid fa-rocket"></i>
        </div>
        <h2 className="font-heading font-black text-2xl text-gray-900">
          Votre site est prêt pour le décollage !
        </h2>
        <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
          Vérifiez vos paramètres avant de mettre votre vitrine en ligne pour vos clients.
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-200">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Checklist de mise en ligne
        </h3>
        {checks.map(c => (
          <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-gray-200/60 last:border-0 text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${c.ok ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                <i className={c.ok ? "fa-solid fa-check" : "fa-solid fa-minus"}></i>
              </div>
              <span className={`font-bold ${c.ok ? "text-gray-800" : "text-gray-400"}`}>{c.label}</span>
            </div>
            {!c.ok && <span className="text-[10px] text-primary font-bold">{c.fix}</span>}
          </div>
        ))}
      </div>

      {/* QR Code & Partage */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col items-center gap-4 shadow-sm">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
          <QRCodeSVG value={fullUrl} size={130} />
        </div>
        <div className="text-center">
          <p className="font-bold text-xs text-gray-900">QR Code Vitrine & Tables</p>
          <p className="text-[11px] text-gray-400">Imprimez ce QR code sur vos tables ou comptoir.</p>
        </div>
        
        <div className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
          <span className="font-mono text-xs text-gray-700 truncate flex-1">{displayUrl}</span>
          <button 
            type="button"
            onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Lien de votre site copié !"); }} 
            className="ml-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-black hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <i className="fa-solid fa-copy"></i> Copier
          </button>
        </div>
      </div>

      {/* Bouton de Publication */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onPublish}
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <i className="fa-solid fa-rocket"></i>
          <span>{isSaving ? "Publication en cours..." : formData.is_published ? "Mettre à jour mon site en ligne" : "Publier mon site maintenant"}</span>
        </button>

        {formData.is_published && (
          <button
            type="button"
            onClick={() => window.open(fullUrl, '_blank')}
            className="w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-900 font-bold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>Ouvrir la vitrine publique du restaurant</span>
          </button>
        )}
      </div>
    </div>
  );
}
