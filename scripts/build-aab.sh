#!/bin/bash

# Script pour générer l'AAB AfriKoin signé
# Usage: ./scripts/build-aab.sh

set -e

PROJECT_DIR=$(dirname $(dirname $(realpath $0)))
KEYSTORE_PATH="android/app/afrikoin-release-key.jks"

echo "🚀 Génération de l'AAB AfriKoin signé"
echo "📁 Répertoire du projet: $PROJECT_DIR"

cd "$PROJECT_DIR"

# 1. Vérifier que le keystore existe
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Keystore non trouvé: $KEYSTORE_PATH"
    echo "💡 Générez le keystore avec: ./scripts/generate-keystore.sh"
    exit 1
fi

echo "✅ Keystore trouvé: $KEYSTORE_PATH"

# 2. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 3. Build de l'application web
echo "🏗️ Build de l'application web..."
npm run build

# 4. Synchroniser avec Capacitor
echo "🔄 Synchronisation Capacitor..."
npx cap sync android

# 5. Nettoyer les builds précédents
echo "🧹 Nettoyage des builds précédents..."
cd android
./gradlew clean

# 6. Générer l'AAB signé
echo "📱 Génération de l'AAB signé..."
./gradlew bundleRelease

# 7. Vérifier que l'AAB a été généré
AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    echo "✅ AAB généré avec succès!"
    echo "📍 Fichier: android/$AAB_PATH"
    echo "📊 Taille du fichier: $(du -h "$AAB_PATH" | cut -f1)"
    
    # Vérifier la signature
    echo "🔍 Vérification de la signature..."
    jarsigner -verify -verbose -certs "$AAB_PATH"
    
    echo ""
    echo "🎉 AAB prêt pour upload sur Google Play Console!"
    echo "📁 Chemin complet: $PROJECT_DIR/android/$AAB_PATH"
else
    echo "❌ Erreur: AAB non généré"
    exit 1
fi

cd ..