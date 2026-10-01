# Oresto Insights — Application Autonome d'Étude de Marché

Application web 100% indépendante et isolée pour mener l'étude de marché auprès des restaurants, maquis, fast-foods et traiteurs au Bénin.

## 🔒 Étanchéité Totale

Cette application est **entièrement découplée** de la plateforme Oresto principale :
- Un restaurateur accédant à ce lien ne peut **jamais** voir, deviner ou accéder au vrai site Oresto (pas de catalogue, pas de dashboard vendeur, pas de boutique).
- La racine `/` ouvre directement l'étude de marché.
- L'administration `/admin` est protégée par authentification Firebase et vérification de rôle.

---

## 🚀 Déploiement Vercel en 1 minute (URL Indépendante)

1. Rendez-vous sur votre tableau de bord **Vercel** (`vercel.com`).
2. Cliquez sur **Add New... > Project**.
3. Sélectionnez votre dépôt GitHub `Roysten007/oresto`.
4. Dans les paramètres du projet :
   - Nom du projet : `oresto-insights`
   - **Root Directory** : cliquez sur **Edit** et sélectionnez le dossier `oresto-insights`.
5. Cliquez sur **Deploy**.

Vercel va générer un lien totalement distinct (ex: `https://oresto-insights.vercel.app`).
Vous pouvez également y lier un sous-domaine personnalisé comme `insights.oresto.bj` ou `etude.oresto.bj`.

---

## 💻 Démarrage Local

```bash
cd oresto-insights
npm install
npm run dev
```

L'application tourne par défaut sur `http://localhost:5174`.

- **Questionnaire public :** `http://localhost:5174/`
- **Dashboard administrateur :** `http://localhost:5174/admin`
- **Connexion admin :** `http://localhost:5174/login`

---

## 🗄️ Base de Données

Les réponses sont automatiquement stockées dans le nœud `survey_responses` de votre base Firebase Realtime Database.
Les administrateurs peuvent également consulter ces réponses directement depuis le panel d'administration central d'Oresto (`/oresto-admin/insights`).
