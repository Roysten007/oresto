import { useState } from "react";
import { ChevronLeft, CreditCard, Plus, Check, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([
    { id: 1, provider: "MoMo MTN", number: "+229 01 02 03 04" }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProvider, setNewProvider] = useState("MoMo MTN");
  const [newNumber, setNewNumber] = useState("");

  const handleAdd = () => {
    if(!newNumber.trim()) {
      toast.error("Veuillez entrer un numéro valide");
      return;
    }
    setPayments([...payments, { id: Date.now(), provider: newProvider, number: newNumber }]);
    setNewNumber("");
    setIsAdding(false);
    toast.success("Moyen de paiement ajouté !");
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
        {payments.map(pay => (
          <div key={pay.id} className="p-6 rounded-[32px] bg-black text-white flex items-start justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 space-y-4 w-full">
              <div className="flex justify-between items-center w-full">
                 <CreditCard size={28} className="text-primary" />
                 <span className="font-heading font-black italic text-lg">{pay.provider}</span>
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
      </div>
    </div>
  );
}
