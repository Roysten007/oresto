import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { toast } from "sonner";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
}

export default function StepEcommercePromos({ formData, setFormData }: Props) {
  const [promoBannerText, setPromoBannerText] = useState(
    formData.promo_label || "🚚 Livraison Express 24h • Paiement Mobile Money sécurisé à la livraison"
  );
  const [promoBannerEnabled, setPromoBannerEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("20000");

  const [promoCode, setPromoCode] = useState("PROMO10");
  const [discountAmount, setDiscountAmount] = useState("10");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [minOrder, setMinOrder] = useState("15000");

  const handleSavePromos = () => {
    setFormData({
      ...formData,
      promo_label: promoBannerEnabled ? promoBannerText : "",
    });
    toast.success("Paramètres promotionnels enregistrés ✓");
  };

  return (
    <div className="space-y-8 font-body">
      
      {/* Header */}
      <div>
        <h2 className="font-heading font-black text-2xl text-gray-900 flex items-center gap-2.5">
          <i className="fa-solid fa-bullhorn text-primary"></i>
          Promotions, Bandeau d'Annonce & Réductions
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Attirez plus de clients avec un bandeau promotionnel en haut de votre boutique et des codes promos attractifs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bandeau d'Annonce en Haut de la Boutique */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                Haut de page
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={promoBannerEnabled}
                  onChange={e => setPromoBannerEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <h3 className="font-heading font-black text-sm text-gray-900">
              Bandeau d'Annonce Défilant
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Ce message s'affiche tout en haut de votre boutique pour rassurer vos acheteurs sur la livraison et vos offres.
            </p>

            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Texte de l'annonce</label>
              <input
                type="text"
                disabled={!promoBannerEnabled}
                value={promoBannerText}
                onChange={e => {
                  setPromoBannerText(e.target.value);
                  setFormData({ ...formData, promo_label: e.target.value });
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="Ex: 🚚 Livraison offerte dès 20 000 FCFA • Expédition sous 24h"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-900 text-white text-[11px] font-bold flex items-center gap-2">
            <i className="fa-solid fa-eye text-primary"></i>
            <span className="truncate">Aperçu : {promoBannerEnabled ? promoBannerText : "(Bandeau désactivé)"}</span>
          </div>
        </div>

        {/* Code Promo de Réduction */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Code Promo
              </span>
              <span className="text-[10px] font-bold text-gray-400">Actif</span>
            </div>

            <h3 className="font-heading font-black text-sm text-gray-900">
              Code Réduction Client
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Offrez un coupon à vos abonnés TikTok, Instagram ou WhatsApp pour stimuler les ventes.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Nom du code</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-mono font-black text-xs uppercase outline-none focus:border-primary text-primary"
                  placeholder="SOLDES10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Remise (%)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={e => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-bold text-xs outline-none focus:border-primary"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Minimum d'achat (FCFA)</label>
              <input
                type="number"
                value={minOrder}
                onChange={e => setMinOrder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-bold text-xs outline-none focus:border-primary"
                placeholder="15000"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center gap-2 border border-emerald-200/60">
            <i className="fa-solid fa-tag text-emerald-600"></i>
            <span>-{discountAmount}% avec le code <strong>{promoCode}</strong> dès {Number(minOrder).toLocaleString()} F d'achat</span>
          </div>
        </div>

        {/* Livraison Offerte */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-primary flex items-center justify-center text-xs">
              <i className="fa-solid fa-truck"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-xs text-gray-900 uppercase">Seuil de Livraison Gratuite</h3>
              <p className="text-[10px] text-gray-400">Montant d'achat pour offrir les frais de port</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={e => setFreeShippingThreshold(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-heading font-black text-sm text-gray-900 outline-none focus:border-primary"
              placeholder="20000"
            />
            <span className="text-xs font-bold text-gray-500">FCFA</span>
          </div>
        </div>

        {/* Garanties & Réassurance */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-xs text-gray-900 uppercase">Garanties & Confiance</h3>
              <p className="text-[10px] text-gray-400">Badges affichés sous le bouton d'achat</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-150">
              <i className="fa-solid fa-circle-check text-emerald-500 text-xs"></i>
              <span className="font-medium text-gray-700">Paiement Mobile Money Direct (MTN / Moov)</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-150">
              <i className="fa-solid fa-circle-check text-emerald-500 text-xs"></i>
              <span className="font-medium text-gray-700">Échange ou remboursement garanti sous 48h</span>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSavePromos}
          className="px-6 py-3 rounded-2xl bg-black text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-primary transition-all shadow-md active:scale-95"
        >
          Enregistrer mes offres
        </button>
      </div>

    </div>
  );
}
