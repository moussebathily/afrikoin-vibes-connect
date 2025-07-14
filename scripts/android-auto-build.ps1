# Script automatique PowerShell pour Android Studio - AfriKoin
# Ce script automatise la génération d'AAB pour Google Play Store

param(
    [string]$Action = "all",
    [switch]$CleanOnly,
    [switch]$WebOnly,
    [switch]$AndroidOnly,
    [switch]$Help
)

# Configuration
$ProjectName = "AfriKoin"
$PackageName = "com.afrikoin.app"
$BuildType = "release"
$OutputDir = "build/outputs"

# Fonctions utilitaires
function Write-Log {
    param([string]$Message)
    Write-Host "🟢 [$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "🟡 [$(Get-Date -Format 'HH:mm:ss')] ⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "🔴 [$(Get-Date -Format 'HH:mm:ss')] ❌ $Message" -ForegroundColor Red
    exit 1
}

# Afficher l'aide
function Show-Help {
    Write-Host @"
Usage: .\android-auto-build.ps1 [options]

Options:
  -CleanOnly      Nettoie seulement les builds précédents
  -WebOnly        Build seulement l'application web
  -AndroidOnly    Build seulement l'AAB Android
  -Help           Affiche cette aide

Exemples:
  .\android-auto-build.ps1                    # Build complet
  .\android-auto-build.ps1 -CleanOnly         # Nettoyage seulement
  .\android-auto-build.ps1 -WebOnly           # Build web seulement
  .\android-auto-build.ps1 -AndroidOnly       # Build Android seulement
"@
}

# Vérifications préalables
function Test-Requirements {
    Write-Log "🔍 Vérification des prérequis..."
    
    # Vérifier si on est dans le bon dossier
    if (-not (Test-Path "capacitor.config.ts")) {
        Write-Error "Ce script doit être exécuté depuis la racine du projet AfriKoin"
    }
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Log "✅ Node.js version: $nodeVersion"
    } catch {
        Write-Error "Node.js n'est pas installé"
    }
    
    # Vérifier Java
    try {
        $javaVersion = java -version 2>&1 | Select-Object -First 1
        Write-Log "✅ Java installé"
    } catch {
        Write-Error "Java n'est pas installé"
    }
    
    # Vérifier Android SDK
    if (-not $env:ANDROID_HOME) {
        Write-Error "ANDROID_HOME n'est pas configuré"
    }
    
    Write-Log "✅ Tous les prérequis sont satisfaits"
}

# Nettoyage des builds précédents
function Clear-PreviousBuilds {
    Write-Log "🧹 Nettoyage des builds précédents..."
    
    if (Test-Path "android") {
        Push-Location "android"
        try {
            & .\gradlew.bat clean
        } catch {
            Write-Warning "Erreur lors du nettoyage Gradle"
        }
        Pop-Location
    }
    
    if (Test-Path "dist") {
        Remove-Item -Path "dist" -Recurse -Force
    }
    
    Write-Log "✅ Nettoyage terminé"
}

# Build de l'application web
function Build-WebApp {
    Write-Log "🔨 Build de l'application web..."
    
    try {
        # Installation des dépendances
        Write-Log "📦 Installation des dépendances..."
        & npm install
        
        # Build pour production
        Write-Log "🏗️ Build pour production..."
        & npm run build
        
        Write-Log "✅ Application web buildée avec succès"
    } catch {
        Write-Error "Erreur lors du build de l'application web: $_"
    }
}

# Synchronisation Capacitor
function Sync-Capacitor {
    Write-Log "🔄 Synchronisation Capacitor..."
    
    try {
        # Ajouter Android si pas encore fait
        if (-not (Test-Path "android")) {
            Write-Log "📱 Ajout de la plateforme Android..."
            & npx cap add android
        }
        
        # Synchroniser les fichiers
        Write-Log "🔄 Synchronisation des fichiers..."
        & npx cap sync android
        
        Write-Log "✅ Synchronisation Capacitor terminée"
    } catch {
        Write-Error "Erreur lors de la synchronisation Capacitor: $_"
    }
}

