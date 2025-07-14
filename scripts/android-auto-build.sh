#!/bin/bash

# Script automatique pour Android Studio - AfriKoin
# Ce script automatise la génération d'AAB pour Google Play Store

set -e

echo "🚀 Démarrage du build automatique AfriKoin..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="AfriKoin"
PACKAGE_NAME="com.afrikoin.app"
BUILD_TYPE="release"
OUTPUT_DIR="build/outputs"

# Fonction de log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
    exit 1
}

# Vérifications préalables
check_requirements() {
    log "🔍 Vérification des prérequis..."
    
    # Vérifier si on est dans le bon dossier
    if [[ ! -f "capacitor.config.ts" ]]; then
        error "Ce script doit être exécuté depuis la racine du projet AfriKoin"
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier Java
    if ! command -v java &> /dev/null; then
        error "Java n'est pas installé"
    fi
    
    # Vérifier Android SDK
    if [[ -z "$ANDROID_HOME" ]]; then
        error "ANDROID_HOME n'est pas configuré"
    fi
    
    log "✅ Tous les prérequis sont satisfaits"
}

# Nettoyage des builds précédents
clean_previous_builds() {
    log "🧹 Nettoyage des builds précédents..."
    
    if [[ -d "android" ]]; then
        cd android
        ./gradlew clean
        cd ..
    fi
    
    if [[ -d "dist" ]]; then
        rm -rf dist
    fi
    
    log "✅ Nettoyage terminé"
}

# Build de l'application web
build_web_app() {
    log "🔨 Build de l'application web..."
    
    # Installation des dépendances
    npm install
    
    # Build pour production
    npm run build
    
    log "✅ Application web buildée avec succès"
}

# Synchronisation Capacitor
sync_capacitor() {
    log "🔄 Synchronisation Capacitor..."
    
    # Ajouter Android si pas encore fait
    if [[ ! -d "android" ]]; then
        npx cap add android
    fi
    
    # Synchroniser les fichiers
    npx cap sync android
    
    log "✅ Synchronisation Capacitor terminée"
}

# Configuration du keystore
setup_keystore() {
    log "🔐 Configuration du keystore..."
    
    # Vérifier si le keystore existe
    if [[ -n "$ANDROID_KEYSTORE_FILE" && -f "$ANDROID_KEYSTORE_FILE" ]]; then
        log "✅ Keystore trouvé: $ANDROID_KEYSTORE_FILE"
    else
        warn "⚠️ Keystore de production non trouvé"
        warn "Un keystore de debug sera utilisé"
        
        # Créer un keystore de debug si nécessaire
        KEYSTORE_PATH="android/app/debug.keystore"
        if [[ ! -f "$KEYSTORE_PATH" ]]; then
            keytool -genkey -v -keystore "$KEYSTORE_PATH" \
                -storepass android -alias androiddebugkey \
                -keypass android -keyalg RSA -keysize 2048 \
                -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
        fi
    fi
}

# Build Android AAB
build_android_aab() {
    log "📱 Build de l'AAB Android..."
    
    cd android
    
    # Déterminer le type de build
    if [[ -n "$ANDROID_KEYSTORE_FILE" && -f "$ANDROID_KEYSTORE_FILE" ]]; then
        log "🔒 Build de production avec keystore signé"
        ./gradlew bundleRelease
        AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
    else
        warn "🔓 Build de debug (non signé)"
        ./gradlew bundleDebug
        AAB_PATH="app/build/outputs/bundle/debug/app-debug.aab"
    fi
    
    cd ..
    
    # Vérifier que l'AAB a été créé
    if [[ -f "android/$AAB_PATH" ]]; then
        log "✅ AAB créé avec succès: android/$AAB_PATH"
    else
        error "❌ Échec de la création de l'AAB"
    fi
}

# Copie de l'AAB vers un dossier de sortie
copy_aab_output() {
    log "📋 Copie de l'AAB vers le dossier de sortie..."
    
    # Créer le dossier de sortie
    mkdir -p "$OUTPUT_DIR"
    
    # Déterminer le fichier source
    if [[ -f "android/app/build/outputs/bundle/release/app-release.aab" ]]; then
        SOURCE="android/app/build/outputs/bundle/release/app-release.aab"
        DEST="$OUTPUT_DIR/afrikoin-release-$(date +%Y%m%d-%H%M%S).aab"
    else
        SOURCE="android/app/build/outputs/bundle/debug/app-debug.aab"
        DEST="$OUTPUT_DIR/afrikoin-debug-$(date +%Y%m%d-%H%M%S).aab"
    fi
    
    # Copier le fichier
    cp "$SOURCE" "$DEST"
    
    log "✅ AAB copié vers: $DEST"
    echo ""
    echo "📁 Fichier AAB disponible à: $(pwd)/$DEST"
}

# Génération d'un rapport de build
generate_build_report() {
    log "📊 Génération du rapport de build..."
    
    REPORT_FILE="$OUTPUT_DIR/build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
================================
   RAPPORT DE BUILD AFRIKOIN
================================

Date: $(date)
Projet: $PROJECT_NAME
Package: $PACKAGE_NAME

FICHIERS GÉNÉRÉS:
$(ls -la $OUTPUT_DIR/*.aab 2>/dev/null || echo "Aucun fichier AAB trouvé")

INFORMATIONS SYSTÈME:
- Node.js: $(node --version)
- Java: $(java -version 2>&1 | head -1)
- Android SDK: $ANDROID_HOME

STATUT: ✅ BUILD RÉUSSI

Pour déployer sur Google Play Store:
1. Connectez-vous à https://play.google.com/console
2. Sélectionnez votre application AfriKoin
3. Allez dans "Production" > "Créer une nouvelle version"
4. Uploadez le fichier AAB généré
5. Remplissez les notes de version et publiez

================================
EOF

    log "✅ Rapport généré: $REPORT_FILE"
}

# Fonction principale
main() {
    log "🎯 Début du processus de build automatique pour $PROJECT_NAME"
    
    check_requirements
    clean_previous_builds
    build_web_app
    sync_capacitor
    setup_keystore
    build_android_aab
    copy_aab_output
    generate_build_report
    
    echo ""
    echo "🎉 Build automatique terminé avec succès!"
    echo "📱 Votre fichier AAB est prêt pour le Google Play Store"
    echo ""
}

# Gestion des arguments
case "${1:-}" in
    --clean-only)
        clean_previous_builds
        ;;
    --web-only)
        build_web_app
        ;;
    --android-only)
        sync_capacitor
        setup_keystore
        build_android_aab
        copy_aab_output
        ;;
    --help|-h)
        echo "Usage: $0 [option]"
        echo "Options:"
        echo "  --clean-only    Nettoie seulement les builds précédents"
        echo "  --web-only      Build seulement l'application web"
        echo "  --android-only  Build seulement l'AAB Android"
        echo "  --help          Affiche cette aide"
        ;;
    *)
        main
        ;;
esac