

# Plan de restructuration du projet AfriKoin

## Objectif
Ameliorer la maintenabilite et la lisibilite du projet sans changer le comportement fonctionnel.

---

## Etape 1 -- Nettoyer les fichiers parasites de la racine

Supprimer les fichiers suivants qui n'ont pas leur place dans le depot :

- Fichiers ZIP : `afrikoin-auto-prod-1755069284.zip`, `afrikoin-google-play-ci-pack-1755043103.zip`, `afrikoin-release-scaffold.zip`, `afrikoin-vibes-connect-auto-fix.zip`, `afrikoin-vibes-connect-main.zip`, `afrikoin-workflow-arm64.zip`, `android-play-prod-any-branch.zip`, `android-play-workflow-best.zip`, `android-play-workflow.zip`, `deploy_afrikoin.zip`, `afrikoin-release-config.zip`, `keystore-fingerprint-tools.zip`, `realtime-chat-supabase-react-master.zip`, `gradle-wrapper-8.7.zip`
- Fichier keystore : `afrikoin-release-key.jks` (ne devrait jamais etre dans le repo)
- Fichiers mal nommes (espaces, noms en francais) : `Publication directe en production a chaque push`, `Script PowerShell (Windows) : build-android.ps1`, `Script Bash (Linux/macOS/WSL) : build-android.sh`, `Configuration des ABI dans Android Studio.md`, `build.yml pour GitHub Actions :`, `cache action`, `fichier .aab`, `docker build avec -f path/Dockerfile`, `.github/workflows/permissions du workflow :`, `« scripts »`
- Notes techniques en vrac : `etapedegenerationapk.txt`, `android-resources.md`, `build-mobile.md`, `kotlin`, `kotlin-Tests Unitaires`, `yml`
- Autres : `gradle-completion-4.0.gif`, `convert_aab_to_apk_Version2.bat`, `gradle-completion.bash`, `gradle-completion.plugin.zsh`

---

## Etape 2 -- Creer les constantes de routes

Creer `src/config/routes.ts` avec toutes les routes centralisees :

```typescript
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  MARKETPLACE: '/marketplace',
  PRODUCT_DETAIL: '/product/:id',
  SELLER: '/seller/:sellerId?',
  CHECKOUT: '/checkout',
  STATIONS: '/stations',
  TABASKI: '/tabaski',
  MY_TABASKI: '/my-tabaski-reservations',
  TRANSPORT: '/transport',
  ADMIN_TRANSPORT: '/admin/transport',
  MY_RENTALS: '/my-rentals',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  NEWS: '/news',
  TRACKING: '/tracking',
  MARKETS: '/markets',
  SPORTS: '/sports',
  CULTURE: '/culture',
  WALLET: '/wallet',
  CALL: '/call',
  AI_STUDIO: '/ai-studio',
  RANKINGS: '/rankings',
  PROFILE: '/profile',
  LIKES: '/likes',
  HOLIDAYS: '/holidays',
  ABOUT: '/about',
  PAYMENT_SUCCESS: '/payment-success',
} as const
```

---

## Etape 3 -- Creer le composant LazyRoute

Creer `src/components/layout/LazyRoute.tsx` -- un wrapper Suspense reutilisable avec un fallback standard, eliminant les 10+ repetitions dans App.tsx.

---

## Etape 4 -- Extraire les Providers

Creer `src/components/providers/AppProviders.tsx` regroupant :
- `QueryClientProvider` (avec creation du QueryClient)
- `AuthProvider`
- `CartProvider`

---

## Etape 5 -- Simplifier App.tsx

Refactorer `App.tsx` pour utiliser les trois nouveaux modules. Le fichier passera de ~230 lignes a ~80 lignes.

---

## Etape 6 -- Mettre a jour BottomNavigation

Modifier `src/components/layout/BottomNavigation.tsx` pour utiliser les constantes de `ROUTES` au lieu de strings en dur.

---

## Resume des fichiers

| Action | Fichier |
|--------|---------|
| Creer | `src/config/routes.ts` |
| Creer | `src/components/layout/LazyRoute.tsx` |
| Creer | `src/components/providers/AppProviders.tsx` |
| Modifier | `src/App.tsx` |
| Modifier | `src/components/layout/BottomNavigation.tsx` |
| Supprimer | ~25 fichiers parasites a la racine |

Aucun changement fonctionnel -- l'application se comportera exactement de la meme maniere pour l'utilisateur.

