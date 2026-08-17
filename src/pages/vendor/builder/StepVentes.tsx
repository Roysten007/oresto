import { VendorProfile } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
}

const PAYMENT_METHODS = [
  { id: "MTN MoMo", label: "MTN Mobile Money", icon: "fa-solid fa-mobile-screen", color: "bg-yellow-500" },
  { id: "Moov Money", label: "Moov Money", icon: "fa-solid fa-mobile-screen-button", color: "bg-blue-600" },
  { id: "Espèces", label: "Paiement Cash à la livraison", icon: "fa-solid fa-money-bill-wave", color: "bg-emerald-600" },
  { id: "Celtiis Cash", label: "Celtiis Cash", icon: "fa-solid fa-wallet", color: "bg-purple-600" },
];

const ORDER_MODES = [
  { id: "Livraison", label: "Livraison à domicile", icon: "fa-solid fa-motorcycle" },
  { id: "À Emporter", label: "À emporter / Click & Collect", icon: "fa-solid fa-bag-shopping" },
  { id: "Sur Place", label: "Service à table / QR Code", icon: "fa-solid fa-chair" },
  { id: "WhatsApp Direct", label: "Commande WhatsApp en 1 clic", icon: "fa-brands fa-whatsapp" }
];

export default function StepVentes({ formData, setFormData }: Props) {
  const togglePayment = (method: string) => {
    const current = formData.payment_methods || [];
    const updated = current.includes(method) ? current.filter(m => m !== method) : [...current, method];
    setFormData({ ...formData, payment_methods: updated });
  };

  const toggleOrderMode = (mode: string) => {
    const current = formData.ordering_modes || [];
    const updated = current.includes(mode) ? current.filter(m => m !== mode) : [...current, mode];
    setFormData({ ...formData, ordering_modes: updated });
  };

  return (
    <div className="space-y-8 font-body">
      <div>
        <h2 className="font-heading font-black text-2xl text-gray-900 mb-1">
          Ventes, WhatsApp & MoMo
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Configurez la réception de vos paiements Mobile Money et vos canaux de livraison.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Canaux de Vente */}
        <div className="space-y-6">
          <h3 className="font-heading font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-bullhorn text-primary"></i> Canaux & Modes de Prise de Commande
          </h3>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
              Numéro WhatsApp Commandes *
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:bg-white transition-all">
              <i className="fa-brands fa-whatsapp text-emerald-600 text-lg"></i>
              <input
                type="tel"
                value={formData.whatsapp || ""}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="flex-1 bg-transparent outline-none font-bold text-xs text-gray-900"
                placeholder="+229 97 00 00 00"
              />
            </div>
            <p className="text-[11px] text-gray-400 italic">Vos alertes de nouvelles commandes arriveront directement sur ce numéro.</p>
          </div>

          <div className="space-y-2.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
              Services Activés
            </label>
            <div className="space-y-2">
              {ORDER_MODES.map(mode => {
                const active = formData.ordering_modes?.includes(mode.id);
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => toggleOrderMode(mode.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                      active ? "border-primary bg-orange-50/40 text-gray-900 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${active ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                        <i className={mode.icon}></i>
                      </div>
                      <span className="font-bold text-xs">{mode.label}</span>
                    </div>
                    {active ? (
                      <i className="fa-solid fa-circle-check text-primary text-base"></i>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Moyens de Paiement */}
        <div className="space-y-6">
          <h3 className="font-heading font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-credit-card text-primary"></i> Paiements Directs MoMo (0% Commission)
          </h3>

          <div className="space-y-2.5">
            {PAYMENT_METHODS.map(method => {
              const active = formData.payment_methods?.includes(method.id);
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => togglePayment(method.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                    active ? "border-primary bg-orange-50/40 text-gray-900 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${active ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                      <i className={method.icon}></i>
                    </div>
                    <span className="font-bold text-xs">{method.label}</span>
                  </div>
                  {active ? (
                    <i className="fa-solid fa-circle-check text-primary text-base"></i>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex gap-3 items-center">
            <i className="fa-solid fa-shield-halved text-emerald-600 text-lg shrink-0"></i>
            <p className="leading-relaxed">
              <strong>Zéro intermédiaire :</strong> Vos clients vous transfèrent l'argent directement par MoMo sur votre compte sans délai de virement.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
