
# Script de build automatisé pour Android sur Windows
# Usage: .\scripts\build-android.ps1 [debug|release]

param(
    [string]$BuildType = "release"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Démarrage du build Android ($BuildType)" -ForegroundColor Green

# Obtenir le répertoire du projet
$ProjectDir = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectDir

Write-Host "📁 Répertoire du projet: $ProjectDir" -ForegroundColor Cyan

# 1. Vérifier les prérequis
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npx n'est pas installé" -ForegroundColor Red
    exit 1
}

# 2. Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

# 3. Build de l'application web
Write-Host "🏗️ Build de l'application web..." -ForegroundColor Yellow
npm run build

# 4. Synchroniser avec Capacitor
Write-Host "🔄 Synchronisation Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 5. Build Android
Write-Host "📱 Build Android ($BuildType)..." -ForegroundColor Yellow
Set-Location android

if ($BuildType -eq "debug") {
    .\gradlew.bat assembleDebug
    Write-Host "✅ APK Debug généré: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Green
} else {
    .\gradlew.bat bundleRelease
    Write-Host "✅ AAB Release généré: android/app/build/outputs/bundle/release/app-release.aab" -ForegroundColor Green
}

Set-Location ..

Write-Host "🎉 Build terminé avec succès!" -ForegroundColor Green
