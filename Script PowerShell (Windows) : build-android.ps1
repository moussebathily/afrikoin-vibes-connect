# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "🚀 Suppression du dossier android..."
if (Test-Path "android") { Remove-Item -Recurse -Force "android" }

Write-Host "📦 Installation Capacitor core + CLI..."
npm ci --legacy-peer-deps @capacitor/core @capacitor/cli

Write-Host "⚙️ Initialisation Capacitor..."
npx cap init --web-dir=dist --npm-client=npm --name="afrikoin" --id="app.lovable.afrikoin"

Write-Host "🏗️ Build du projet..."
npm ci --legacy-peer-deps run build

Write-Host "📦 Installation Capacitor Android..."
npm ci --legacy-peer-deps @capacitor/android

Write-Host "➕ Ajout de la plateforme Android..."
npx cap add android

Write-Host "🎨 Installation Capacitor Assets..."
npm install --force --save-dev @capacitor/assets

Write-Host "🖼️ Génération des icônes et splash..."
npx capacitor-assets generate resources

Write-Host "🔄 Synchronisation Capacitor..."
npx cap sync

Write-Host "✅ Étapes terminées !"
Write-Host "➡️ Ouvre le dossier android dans Android Studio pour générer ton APK/AAB."
