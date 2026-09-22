export default function LandingPivot() {
  return (
    <section className="py-20 sm:py-28 bg-[#070707] text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
          <i className="fa-solid fa-lightbulb"></i>
          LA VÉRITÉ QUE PERSONNE NE VOUS DIT
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-8">
          Le problème ne vient ni de vos clients, ni de vos produits. Le problème est que vous utilisez une <span className="text-primary underline decoration-primary/40">application de discussion</span> pour faire tourner un commerce.
        </h2>

        <div className="p-8 sm:p-10 rounded-[36px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6 text-left max-w-3xl mx-auto shadow-2xl">
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body">
            WhatsApp est extraordinaire pour échanger des nouvelles avec vos proches. Mais <strong>ce n'est ni un menu interactif, ni une caisse enregistreuse, ni un gestionnaire de stocks</strong>.
          </p>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body">
            Chaque seconde où un client doit attendre que vous soyez disponible pour lui épeler un prix ou lui envoyer une photo, c'est <strong>une vente directe qui part chez un concurrent plus rapide</strong>.
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white text-xl shrink-0 shadow-lg shadow-primary/30">
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div>
              <p className="font-heading font-black text-white text-sm">
                Votre entreprise mérite son propre canal officiel de vente.
              </p>
              <p className="text-xs text-white/70">
                Un système automatique qui présente vos articles, prend les commandes et encaisse les paiements 24h/24 sans dépendre de votre temps.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
