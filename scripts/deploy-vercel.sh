#!/bin/bash

# Script de déploiement local Vercel
# Usage: ./scripts/deploy-vercel.sh [preview|production]

set -e

DEPLOY_TYPE=${1:-preview}

echo "🚀 Déploiement Vercel - Mode: $DEPLOY_TYPE"
echo "============================================"

# Vérifier les prérequis
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé"
    echo "Installation: npm i -g vercel"
    exit 1
fi

# Vérification du login Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Connexion à Vercel..."
    vercel login
fi

echo "📦 Installation des dépendances..."
npm ci --legacy-peer-deps

echo "🔍 Vérification TypeScript..."
npx tsc --noEmit

echo "🧹 Vérification du linting..."
npm run lint

echo "🔨 Build de l'application..."
npm run build

echo "📁 Vérification du build..."
if [[ ! -f "dist/index.html" ]]; then
    echo "❌ Build échoué - index.html manquant"
    exit 1
fi

echo "🌐 Déploiement vers Vercel..."
if [[ "$DEPLOY_TYPE" == "production" ]]; then
    echo "🚀 Déploiement en PRODUCTION..."
    vercel deploy --prod
    
    echo "📍 Soumission du sitemap..."
    sleep 10
    curl -X POST "https://www.google.com/ping?sitemap=https://www.afrikoin.online/sitemap.xml" || echo "⚠️ Erreur sitemap"
    
    echo "🧪 Test du déploiement..."
    sleep 5
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://www.afrikoin.online)
    if [[ "$HTTP_CODE" -eq 200 ]]; then
        echo "✅ Site en ligne (HTTP $HTTP_CODE)"
    else
        echo "❌ Problème déploiement (HTTP $HTTP_CODE)"
        exit 1
    fi
    
    echo "🎉 Déploiement production réussi !"
    echo "🌐 https://www.afrikoin.online"
else
    echo "👀 Déploiement en PREVIEW..."
    PREVIEW_URL=$(vercel deploy)
    echo "🎉 Déploiement preview réussi !"
    echo "🌐 $PREVIEW_URL"
fi

echo ""
echo "✅ Déploiement terminé avec succès !"