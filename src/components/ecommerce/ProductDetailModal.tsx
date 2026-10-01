import { useState, useEffect } from "react";
import { Product } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  onInstantBuy?: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  primaryColor?: string;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onInstantBuy,
  primaryColor = "#EA580C",
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.options && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const isFlexible = product.priceType === "flexible" || (product.minPrice !== undefined && product.minPrice > 0);
  const minPrice = product.minPrice || product.price || 150;
  const step = product.priceStep || 50;
  const [customAmount, setCustomAmount] = useState<number>(() => minPrice);

  useEffect(() => {
    if (product) {
      setCustomAmount(product.minPrice || product.price || 150);
    }
  }, [product]);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-gray-150 max-w-3xl w-full overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh] font-body"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fiche produit"
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/95 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all text-xs"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          {/* Left: Image Gallery */}
          <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-150">
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
              {allImages[activeImageIndex] ? (
                <img
                  src={allImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
                  <i className="fa-solid fa-bag-shopping text-5xl"></i>
                  <span className="text-xs font-bold uppercase">Aucune photo</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider shadow-md">
                    -{discountPercent}% PROMO
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Afficher la photo ${idx + 1} de ${product.name}`}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      activeImageIndex === idx ? "border-primary ring-2 ring-primary/20 scale-105" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {product.category || "Boutique"}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <i className="fa-solid fa-star"></i>
                  <span className="text-gray-900">4.9</span>
                  <span className="text-gray-400 text-[10px] font-normal">(48 avis)</span>
                </div>
              </div>

              <h2 className="font-heading font-black text-xl sm:text-2xl text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Pricing section */}
              <div className="flex items-baseline gap-3 pt-1">
                {isFlexible ? (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">À partir de</span>
                    <span 
                      className="font-heading font-black text-2xl sm:text-3xl"
                      style={{ color: primaryColor }}
                    >
                      {minPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                ) : (
                  <span 
                    className="font-heading font-black text-2xl sm:text-3xl"
                    style={{ color: primaryColor }}
                  >
                    {Number(product.price).toLocaleString()} FCFA
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-bold text-gray-400 line-through">
                    {Number(product.originalPrice).toLocaleString()} F
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs font-bold">
                {isOutOfStock ? (
                  <span className="text-red-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Rupture temporaire
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {product.stock ? `${product.stock} unités en stock` : "En stock • Prêt pour expédition"}
                  </span>
                )}
              </div>
            </div>

            {/* Variants Selectors (e.g. Sizes & Colors) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {product.variants.map((v) => (
                  <div key={v.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black uppercase tracking-wider text-gray-700">{v.name} :</span>
                      <span className="font-bold text-primary">{selectedVariants[v.name] || v.options[0]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => {
                        const isSelected = (selectedVariants[v.name] || v.options[0]) === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleVariantSelect(v.name, opt)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? "bg-black text-white border-black shadow-sm"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description & Key Features */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Article authentique de haute qualité sélectionné par votre boutique."}
              </p>
              
              {product.features && product.features.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                      <i className="fa-solid fa-circle-check text-emerald-500 text-[11px]"></i>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Portion selector for flexible products */}
            {isFlexible && (
              <div className="space-y-2.5 pt-3 border-t border-gray-100 bg-orange-50/60 p-3.5 rounded-2xl border border-orange-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                    Montant de votre portion :
                  </span>
                  <span className="text-[11px] font-bold text-orange-600">
                    Min. {minPrice.toLocaleString()} F
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-orange-200">
                  <button
                    type="button"
                    onClick={() => setCustomAmount(prev => Math.max(minPrice, prev - step))}
                    disabled={customAmount <= minPrice}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                    aria-label="Diminuer portion"
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <div className="flex items-center gap-1 font-heading font-black text-lg text-gray-900">
                    <input
                      type="number"
                      min={minPrice}
                      step={step}
                      value={customAmount}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        setCustomAmount(isNaN(val) ? minPrice : Math.max(0, val));
                      }}
                      className="w-20 text-center font-black bg-transparent outline-none border-b border-primary"
                    />
                    <span className="text-xs text-primary">FCFA</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomAmount(prev => prev + step)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
                    aria-label="Augmenter portion"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {Array.from(new Set([minPrice, minPrice + step, minPrice + step * 2, 500, 1000]))
                    .filter(v => v >= minPrice)
                    .slice(0, 5)
                    .map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCustomAmount(val)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          customAmount === val
                            ? "bg-primary text-white shadow-xs"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {val.toLocaleString()} F
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Quantité :</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <i className="fa-solid fa-minus text-xs"></i>
                  </button>
                  <span className="w-10 text-center font-black text-xs text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    const finalPrice = Math.max(minPrice, customAmount);
                    const productToAdd: Product = isFlexible
                      ? {
                          ...product,
                          id: `${product.id}_amt_${finalPrice}`,
                          price: finalPrice,
                          name: `${product.name} (Portion ${finalPrice.toLocaleString()} FCFA)`
                        }
                      : product;
                    onAddToCart(productToAdd, quantity, selectedVariants);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  <span>Ajouter au Panier</span>
                </button>

                {onInstantBuy && (
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      const finalPrice = Math.max(minPrice, customAmount);
                      const productToAdd: Product = isFlexible
                        ? {
                            ...product,
                            id: `${product.id}_amt_${finalPrice}`,
                            price: finalPrice,
                            name: `${product.name} (Portion ${finalPrice.toLocaleString()} FCFA)`
                          }
                        : product;
                      onInstantBuy(productToAdd, quantity, selectedVariants);
                      onClose();
                    }}
                    className="flex-1 py-3.5 px-4 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <i className="fa-solid fa-bolt"></i>
                    <span>Acheter par MoMo</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
