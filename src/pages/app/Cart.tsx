import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartItem { id: string; name: string; price: number; qty: number; image: string }

const initialCart: CartItem[] = [
  { id: "p1", name: "Poulet braisé", price: 3500, qty: 2, image: "https://picsum.photos/seed/poulet/100/100" },
  { id: "p4", name: "Jus de bissap", price: 500, qty: 1, image: "https://picsum.photos/seed/bissap/100/100" },
];

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>(initialCart);
  const [paymentMethod, setPaymentMethod] = useState("momo_mtn");

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Votre panier est vide</h2>
        <p className="font-body text-muted-foreground mb-6">Explorez les boutiques et ajoutez des articles</p>
        <Link to="/app/home" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover inline-block">
          Explorer les boutiques
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Mon panier <span className="text-muted-foreground font-normal text-base">({items.length})</span></h1>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm font-semibold text-foreground truncate">{item.name}</h3>
              <p className="font-heading text-sm font-bold text-primary">{item.price.toLocaleString()} FCFA</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><Minus size={14} /></button>
              <span className="font-sub text-sm w-6 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus size={14} /></button>
            </div>
            <button onClick={() => remove(item.id)} className="text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Mode de paiement</h2>
        <div className="space-y-2">
          {[
            { id: "momo_mtn", label: "📱 MTN MoMo" },
            { id: "momo_moov", label: "📱 Moov Money" },
            { id: "cash", label: "💵 Cash à la livraison" },
          ].map(pm => (
            <label key={pm.id} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === pm.id ? "border-primary bg-oresto-orange-light" : "border-border"}`}>
              <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-primary" />
              <span className="font-sub text-sm text-foreground">{pm.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-muted space-y-2">
        <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Sous-total</span><span className="text-foreground">{subtotal.toLocaleString()} FCFA</span></div>
        <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Livraison</span><span className="text-foreground">{deliveryFee.toLocaleString()} FCFA</span></div>
        <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border"><span className="text-foreground">Total</span><span className="text-primary">{total.toLocaleString()} FCFA</span></div>
      </div>

      <Link to="/app/order/CMD-002" className="block w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold text-center btn-hover">
        Confirmer la commande
      </Link>
    </div>
  );
}
