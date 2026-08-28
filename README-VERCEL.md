# Guide de Diagnostic Vercel

## 🔧 Corrections Appliquées

### 1. Configuration `vercel.json` Optimisée
- ✅ Framework Vite explicitement défini
- ✅ Runtime Node.js 20.x pour les fonctions
- ✅ Cache optimisé pour les assets statiques  
- ✅ Région Europe (fra1) pour de meilleures performances
- ✅ Routage API et fichiers statiques amélioré
- ✅ Headers de sécurité renforcés

### 2. Workflow GitHub Actions Amélioré
- ✅ Déploiements séparés Preview/Production
- ✅ Validation du build avant déploiement
- ✅ Tests automatiques post-déploiement
- ✅ Soumission sitemap Google + Bing
- ✅ Gestion des erreurs améliorée

### 3. Scripts de Déploiement Local
- ✅ Script `deploy-vercel.sh` pour tests locaux
- ✅ Configuration `vercel.local.json` pour dev
- ✅ Validation automatique avant déploiement

## 🚀 Utilisation

Vous pouvez déployer de plusieurs manières : en connectant un dépôt Git (ce qui déclenche des déploiements automatiques à chaque envoi) ou via un déploiement manuel avec la CLI Vercel.

### Déploiement Automatique
```bash
# Push vers main = déploiement production
git push origin main

# Pull Request = déploiement preview  
git checkout -b feature/ma-feature
git push origin feature/ma-feature
# Créer une PR sur GitHub
```

### Déploiement Manuel Local
```bash
# Preview
./scripts/deploy-vercel.sh preview

# Production
./scripts/deploy-vercel.sh production
```

### Test Local avec Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Test local
vercel dev

# Build et preview
vercel build && vercel deploy
```

## 🔍 Diagnostic des Problèmes

### 1. Erreurs de Build
```bash
# Vérifier les logs de build
npm run build

# Vérifier TypeScript
npx tsc --noEmit

# Vérifier le linting
npm run lint
```

### 2. Problèmes de Déploiement
```bash
# Voir les logs Vercel (via CLI)
vercel logs

# Ou via dashboard
# https://vercel.com/dashboard
```

### 3. Configuration Vercel
```bash
# Vérifier la config locale
vercel inspect

# Voir les variables d'environnement
vercel env ls
```

### 4. Tests de Performance
```bash
# Test de charge locale
curl -w "@curl-format.txt" -o /dev/null -s https://www.afrikoin.online

# Où curl-format.txt contient:
#     time_namelookup:  %{time_namelookup}\n
#     time_connect:     %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#     time_pretransfer: %{time_pretransfer}\n
#     time_redirect:    %{time_redirect}\n
#     time_starttransfer: %{time_starttransfer}\n
#     ----------\n
#     time_total:       %{time_total}\n
```

## 🛠️ Variables d'Environnement Requises

### Secrets GitHub Actions
```
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_org_id  
PROJECT_ID=your_project_id
```

### Comment les obtenir
```bash
# Token Vercel
# https://vercel.com/account/tokens

# Project ID
vercel inspect

# Org ID  
vercel teams ls
```

## ⚡ Optimisations Appliquées

### Performance
- Cache immutable pour assets statiques (1 an)
- Cache invalidation pour HTML/JSON (0 sec)
- Région Europe pour latence réduite
- Clean URLs et pas de trailing slash

### Sécurité
- Headers de sécurité complets
- X-Frame-Options: DENY
- CSP via Permissions-Policy
- XSS Protection activée

### SEO
- Sitemap automatiquement soumis
- Robots.txt accessible
- Manifest.json configuré
- Tests automatiques des URLs critiques

## 🔄 Rollback en Cas de Problème

### Via Vercel Dashboard
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet
3. Onglet "Deployments"
4. Cliquer "Promote to Production" sur un déploiement précédent

### Via CLI
```bash
# Lister les déploiements
vercel ls

# Promouvoir un déploiement spécifique
vercel promote <deployment-url>
```

## 📊 Monitoring

### URLs à Surveiller
- https://www.afrikoin.online (Site principal)
- https://www.afrikoin.online/sitemap.xml (SEO)
- https://www.afrikoin.online/robots.txt (SEO)
- https://www.afrikoin.online/manifest.json (PWA)

### Métriques Importantes
- Time to First Byte (TTFB) < 200ms
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

---

> **Note**: Configuration optimisée pour production avec monitoring automatique et rollback facilité.
