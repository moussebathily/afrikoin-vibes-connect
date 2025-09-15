#!/bin/bash
# Rendre le script exécutable: chmod +x scripts/deploy-local.sh

# Script de déploiement local AfriKoin
# Usage: ./scripts/deploy-local.sh [web|android|all]

set -e

DEPLOY_TARGET=${1:-all}

echo "🚀 Déploiement Local AfriKoin - Target: $DEPLOY_TARGET"
echo "================================================"

# Vérification des prérequis
if ! command -v npm &> /dev/null; then
    echo "❌ npm non installé"
    exit 1
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --legacy-peer-deps

if [[ "$DEPLOY_TARGET" == "web" || "$DEPLOY_TARGET" == "all" ]]; then
    echo ""
    echo "🌐 === DÉPLOIEMENT WEB ==="
    
    # Build web
    echo "🔨 Build de l'application web..."
    npm run build
    
    # Vérification du build
    if [[ -f "dist/index.html" ]]; then
        echo "✅ Build web réussi"
        BUILD_SIZE=$(du -sh dist | cut -f1)
        echo "📏 Taille: $BUILD_SIZE"
    else
        echo "❌ Build web échoué"
        exit 1
    fi
    
    # Déploiement Vercel (si disponible)
    if command -v vercel &> /dev/null; then
        echo "🚀 Déploiement Vercel..."
        vercel deploy --prod
        echo "✅ Déployé sur Vercel"
    else
        echo "ℹ️ Vercel CLI non installé - build local prêt dans /dist"
    fi
fi

if [[ "$DEPLOY_TARGET" == "android" || "$DEPLOY_TARGET" == "all" ]]; then
    echo ""
    echo "📱 === BUILD ANDROID ==="
    
    # Vérification Java
    if ! command -v java &> /dev/null; then
        echo "❌ Java non installé - requis pour Android"
        exit 1
    fi
    
    # Build web d'abord
    if [[ ! -f "dist/index.html" ]]; then
        echo "🔨 Build web pour Android..."
        npm run build
    fi
    
    # Capacitor sync
    echo "🔄 Synchronisation Capacitor..."
    npx cap sync android
    
    # Build Android
    echo "🔨 Build Android AAB..."
    cd android
    
    if [[ -f "app/release.keystore" ]]; then
        echo "🔐 Build signé (release)"
        ./gradlew bundleRelease --stacktrace
        AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
    else
        echo "🔨 Build debug (non signé)"
        ./gradlew bundleDebug --stacktrace
        AAB_PATH="app/build/outputs/bundle/debug/app-debug.aab"
    fi
    
    cd ..
    
    if [[ -f "android/$AAB_PATH" ]]; then
        echo "✅ Build Android réussi"
        echo "📱 AAB: android/$AAB_PATH"
        
        # Afficher la taille
        AAB_SIZE=$(du -sh "android/$AAB_PATH" | cut -f1)
        echo "📏 Taille AAB: $AAB_SIZE"
    else
        echo "❌ Build Android échoué"
        exit 1
    fi
fi

echo ""
echo "🎉 Déploiement local terminé avec succès !"
echo "✅ Prêt pour la production"