## Objectif
Livrer un pack SEO + FAQ intégrée multilingue + Assistant IA support pour AfriKoin.

---

## 1. Pack SEO (contenu statique, pas de backend)

**Landing FAQ** `src/pages/HelpFaqPage.tsx` (route `/aide`)
- H1 + meta SEO via `SEOHead` (FR/EN/WO/HA)
- JSON-LD `FAQPage` (Schema.org) injecté dynamiquement
- Sections : Arnaques & confiance · Mobile Money · Livraison · Retours · Vendeurs

**5 articles** dans `src/pages/articles/`
1. `EviterArnaquesPage.tsx` — `/aide/articles/eviter-arnaques`
2. `PayerMobileMoneyPage.tsx` — `/aide/articles/paiement-mobile-money`
3. `LivraisonAfriquePage.tsx` — `/aide/articles/livraison`
4. `RetoursRemboursementsPage.tsx` — `/aide/articles/retours`
5. `VendreEnConfiancePage.tsx` — `/aide/articles/vendre-en-confiance`

Chaque article : `SEOHead`, JSON-LD `Article` + `BreadcrumbList`, contenu markdown structuré, liens internes, CTA.

**Traductions** : ajout des clés `help.*` et `articles.*` dans `src/i18n/locales/{fr,en,wo,ha}/common.json` (création des fichiers `wo` et `ha` si absents pour ces clés).

**Sitemap** : ajout des 6 nouvelles URLs dans `public/sitemap.xml`.

---

## 2. FAQ intégrée (composant + données)

**Données** `src/data/faqData.ts`
- Tableau typé `FaqItem { id, category: 'buyer'|'seller', tags[], q: {fr,en,wo,ha}, a: {fr,en,wo,ha}, linkSlug? }`
- ~24 questions (12 acheteurs / 12 vendeurs) couvrant arnaques, Mobile Money, livraison, retours, vérification, commissions, retrait des gains.

**Composants** `src/components/help/`
- `FaqSearch.tsx` — input avec debounce, recherche fuzzy multilingue (sur `q[lang]` + `a[lang]` + tags)
- `FaqAccordion.tsx` — basé sur `@/components/ui/accordion` (Radix), variants glass, lien "Lire l'article complet" si `linkSlug`
- `FaqTabs.tsx` — onglets Acheteurs / Vendeurs / Tous
- Intégré dans `HelpFaqPage` + bouton "Aide" dans `BottomNavigation` ou TopBar (à confirmer : ajout dans le menu "More")

---

## 3. Assistant IA de support

**Edge Function** `supabase/functions/ai-support-assistant/index.ts`
- Reçoit `{ messages, lang }` 
- System prompt : injecte la FAQ complète (JSON compact) + consigne "réponds dans `lang`, cite jusqu'à 3 `faqIds` pertinents"
- Appelle Lovable AI Gateway (`google/gemini-3-flash-preview`), streaming SSE
- Gère 402/429 avec messages clairs
- CORS, pas de JWT requis (lecture seule)

**Hook** `src/hooks/useSupportChat.ts`
- Parse SSE token-par-token (pattern fourni)
- Extrait les `[FAQ:id]` cités via regex pour afficher des cartes-liens

**UI** `src/components/help/SupportChat.tsx`
- Bouton flottant (bulle) sur `HelpFaqPage` et accessible via `/aide/assistant`
- Markdown rendering (`react-markdown` + `remark-gfm`)
- Affichage des FAQ citées sous forme de chips cliquables qui scrollent vers l'accordéon correspondant
- Multilingue (placeholder, messages d'erreur via i18n)

---

## 4. Routes & navigation

`src/config/routes.ts` :
- `/aide` → `HelpFaqPage` (lazy)
- `/aide/assistant` → page dédiée chat (lazy)
- `/aide/articles/:slug` → router par slug vers le composant article correspondant

Ajout d'un lien "Centre d'aide" dans le menu More.

---

## Détails techniques

- **SEO** : `SEOHead.tsx` existant utilisé partout ; JSON-LD via `<script type="application/ld+json">` inline dans chaque page.
- **i18n** : utilisation de `i18next` déjà configuré ; fallback FR si la traduction WO/HA manque.
- **Pas de nouvelle table DB** : la FAQ est statique (versionnée dans le code). Si besoin d'éditer sans déployer plus tard → migration vers Supabase (non inclus ici).
- **Lovable AI** : `LOVABLE_API_KEY` déjà présent → pas de secret à ajouter.
- **Recherche FAQ** : implémentation simple `includes()` normalisée (lowercase + diacritiques retirés) — pas de dépendance externe.

---

## Hors périmètre (à confirmer si besoin)
- Édition admin de la FAQ via UI back-office
- RAG vectoriel (embeddings) — l'injection complète de la FAQ dans le prompt suffit à ce volume
- Génération d'images d'illustration pour les articles

Confirme et j'implémente.
