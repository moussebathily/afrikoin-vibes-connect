
#!/bin/bash

# Script de vérification des prérequis pour le build Android

echo "🔍 Vérification des prérequis pour le build Android..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier une commande
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "✅ ${GREEN}$1 est installé${NC}"
        if [[ $1 == "java" ]]; then
            java -version 2>&1 | head -n 1
        elif [[ $1 == "node" ]]; then
            echo "   Version: $(node --version)"
        fi
    else
        echo -e "❌ ${RED}$1 n'est pas installé${NC}"
        return 1
    fi
}

# Fonction pour vérifier les variables d'environnement
check_env_var() {
    if [[ -n "${!1}" ]]; then
        echo -e "✅ ${GREEN}$1 est définie${NC}"
    else
        echo -e "⚠️ ${YELLOW}$1 n'est pas définie (optionnel pour debug)${NC}"
    fi
}

echo ""
echo "📦 Vérification des outils requis:"
check_command "node"
check_command "npm"
check_command "npx"
check_command "java"

echo ""
echo "🔧 Vérification des variables d'environnement Android:"
check_env_var "ANDROID_HOME"
check_env_var "ANDROID_KEYSTORE_FILE"
check_env_var "ANDROID_KEYSTORE_PASSWORD"
check_env_var "ANDROID_KEY_ALIAS"
check_env_var "ANDROID_KEY_PASSWORD"

echo ""
echo "📱 Vérification du projet Capacitor:"
if [[ -f "capacitor.config.ts" ]]; then
    echo -e "✅ ${GREEN}capacitor.config.ts trouvé${NC}"
else
    echo -e "❌ ${RED}capacitor.config.ts manquant${NC}"
fi

if [[ -d "android" ]]; then
    echo -e "✅ ${GREEN}Dossier android/ trouvé${NC}"
    if [[ -f "android/gradlew" ]]; then
        echo -e "✅ ${GREEN}Gradle wrapper trouvé${NC}"
    else
        echo -e "❌ ${RED}Gradle wrapper manquant${NC}"
    fi
else
    echo -e "❌ ${RED}Dossier android/ manquant - Exécutez 'npx cap add android'${NC}"
fi

echo ""
echo "🏗️ Vérification du build web:"
if [[ -f "package.json" ]]; then
    echo -e "✅ ${GREEN}package.json trouvé${NC}"
    if grep -q '"build"' package.json; then
        echo -e "✅ ${GREEN}Script de build défini${NC}"
    else
        echo -e "❌ ${RED}Script de build manquant dans package.json${NC}"
    fi
else
    echo -e "❌ ${RED}package.json manquant${NC}"
fi

echo ""
echo "📋 Résumé:"
echo "- Pour build debug: tous les outils de base suffisent"
echo "- Pour build release: définissez les variables d'environnement du keystore"
echo "- Pour ajouter Android: npx cap add android"
echo "- Pour synchroniser: npx cap sync android"

echo ""
echo "🚀 Commandes disponibles:"
echo "- ./scripts/build-android.sh debug"
echo "- ./scripts/build-android.sh release"
echo "- npx cap run android (pour tester sur émulateur)"
