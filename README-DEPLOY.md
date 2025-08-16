# Guide de Déploiement AfriKoin

## ✅ Corrections Appliquées

### 1. Node.js 20.x
- ✅ Tous les workflows GitHub Actions mis à jour vers Node.js 20
- ✅ Compatible avec Capacitor CLI >= 20.0.0

### 2. Configuration Docker
- ✅ `Dockerfile` optimisé multi-stage avec Nginx
- ✅ `.dockerignore` pour réduire la taille du contexte
- ✅ Configuration Nginx avec health check sur `/health`
- ✅ Port 8080 pour Cloud Run

### 3. Cloud Build Amélioré
- ✅ `cloudbuild.yaml` avec étapes de validation
- ✅ Test de l'image Docker avant déploiement
- ✅ Configuration Cloud Run optimisée
- ✅ Health check et vérification post-déploiement

### 4. Scripts Manquants
- ✅ Script `test` ajouté au package.json (lecture seule)
- ✅ Scripts Capacitor pour sync mobile
- ✅ Script de validation locale

## 🚀 Comment Déployer

### Déploiement Automatique (Cloud Build)
1. Push vers `main` déclenche automatiquement le build
2. Cloud Build construit l'image Docker
3. Déploie sur Cloud Run avec validation

### Test Local avec Docker
```bash
# Construction de l'image
docker build -t afrikoin-local .

# Test du conteneur
docker run -p 8080:8080 afrikoin-local

# Accéder à http://localhost:8080
```

### Validation Complète
```bash
# Rendre le script exécutable
chmod +x scripts/validate-build.sh

# Exécuter la validation
./scripts/validate-build.sh
```

### Développement avec Docker Compose
```bash
# Mode production
docker-compose up afrikoin-app

# Mode développement avec hot reload
docker-compose --profile dev up afrikoin-dev
```

## 🔧 Configuration Requise

### Variables d'Environnement Cloud Run
- `NODE_ENV=production`
- Port: `8080`
- Mémoire: `512Mi`
- CPU: `1`

### Secrets GitHub (si utilisés)
- `VERCEL_TOKEN` - Token Vercel pour déploiement web
- `ORG_ID` - ID organisation Vercel
- `PROJECT_ID` - ID projet Vercel

## 📱 Mobile (Capacitor)

### Synchronisation après mise à jour
```bash
# Après git pull
npx cap sync

# Spécifique à une plateforme
npx cap sync android
npx cap sync ios
```

### Build mobile
```bash
# Android
npx cap run android

# iOS (nécessite macOS + Xcode)
npx cap run ios
```

## 🛠️ Résolution de Problèmes

### Erreur "Node.js >= 20.0.0"
- ✅ **Résolu**: Tous les workflows utilisent Node.js 20

### Build Docker échoue
1. Vérifier que `Dockerfile` et `.dockerignore` existent
2. Exécuter `./scripts/validate-build.sh` en local
3. Vérifier les logs Cloud Build

### Cloud Run ne démarre pas
1. Vérifier le port 8080 dans `Dockerfile`
2. Tester l'image localement
3. Vérifier les logs Cloud Run

## 📊 Monitoring

### Health Check
- URL: `https://votre-service-url/health`
- Réponse attendue: `healthy` (HTTP 200)

### Logs Cloud Run
```bash
# Voir les logs en temps réel
gcloud logs tail projects/afrikoin-deploy/logs/run.googleapis.com%2Frequests

# Logs d'une révision spécifique
gcloud run services describe afrikoin-vibes-connect --region=europe-west1
```

## 🎯 Prochaines Étapes

1. **Tester le déploiement** avec les nouvelles configurations
2. **Valider le health check** une fois déployé
3. **Optimiser les performances** selon les métriques Cloud Run
4. **Configurer l'auto-scaling** selon le trafic attendu

---

> **Note**: Toutes les corrections ont été appliquées pour résoudre l'erreur Node.js et optimiser le déploiement Cloud Run.