# Configuration du keystore
function Setup-Keystore {
    Write-Log "🔐 Configuration du keystore..."
    
    if ($env:ANDROID_KEYSTORE_FILE -and (Test-Path $env:ANDROID_KEYSTORE_FILE)) {
        Write-Log "✅ Keystore trouvé: $env:ANDROID_KEYSTORE_FILE"
    } else {
        Write-Warning "⚠️ Keystore de production non trouvé"
        Write-Warning "Un keystore de debug sera utilisé"
        
        # Créer un keystore de debug si nécessaire
        $keystorePath = "android\app\debug.keystore"
        if (-not (Test-Path $keystorePath)) {
            try {
                & keytool -genkey -v -keystore $keystorePath `
                    -storepass android -alias androiddebugkey `
                    -keypass android -keyalg RSA -keysize 2048 `
                    -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
            } catch {
                Write-Warning "Impossible de créer le keystore de debug"
            }
        }
    }
}

# Build Android AAB
function Build-AndroidAAB {
    Write-Log "📱 Build de l'AAB Android..."
    
    try {
        Push-Location "android"
        
        # Déterminer le type de build
        if ($env:ANDROID_KEYSTORE_FILE -and (Test-Path $env:ANDROID_KEYSTORE_FILE)) {
            Write-Log "🔒 Build de production avec keystore signé"
            & .\gradlew.bat bundleRelease
            $aabPath = "app\build\outputs\bundle\release\app-release.aab"
        } else {
            Write-Warning "🔓 Build de debug (non signé)"
            & .\gradlew.bat bundleDebug
            $aabPath = "app\build\outputs\bundle\debug\app-debug.aab"
        }
        
        Pop-Location
        
        # Vérifier que l'AAB a été créé
        if (Test-Path "android\$aabPath") {
            Write-Log "✅ AAB créé avec succès: android\$aabPath"
            return "android\$aabPath"
        } else {
            Write-Error "❌ Échec de la création de l'AAB"
        }
    } catch {
        Pop-Location
        Write-Error "Erreur lors du build Android: $_"
    }
}

# Copie de l'AAB vers un dossier de sortie
function Copy-AABOutput {
    param([string]$SourcePath)
    
    Write-Log "📋 Copie de l'AAB vers le dossier de sortie..."
    
    # Créer le dossier de sortie
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Déterminer le nom du fichier de destination
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    if ($SourcePath -like "*release*") {
        $destFile = "$OutputDir\afrikoin-release-$timestamp.aab"
    } else {
        $destFile = "$OutputDir\afrikoin-debug-$timestamp.aab"
    }
    
    # Copier le fichier
    Copy-Item -Path $SourcePath -Destination $destFile
    
    Write-Log "✅ AAB copié vers: $destFile"
    Write-Host ""
    Write-Host "📁 Fichier AAB disponible à: $(Resolve-Path $destFile)" -ForegroundColor Cyan
    
    return $destFile
}

# Génération d'un rapport de build
function New-BuildReport {
    param([string]$AABFile)
    
    Write-Log "📊 Génération du rapport de build..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $reportFile = "$OutputDir\build-report-$timestamp.txt"
    
    $report = @"
================================
   RAPPORT DE BUILD AFRIKOIN
================================

Date: $(Get-Date)
Projet: $ProjectName
Package: $PackageName

FICHIERS GÉNÉRÉS:
$AABFile

INFORMATIONS SYSTÈME:
- PowerShell: $($PSVersionTable.PSVersion)
- Node.js: $(node --version)
- Java: $(java -version 2>&1 | Select-Object -First 1)
- Android SDK: $env:ANDROID_HOME

STATUT: ✅ BUILD RÉUSSI

Pour déployer sur Google Play Store:
1. Connectez-vous à https://play.google.com/console
2. Sélectionnez votre application AfriKoin
3. Allez dans "Production" > "Créer une nouvelle version"
4. Uploadez le fichier AAB généré
5. Remplissez les notes de version et publiez

================================
"@

    $report | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Log "✅ Rapport généré: $reportFile"
}

# Fonction principale
function Start-AutoBuild {
    Write-Log "🎯 Début du processus de build automatique pour $ProjectName"
    
    Test-Requirements
    Clear-PreviousBuilds
    Build-WebApp
    Sync-Capacitor
    Setup-Keystore
    $aabPath = Build-AndroidAAB
    $outputFile = Copy-AABOutput -SourcePath $aabPath
    New-BuildReport -AABFile $outputFile
    
    Write-Host ""
    Write-Host "🎉 Build automatique terminé avec succès!" -ForegroundColor Green
    Write-Host "📱 Votre fichier AAB est prêt pour le Google Play Store" -ForegroundColor Green
    Write-Host ""
}

# Traitement des arguments
if ($Help) {
    Show-Help
    exit 0
}

try {
    if ($CleanOnly) {
        Clear-PreviousBuilds
    } elseif ($WebOnly) {
        Test-Requirements
        Build-WebApp
    } elseif ($AndroidOnly) {
        Test-Requirements
        Sync-Capacitor
        Setup-Keystore
        $aabPath = Build-AndroidAAB
        $outputFile = Copy-AABOutput -SourcePath $aabPath
        New-BuildReport -AABFile $outputFile
    } else {
        Start-AutoBuild
    }
} catch {
    Write-Error "Erreur fatale: $_"
}