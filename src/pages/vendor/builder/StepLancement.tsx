import { Copy, Rocket } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { VendorProfile } from "@/data/mockData";
import { Product } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  products: Product[];
  isSaving: boolean;
  onPublish: () => void;
}

export default function StepLancement({ formData, products, isSaving, onPublish }: Props) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const displayUrl = typeof window !== 'undefined' ? `${window.location.host}/r/${formData.slug || "votre-restaurant"}` : `oresto.app/r/${formData.slug || "votre-restaurant"}`;
  const fullUrl = `${baseUrl}/r/${formData.slug || "votre-restaurant"}`;

  const checks = [
    { label: "Nom du restaurant", ok: !!formData.name, fix: "Étape 1" },
    { label: "Image de couverture", ok: !!formData.cover_url, fix: "Étape 1" },
    { label: "Lien URL personnalisé", ok: !!formData.slug, fix: "Étape 1" },
    { label: `Plats sur la carte (${products.length})`, ok: products.length > 0, fix: "Étape 2" },
    { label: "Numéro WhatsApp", ok: !!formData.whatsapp, fix: "Étape 4" },
    { label: "Paiements configurés", ok: (formData.payment_methods?.length || 0) > 0, fix: "Étape 4" },
  ];

  const allGood = checks.every(c => c.ok);

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-8">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <Rocket size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black">Prêt à lancer ?</h2>
        <p className="text-gray-500 text-sm">Votre restaurant sera visible partout dans le monde en un clic.</p>
      </div>

      {/* Checklist */}
      <div className="bg-gray-50 rounded-3xl p-6 space-y-3 border border-gray-100">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Checklist avant publication</h3>
        {checks.map(c => (
          <div key={c.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black ${c.ok ? "bg-green-500" : "bg-gray-300"}`}>
                {c.ok ? "✓" : "!"}
              </div>
              <span className={`text-sm font-medium ${c.ok ? "text-gray-800" : "text-gray-400"}`}>{c.label}</span>
            </div>
            {!c.ok && <span className="text-xs text-orange-500 font-bold">{c.fix}</span>}
          </div>
        ))}
      </div>

      {/* QR Code + URL */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center gap-6 shadow-sm">
        <div className="p-5 bg-gray-50 rounded-2xl">
          <QRCodeSVG value={fullUrl} size={150} />
        </div>
        <div className="w-full flex items-center justify-between bg-gray-100 rounded-2xl px-5 py-3">
          <span className="font-mono text-sm text-gray-600 truncate flex-1">{displayUrl}</span>
          <button onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Lien copié !"); }} className="ml-3 p-2 bg-white rounded-xl shadow-sm hover:bg-black hover:text-white transition-all">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Publish */}
      {!allGood && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-700 text-sm font-medium text-center">
          ⚠️ Complétez les éléments manquants pour une meilleure expérience client.
        </div>
      )}

      <button
        onClick={onPublish}
        disabled={isSaving}
        className="w-full py-5 rounded-2xl bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-2xl disabled:opacity-50"
      >
        {isSaving ? "Publication en cours..." : formData.is_published ? "Mettre à jour le site" : "🚀 Lancer mon site maintenant"}
      </button>
    </div>
  );
}
