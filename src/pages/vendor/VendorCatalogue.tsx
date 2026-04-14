import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function VendorCatalogue() {
  const { user } = useAuth();
  const [products, setProducts] = useState(mockProducts.filter(p => p.vendorId === (user?.vendorId || "v1")));
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Mon catalogue</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-sub text-sm btn-hover flex items-center gap-2">
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="rounded-2xl bg-card border border-border overflow-hidden card-hover">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover" loading="lazy" />
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                <div className="flex gap-1">
                  <button className="p-1 rounded text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button className="p-1 rounded text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="font-heading font-bold text-sm text-primary mt-1">{p.price.toLocaleString()} FCFA</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-sub ${p.available ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                {p.available ? "Disponible" : "Rupture"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-muted-foreground">Aucun produit · Ajoutez votre premier produit</p>
        </div>
      )}
    </div>
  );
}
