# 🚀 Guide de Déploiement Vercel

## Variables d'Environnement Requises

Configurez ces variables dans votre projet Vercel :

### Backend
- `MONGO_URL` : URL de votre base de données MongoDB (ex: MongoDB Atlas)
- `DB_NAME` : Nom de votre base de données
- `CORS_ORIGINS` : Origines autorisées pour CORS (ex: https://votre-domaine.vercel.app)

### Frontend
- `REACT_APP_BACKEND_URL` : URL de votre backend déployé (ex: https://votre-projet.vercel.app)

## Configuration MongoDB pour Production

1. **MongoDB Atlas** (Recommandé):
   - Créez un cluster gratuit sur https://cloud.mongodb.com
   - Obtenez l'URL de connexion
   - Configurez l'accès réseau pour permettre les connexions depuis Vercel

2. **Variables d'environnement Vercel**:
   ```bash
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   DB_NAME=votre_nom_de_base
   CORS_ORIGINS=https://votre-domaine.vercel.app
   REACT_APP_BACKEND_URL=https://votre-projet.vercel.app
   ```

## Commandes de Déploiement

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

## Structure des Fichiers Vercel

- `vercel.json` : Configuration de déploiement
- `api/index.py` : Point d'entrée pour les API serverless
- `.vercelignore` : Fichiers à ignorer lors du déploiement

## Test Local avec la Configuration Vercel

```bash
# Tester localement avec Vercel
vercel dev
```

## Points Importants

1. **Routes API** : Toutes les routes backend sont prefixées par `/api/`
2. **Fonctions Serverless** : Le backend FastAPI est adapté pour les fonctions serverless
3. **Variables d'Environnement** : Toutes les configurations sont externalisées
4. **MongoDB** : Utilisez MongoDB Atlas ou une autre base de données cloud