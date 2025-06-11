
#!/bin/bash

# Script de build automatisé pour Android
# Usage: ./scripts/build-android.sh [debug|release]

set -e

BUILD_TYPE=${1:-release}
PROJECT_DIR=$(dirname $(dirname $(realpath $0)))

echo "🚀 Démarrage du build Android ($BUILD_TYPE)"
echo "📁 Répertoire du projet: $PROJECT_DIR"

cd "$PROJECT_DIR"

# 1. Vérifier les prérequis
echo "🔍 Vérification des prérequis..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx n'est pas installé"
    exit 1
fi

# 2. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 3. Build de l'application web
echo "🏗️ Build de l'application web..."
npm run build

# 4. Synchroniser avec Capacitor
echo "🔄 Synchronisation Capacitor..."
npx cap sync android

# 5. Build Android
echo "📱 Build Android ($BUILD_TYPE)..."
cd android

if [ "$BUILD_TYPE" = "debug" ]; then
    ./gradlew assembleDebug
    echo "✅ APK Debug généré: android/app/build/outputs/apk/debug/app-debug.apk"
else
    ./gradlew bundleRelease
    echo "✅ AAB Release généré: android/app/build/outputs/bundle/release/app-release.aab"
fi

cd ..

echo "🎉 Build terminé avec succès!"
