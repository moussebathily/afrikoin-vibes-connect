#!/bin/bash

# Script de validation du build pour AfriKoin
# Usage: ./scripts/validate-build.sh

set -e

echo "🚀 Validation du build AfriKoin"
echo "================================"

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

# Node.js version
NODE_VERSION=$(node --version)
echo "Node.js: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    echo "⚠️ Node.js 20.x recommandé (version actuelle: $NODE_VERSION)"
fi

# npm version
NPM_VERSION=$(npm --version)
echo "npm: $NPM_VERSION"

# Vérification des fichiers critiques
echo ""
echo "📁 Vérification des fichiers..."
files=("package.json" "vite.config.ts" "tsconfig.json" "tailwind.config.ts" "Dockerfile" ".dockerignore" "capacitor.config.ts")
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."
npm ci

# Vérification TypeScript
echo ""
echo "🔍 Vérification TypeScript..."
npx tsc --noEmit

# Linting
echo ""
echo "🧹 Linting..."
npm run lint

# Build de l'application
echo ""
echo "🔨 Build de l'application..."
npm run build

# Vérification du build
echo ""
echo "✅ Vérification du build..."
if [[ -f "dist/index.html" ]]; then
    echo "✅ dist/index.html généré"
else
    echo "❌ dist/index.html manquant"
    exit 1
fi

if [[ -d "dist/assets" ]]; then
    echo "✅ Dossier assets généré"
else
    echo "❌ Dossier assets manquant"
    exit 1
fi

# Taille du build
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "📏 Taille du build: $BUILD_SIZE"

# Test Docker (optionnel)
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Test Docker (optionnel)..."
    
    # Build de l'image
    echo "Construction de l'image Docker..."
    docker build -t afrikoin-test:latest . --quiet
    
    # Test du conteneur
    echo "Test du conteneur..."
    docker run -d --name afrikoin-test -p 8080:8080 afrikoin-test:latest
    
    # Attendre le démarrage
    sleep 5
    
    # Vérifier si le conteneur fonctionne
    if docker ps | grep afrikoin-test > /dev/null; then
        echo "✅ Conteneur Docker fonctionnel"
    else
        echo "❌ Problème avec le conteneur Docker"
        docker logs afrikoin-test
    fi
    
    # Nettoyer
    docker stop afrikoin-test > /dev/null 2>&1 || true
    docker rm afrikoin-test > /dev/null 2>&1 || true
    docker rmi afrikoin-test:latest > /dev/null 2>&1 || true
    
else
    echo "ℹ️ Docker non détecté, test Docker ignoré"
fi

# Capacitor (si disponible)
if [[ -d "android" ]] || [[ -d "ios" ]]; then
    echo ""
    echo "📱 Synchronisation Capacitor..."
    npx cap sync
    echo "✅ Capacitor synchronisé"
fi

echo ""
echo "🎉 Validation terminée avec succès !"
echo "✅ Prêt pour le déploiement"