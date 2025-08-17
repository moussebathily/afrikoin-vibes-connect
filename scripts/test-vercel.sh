#!/bin/bash

# Script de test Vercel local
# Usage: ./scripts/test-vercel.sh

set -e

echo "🧪 Tests Vercel Local"
echo "==================="

# Test de la configuration Vercel
echo "📋 Validation vercel.json..."
if command -v jq &> /dev/null; then
    jq . vercel.json > /dev/null && echo "✅ vercel.json valide"
else
    echo "⚠️ jq non installé, validation JSON ignorée"
fi

# Test du build local
echo "🔨 Build local..."
npm run build

# Test des fichiers requis
echo "🔍 Vérification des fichiers..."
test -f dist/index.html && echo "✅ index.html présent"
test -d dist/assets && echo "✅ dossier assets présent"
test -f public/sitemap.xml && echo "✅ sitemap.xml présent"
test -f public/robots.txt && echo "✅ robots.txt présent"
test -f public/manifest.json && echo "✅ manifest.json présent"

# Test Vercel CLI si disponible
if command -v vercel &> /dev/null; then
    echo "🚀 Test avec Vercel CLI..."
    vercel build --local
    echo "✅ Build Vercel réussi"
else
    echo "⚠️ Vercel CLI non installé"
    echo "Installation: npm i -g vercel"
fi

echo ""
echo "✅ Tests terminés avec succès !"
echo "🚀 Prêt pour le déploiement Vercel"