#!/bin/bash

# Script to generate AfriKoin release keystore
# Usage: ./scripts/generate-keystore.sh

set -e

KEYSTORE_DIR="android/app"
KEYSTORE_FILE="afrikoin-release-key.jks"
KEYSTORE_PATH="$KEYSTORE_DIR/$KEYSTORE_FILE"

echo "🔐 Génération du keystore AfriKoin..."

# Create directory if it doesn't exist
mkdir -p "$KEYSTORE_DIR"

# Check if keystore already exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  Le keystore existe déjà: $KEYSTORE_PATH"
    read -p "Voulez-vous le remplacer? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Génération annulée"
        exit 1
    fi
    rm "$KEYSTORE_PATH"
fi

# Generate keystore
echo "🔑 Génération du nouveau keystore..."
keytool -genkeypair \
    -alias afrikoin \
    -keypass afrikoin123 \
    -keystore "$KEYSTORE_PATH" \
    -storepass afrikoin123 \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=AfriKoin, OU=AfriKoin, O=AfriKoin, L=Dakar, ST=Dakar, C=SN"

echo "✅ Keystore généré avec succès: $KEYSTORE_PATH"
echo "📋 Informations de signature:"
echo "   Fichier: $KEYSTORE_FILE"
echo "   Alias: afrikoin"
echo "   Mot de passe store: afrikoin123"
echo "   Mot de passe key: afrikoin123"
echo ""
echo "🚀 Vous pouvez maintenant générer votre AAB avec:"
echo "   cd android && ./gradlew bundleRelease"