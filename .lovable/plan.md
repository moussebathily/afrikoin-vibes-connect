

# Conseils pour rendre AfriKoin meilleur et plus performant

## Analyse de l'existant

Votre projet est déjà bien structuré : lazy loading, code splitting, hooks optimisés, i18n, Supabase. Voici les axes d'amélioration prioritaires.

---

## 1. Performance (impact immédiat)

### A. Réduire le bundle initial
- **Problème** : `@huggingface/transformers` est une dépendance lourde (~50MB) importée dans le bundle principal.
- **Action** : La charger dynamiquement uniquement dans AI Studio via `import()`.
- **Problème** : 17+ packages Radix UI sont installés, certains probablement inutilisés (hover-card, menubar, navigation-menu, toggle-group, etc.).
- **Action** : Supprimer les dépendances Radix non utilisées.

### B. Images et assets
- **Action** : Utiliser des images WebP/AVIF au lieu de PNG/JPG pour les wallpapers et produits.
- **Action** : Ajouter `loading="lazy"` sur toutes les images hors du viewport initial.
- **Action** : Utiliser des tailles d'images adaptées (srcset) pour mobile vs desktop.

### C. Requêtes Supabase
- **Action** : Ajouter `staleTime` et `gcTime` dans React Query pour éviter les re-fetch inutiles :
  ```ts
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 }
    }
  })
  ```
- **Action** : Paginer les requêtes (limiter à 20-50 éléments par page au lieu de tout charger).

---

## 2. Expérience utilisateur (UX)

### A. Offline / PWA
- Ajouter un Service Worker pour le cache des pages visitées.
- Permettre la navigation offline avec les données en cache.

### B. Skeleton loading
- Remplacer le simple "pulse" loader par des squelettes adaptés à chaque page (cards, listes, maps).

### C. Recherche globale
- Ajouter une barre de recherche universelle dans le TopBar pour trouver rapidement produits, emplois, stations.

### D. Notifications push
- Implémenter les web push notifications pour les messages, commandes, et alertes emploi.

---

## 3. Sécurité et fiabilité

### A. RLS (Row Level Security)
- Vérifier que TOUTES les tables ont des politiques RLS actives et correctes.
- Ajouter des politiques granulaires (un utilisateur ne peut modifier que ses propres données).

### B. Validation des entrées
- Ajouter Zod validation côté client ET des contraintes CHECK côté base de données.

### C. Rate limiting
- Utiliser les Edge Functions avec rate limiting pour les actions sensibles (login, signup, like).

---

## 4. Architecture et maintenabilité

### A. Tests
- Ajouter Vitest + React Testing Library pour les composants critiques (Auth, Cart, Checkout).
- Ajouter des tests E2E avec Playwright pour les flux principaux.

### B. Monitoring
- Intégrer Sentry pour capturer les erreurs en production automatiquement.
- Ajouter des analytics (Plausible ou PostHog) pour comprendre l'usage réel.

### C. CI/CD
- Le workflow GitHub existe mais n'est pas complet : ajouter lint + type-check + tests avant chaque déploiement.

---

## 5. SEO et croissance

- Ajouter des meta tags dynamiques par page (Open Graph, Twitter Cards).
- Générer un sitemap dynamique basé sur les produits et emplois réels.
- Optimiser le Largest Contentful Paint (LCP) en priorisant le contenu above-the-fold.

---

## Résumé des priorités

| Priorité | Action | Impact |
|----------|--------|--------|
| 1 | Supprimer `@huggingface/transformers` du bundle principal | -50MB bundle |
| 2 | Configurer `staleTime` dans React Query | Moins de requêtes |
| 3 | Pagination des données | Chargement plus rapide |
| 4 | Images optimisées (WebP + lazy) | LCP amélioré |
| 5 | Supprimer les dépendances Radix inutilisées | Bundle plus léger |
| 6 | Ajouter des tests | Fiabilité |
| 7 | PWA / Service Worker | Expérience offline |

Voulez-vous que j'implémente l'un de ces points en particulier ?

