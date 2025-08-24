#!/bin/bash

# Script de validation pour production AfriKoin
# Usage: ./scripts/validate-production.sh

set -e

echo "🚀 Validation Production AfriKoin"
echo "================================="

# Vérification Node.js
NODE_VERSION=$(node --version)
echo "Node.js: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v20\. && ! "$NODE_VERSION" =~ ^v18\. ]]; then
    echo "⚠️ Node.js 18.x ou 20.x recommandé"
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --legacy-peer-deps

# Vérification TypeScript
echo "🔍 Vérification TypeScript..."
npm run build:check

# Linting
echo "🧹 Linting..."
npm run lint

# Build production
echo "🔨 Build production..."
npm run build

# Vérification du build
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

echo ""
echo "🎉 Validation terminée avec succès !"
echo "✅ Prêt pour le déploiement"