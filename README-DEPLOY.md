# Guide de Déploiement AfriKoin

## ✅ Corrections Appliquées

### 1. Serveur Cloud Run corrigé
- ✅ Remplacement de `server.js` par `server.cjs` pour éviter le conflit ESM/CommonJS (`type: module`)
- ✅ Endpoint `/health` ajouté pour les probes Cloud Run
- ✅ Dockerfile mis à jour pour lancer `server.cjs`

### 2. Docker Runtime sécurisé
- ✅ Installation des dépendances runtime uniquement (`npm i --omit=dev express`)
- ✅ Build multi-stage conservé

### 3. Cloud Build stabilisé
- ✅ Suppression des étapes Docker inter-steps instables
- ✅ Pipeline simple et robuste: `build -> push -> deploy -> verify`
- ✅ Vérification post-déploiement sur `/health`

### 4. Déploiement automatique GitHub → Google Cloud
- ✅ Nouveau workflow GitHub Actions: `.github/workflows/deploy-gcp-cloud-run.yml`
- ✅ Authentification Workload Identity Federation (sans clé JSON)

## 🚀 Déploiement Automatique (Google Cloud)

### Déclencheur
- Push sur `main` ➜ GitHub Actions lance Cloud Build ➜ déploiement Cloud Run.

### Secrets GitHub requis
- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

## 🔧 Vérification locale rapide

```bash
# Build local
npm run build

# Image Docker
docker build -t afrikoin-local .

# Run local
docker run -p 8080:8080 afrikoin-local

# Health check
curl http://localhost:8080/health
```

## 📊 Monitoring

```bash
# URL du service
gcloud run services describe afrikoin-vibes-connect --region=europe-west1 --format='value(status.url)'

# Logs Cloud Run
gcloud logs tail projects/afrikoin-deploy/logs/run.googleapis.com%2Frequests
```
