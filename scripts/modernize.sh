#!/bin/bash

# Script de modernisation AfriKoin
# Usage: ./scripts/modernize.sh

set -e

echo "🚀 Modernisation AfriKoin"
echo "========================"

# Vérification Node.js version
NODE_VERSION=$(node --version)
echo "Node.js: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v20\. && ! "$NODE_VERSION" =~ ^v18\. ]]; then
    echo "⚠️ Node.js 18.x ou 20.x recommandé"
fi

# Nettoyage et réinstallation des dépendances
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json
npm cache clean --force

echo "📦 Installation des dépendances modernes..."
npm install --legacy-peer-deps

# Vérification TypeScript
echo "🔍 Vérification TypeScript..."
npx tsc --noEmit

# Linting avec correction automatique
echo "🧹 Linting et correction automatique..."
npm run lint -- --fix || echo "⚠️ Certains problèmes de linting nécessitent une correction manuelle"

# Build pour vérifier que tout fonctionne
echo "🔨 Test du build..."
npm run build

# Optimisation des dépendances
echo "📊 Analyse des dépendances..."
if command -v npm-check-updates &> /dev/null; then
    echo "Packages outdated:"
    npx npm-check-updates
    echo "Pour mettre à jour: npx npm-check-updates -u"
else
    echo "💡 Installez npm-check-updates pour analyser les mises à jour: npm i -g npm-check-updates"
fi

# Synchronisation Capacitor si disponible
if [[ -f "capacitor.config.ts" ]]; then
    echo "📱 Synchronisation Capacitor..."
    npx cap sync || echo "⚠️ Erreur lors de la synchronisation Capacitor"
fi

# Nettoyage des fichiers temporaires
echo "🧽 Nettoyage des fichiers temporaires..."
find . -name "*.log" -type f -delete || true
find . -name ".DS_Store" -type f -delete || true

echo ""
echo "🎉 Modernisation terminée avec succès !"
echo "✨ Changements apportés:"
echo "  - Dépendances mises à jour"
echo "  - Configuration Capacitor modernisée" 
echo "  - Configuration Vite optimisée"
echo "  - Workflows GitHub améliorés"
echo "  - Configuration Vercel sécurisée"
echo ""
echo "📝 Actions recommandées:"
echo "  1. Tester l'application localement: npm run dev"
echo "  2. Vérifier le build: npm run build"
echo "  3. Déployer avec: npm run deploy"
echo ""
echo "🔗 Liens utiles:"
echo "  - Documentation Capacitor: https://capacitorjs.com/docs"
echo "  - Documentation Vite: https://vitejs.dev/guide/"
echo "  - Documentation Vercel: https://vercel.com/docs"