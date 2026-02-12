

# Plan d'amelioration de la structure et des performances du projet AfriKoin

## Problemes identifies

Le projet fonctionne mais souffre de plusieurs problemes de structure et de qualite qui freinent sa maintenabilite et ses performances.

### 1. Fichiers parasites a la racine du projet
Le dossier racine contient de nombreux fichiers qui n'ont rien a faire la : fichiers `.zip`, `.jks` (cle de signature), `.bat`, `.gif`, fichiers avec des noms en francais avec espaces, fichiers de notes techniques en vrac. Cela rend le projet confus et alourdit le depot Git.

### 2. Duplication du QueryClient
Le `QueryClient` est declare dans `App.tsx` alors qu'il pourrait etre dans un fichier dedie. Plus important, certaines pages comme `StationsPage` ont eu des bugs car le provider n'etait pas correctement positionne -- ce qui a ete corrige, mais la structure reste fragile.

### 3. Routes repetitives dans App.tsx
Le fichier `App.tsx` fait ~230 lignes avec un pattern `Suspense fallback` repete 10+ fois de maniere identique. Cela nuit a la lisibilite.

### 4. Absence de constantes centralisees pour les routes
Les chemins de navigation sont disperses en tant que strings dans `App.tsx`, `BottomNavigation.tsx`, et les differentes pages. Un changement de route necessite des modifications dans plusieurs fichiers.

### 5. Pas de separation des providers
Tous les providers (Query, Auth, Cart, Router) sont empiles dans `App.tsx`. Une architecture plus propre les separerait.

---

## Plan d'implementation

### Etape 1 -- Nettoyer les fichiers parasites de la racine
Supprimer ou deplacer dans un dossier `docs/` les fichiers qui n'ont pas leur place a la racine :
- Tous les fichiers `.zip` (6+ fichiers)
- Les fichiers avec des noms en francais/espaces (`Publication directe en production...`, `Script Bash (Linux/...`, etc.)
- Les fichiers de notes (`etapedegenerationapk.txt`, `android-resources.md`, `build-mobile.md`, etc.)
- Le fichier `.gif`, `.bat`, `.jks` (la cle de signature ne devrait jamais etre dans le repo)
- Les fichiers `kotlin`, `yml`, `cache action`, `fichier .aab` (fichiers sans extension correcte)

### Etape 2 -- Creer un fichier de constantes de routes
Creer `src/config/routes.ts` avec toutes les routes centralisees :

```typescript
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  MARKETPLACE: '/marketplace',
  PRODUCT: '/product/:id',
  STATIONS: '/stations',
  TABASKI: '/tabaski',
  // ... etc
} as const
```

### Etape 3 -- Extraire un composant LazyRoute reutilisable
Creer `src/components/layout/LazyRoute.tsx` pour eliminer la repetition du pattern Suspense :

```typescript
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteLoader />}>
      {children}
    </Suspense>
  )
}
```

### Etape 4 -- Extraire les Providers dans un composant dedie
Creer `src/components/providers/AppProviders.tsx` qui regroupe QueryClientProvider, AuthProvider, CartProvider. Cela simplifie `App.tsx` et facilite les tests.

### Etape 5 -- Simplifier App.tsx
Apres les etapes precedentes, `App.tsx` sera reduit a ~80 lignes au lieu de ~230, avec une structure claire et sans repetition.

---

## Details techniques

**Fichiers a creer :**
- `src/config/routes.ts` -- constantes de routes
- `src/components/layout/LazyRoute.tsx` -- wrapper Suspense reutilisable
- `src/components/providers/AppProviders.tsx` -- providers centralises

**Fichiers a modifier :**
- `src/App.tsx` -- simplification majeure
- `src/components/layout/BottomNavigation.tsx` -- utiliser les constantes de routes

**Fichiers a supprimer :**
- ~15 fichiers parasites a la racine (zips, notes, fichiers mal nommes)

**Aucun changement fonctionnel** -- l'application se comportera exactement de la meme maniere pour l'utilisateur final.

