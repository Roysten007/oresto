export default function VendorDelivery() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Livraison</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: "🚗", title: "Mes propres livreurs", desc: "Vous gérez votre propre équipe" },
          { icon: "🤝", title: "Livreurs Oresto", desc: "Oresto assigne des livreurs disponibles" },
          { icon: "🏪", title: "À emporter uniquement", desc: "Le client vient chercher" },
        ].map((mode, i) => (
          <label key={i} className="card-hover p-6 rounded-2xl bg-card border-2 border-border cursor-pointer hover:border-primary">
            <input type="radio" name="delivery" defaultChecked={i === 0} className="accent-primary mb-3" />
            <span className="text-3xl block mb-2">{mode.icon}</span>
            <h3 className="font-heading font-semibold text-foreground">{mode.title}</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">{mode.desc}</p>
          </label>
        ))}
      </div>
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">Zones de livraison</h3>
        <div className="space-y-2">
          {[{ zone: "Akpakpa, Cotonou", fee: "500 FCFA", time: "~20 min" }, { zone: "Cadjèhoun, Cotonou", fee: "700 FCFA", time: "~30 min" }].map((z, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="font-sub text-sm text-foreground">{z.zone}</span>
              <span className="font-body text-sm text-muted-foreground">{z.fee} · {z.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
