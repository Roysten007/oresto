import { useState, useEffect } from "react";
import { Product } from "@/data/mockData";
import { X, Plus, Minus, Check, Sparkles, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, selectedAmount: number) => void;
}

export default function FlexiblePortionModal({ product, isOpen, onClose, onConfirm }: Props) {
  const minPrice = product?.minPrice || product?.price || 150;
  const step = product?.priceStep || 50;

  const [amount, setAmount] = useState<number>(minPrice);

  useEffect(() => {
    if (product) {
      setAmount(product.minPrice || product.price || 150);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const quickAmounts = product.suggestedAmounts && product.suggestedAmounts.length > 0
    ? product.suggestedAmounts.filter(a => a >= minPrice)
    : [150, 200, 250, 300, 500, 1000].filter(a => a >= minPrice);

  // Assurer qu'au moins 4 montants rapides sont affichés
  const displayPills = Array.from(new Set([minPrice, minPrice + step, minPrice + step * 2, minPrice + step * 3, 500, 1000]))
    .filter(a => a >= minPrice)
    .sort((a, b) => a - b)
    .slice(0, 6);

  const handleDecrease = () => {
    setAmount(prev => Math.max(minPrice, prev - step));
  };

  const handleIncrease = () => {
    setAmount(prev => prev + step);
  };

  const handleCustomInput = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setAmount(minPrice);
    } else {
      setAmount(Math.max(0, num));
    }
  };

  const handleConfirm = () => {
    const finalAmount = Math.max(minPrice, amount);
    onConfirm(product, finalAmount);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs font-body">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header image & close button */}
          <div className="relative h-44 sm:h-48 bg-gray-100 overflow-hidden shrink-0">
            <img
              src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles size={11} /> Portion au Choix
              </span>
              <h3 className="font-heading font-black text-xl text-white leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {product.description && (
              <p className="text-xs text-gray-500 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stepper interactif de montant */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Utensils size={14} className="text-primary" />
                  <span>Montant de votre portion</span>
                </label>
                <span className="text-[11px] font-bold text-gray-400">
                  Minimum {minPrice.toLocaleString()} F
                </span>
              </div>

              {/* Compteur principal */}
              <div className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={amount <= minPrice}
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-800 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95 transition-all text-base font-bold shrink-0"
                  aria-label="Diminuer"
                >
                  <Minus size={18} />
                </button>

                <div className="flex-1 text-center">
                  <div className="inline-flex items-baseline justify-center gap-1.5">
                    <input
                      type="number"
                      min={minPrice}
                      step={step}
                      value={amount}
                      onChange={(e) => handleCustomInput(e.target.value)}
                      className="w-28 text-center font-heading font-black text-3xl text-gray-900 bg-transparent border-b-2 border-primary/30 focus:border-primary outline-hidden"
                    />
                    <span className="font-heading font-black text-base text-primary">FCFA</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Tranche de {step} FCFA
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-800 flex items-center justify-center hover:bg-gray-100 shadow-xs active:scale-95 transition-all text-base font-bold shrink-0"
                  aria-label="Augmenter"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Boutons de montants rapides (Chips) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Montants rapides populaires :
              </span>
              <div className="grid grid-cols-3 gap-2">
                {displayPills.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 px-2 rounded-xl font-heading font-black text-xs transition-all flex items-center justify-center gap-1 ${
                      amount === val
                        ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{val.toLocaleString()} F</span>
                    {amount === val && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl bg-black hover:bg-primary text-white font-heading font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Ajouter au panier</span>
              <span>•</span>
              <span>{Math.max(minPrice, amount).toLocaleString()} FCFA</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
