import { useState, useEffect } from "react";
import { ChevronLeft, CreditCard, Plus, Check, Smartphone, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, get, update } from "firebase/database";

interface PaymentMethod {
  id: string;
  provider: string;
  number: string;
}

export default function Payments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProvider, setNewProvider] = useState("MoMo MTN");
  const [newNumber, setNewNumber] = useState("");

  // Charge les moyens de paiement enregistrés
  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }
    get(ref(db, `user_preferences/${user.id}/payment_methods`)).then(snap => {
      if (snap.exists()) {
        const val = snap.val();
        setPayments(Array.isArray(val) ? val : Object.values(val));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  // Sauvegarde (optimiste) dans Firebase
  const persist = async (list: PaymentMethod[]) => {
    setPayments(list);
    if (user && db) {
      try {
        await update(ref(db, `user_preferences/${user.id}`), { payment_methods: list });
      } catch {
        toast.error("Erreur de sauvegarde");
      }
    }
  };

  const handleAdd = () => {
    if (!newNumber.trim()) {
      toast.error("Veuillez entrer un numéro valide");
      return;
    }
    persist([...payments, { id: Date.now().toString(), provider: newProvider, number: newNumber.trim() }]);
    setNewNumber("");
    setIsAdding(false);
    toast.success("Moyen de paiement ajouté !");
  };

  const handleRemove = (id: string) => {
    persist(payments.filter(p => p.id !== id));
    toast.success("Moyen de paiement supprimé");
  };

  return (
    <div className="py-8 space-y-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Moyens de paiement</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {payments.length === 0 && !isAdding && (
              <div className="py-10 text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucun moyen de paiement enregistré</p>
              </div>
            )}

            {payments.map(pay => (
              <div key={pay.id} className="p-6 rounded-[32px] bg-black text-white flex items-start justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 space-y-4 w-full">
                  <div className="flex justify-between items-center w-full">
                    <CreditCard size={28} className="text-primary" />
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-black italic text-lg">{pay.provider}</span>
                      <button
                        onClick={() => handleRemove(pay.id)}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-500 flex items-center justify-center transition-colors active:scale-90"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Numéro lié</p>
                    <h3 className="font-black tracking-widest text-lg">{pay.number}</h3>
                  </div>
                </div>
              </div>
            ))}

            {isAdding ? (
              <div className="p-6 rounded-[32px] bg-white border-2 border-primary shadow-sm space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-primary">Nouveau Mobile Money</h3>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Opérateur</label>
                  <select
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value)}
                    className="w-full mt-1 bg-gray-50 rounded-2xl p-4 outline-none text-sm font-bold appearance-none"
                  >
                    <option value="MoMo MTN">MTN Mobile Money</option>
                    <option value="Moov Money">Moov Money</option>
                    <option value="Celtiis Cash">Celtiis Cash</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Numéro de téléphone</label>
                  <div className="relative mt-1">
                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={newNumber}
                      onChange={e => setNewNumber(e.target.value)}
                      className="w-full bg-gray-50 rounded-2xl pl-12 pr-4 py-4 outline-none text-sm font-bold"
                      placeholder="Ex: +229 97 00 00 00"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-200">Annuler</button>
                  <button onClick={handleAdd} className="flex-1 py-3 bg-black text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary flex items-center justify-center gap-2">
                    <Check size={14}/> Ajouter
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAdding(true)} className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
                <Plus size={24} />
                <span className="font-black text-[10px] uppercase tracking-widest">Ajouter un moyen de paiement</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
