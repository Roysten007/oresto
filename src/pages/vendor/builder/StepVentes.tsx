import { Check } from "lucide-react";
import { VendorProfile } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
}

const PAYMENT_METHODS = ["Espèces", "Orange Money", "MTN MoMo", "Wave", "Carte Bancaire"];
const ORDER_MODES = ["Livraison", "À Emporter", "Sur Place", "WhatsApp Direct"];

export default function StepVentes({ formData, setFormData }: Props) {
  const togglePayment = (method: string) => {
    const current = formData.payment_methods || [];
    const updated = current.includes(method) ? current.filter(m => m !== method) : [...current, method];
    setFormData({ ...formData, payment_methods: updated });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Canaux de Vente</h2>
          <p className="text-sm text-gray-500 mt-1">Comment vos clients passent-ils commande ?</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Numéro WhatsApp commandes</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-black transition-all">
              <span className="text-xl">📱</span>
              <input
                type="tel"
                value={formData.whatsapp || ""}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="flex-1 bg-transparent outline-none font-bold text-base"
                placeholder="+225 07 00 00 00 00"
              />
            </div>
            <p className="text-xs text-gray-400">Les commandes WhatsApp seront envoyées à ce numéro.</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Modes de commande</label>
            <div className="grid grid-cols-1 gap-2">
              {ORDER_MODES.map(mode => {
                const active = formData.ordering_modes?.includes(mode);
                return (
                  <button key={mode} type="button" onClick={() => {
                    const curr = formData.ordering_modes || [];
                    setFormData({ ...formData, ordering_modes: active ? curr.filter(m => m !== mode) : [...curr, mode] });
                  }} className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${active ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                    <span>{mode}</span>
                    {active && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Paiements Acceptés</h2>
          <p className="text-sm text-gray-500 mt-1">Sélectionnez tous les modes de paiement disponibles.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {PAYMENT_METHODS.map(method => {
            const active = formData.payment_methods?.includes(method);
            return (
              <button key={method} type="button" onClick={() => togglePayment(method)} className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${active ? "border-black bg-black text-white shadow-lg" : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {method === "Espèces" ? "💵" : method === "Orange Money" ? "🟠" : method === "MTN MoMo" ? "🟡" : method === "Wave" ? "🌊" : "💳"}
                  </span>
                  {method}
                </div>
                {active && <Check size={18} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
