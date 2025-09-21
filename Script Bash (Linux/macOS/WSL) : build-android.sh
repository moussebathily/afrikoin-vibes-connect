#!/bin/bash
set -e

echo "🚀 Suppression du dossier android..."
rm -rf android

echo "📦 Installation Capacitor core + CLI..."
npm ci --legacy-peer-deps @capacitor/core @capacitor/cli

echo "⚙️ Initialisation Capacitor..."
npx cap init afrikoin app.lovable.afrikoin --web-dir=dist --npm-client=npm

echo "🏗️ Build du projet..."
npm ci --legacy-peer-deps run build

echo "📦 Installation Capacitor Android..."
npm ci --legacy-peer-deps @capacitor/android

echo "➕ Ajout de la plateforme Android..."
npx cap add android

echo "🎨 Installation Capacitor Assets..."
npm install --force --save-dev @capacitor/assets

echo "🖼️ Génération des icônes et splash..."
npx capacitor-assets generate resources

echo "🔄 Synchronisation Capacitor..."
npx cap sync

echo "✅ Étapes terminées !"
echo "➡️ Ouvre le dossier android dans Android Studio pour générer ton APK/AAB."
