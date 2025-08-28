#!/bin/bash

# Script de configuration développement AfriKoin
# Usage: ./scripts/dev-setup.sh

set -e

echo "⚡ Configuration développement AfriKoin"
echo "======================================"

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    echo "📥 Installez Node.js depuis: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm non installé"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm: $NPM_VERSION"

# Git
if ! command -v git &> /dev/null; then
    echo "❌ Git non installé"
    echo "📥 Installez Git depuis: https://git-scm.com/"
    exit 1
fi

echo "✅ Git installé"

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."
npm ci --legacy-peer-deps

# Configuration des hooks Git
echo ""
echo "🪝 Configuration des hooks Git..."
if [[ ! -f ".git/hooks/pre-commit" ]]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Hook pre-commit pour AfriKoin

echo "🔍 Vérification pre-commit..."

# Linting
npm run lint || {
    echo "❌ Erreurs de linting détectées"
    echo "💡 Corrigez avec: npm run lint -- --fix"
    exit 1
}

# Type checking
npx tsc --noEmit || {
    echo "❌ Erreurs TypeScript détectées"
    exit 1
}

echo "✅ Pre-commit validé"
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Hook pre-commit installé"
fi

# Configuration des outils de développement
echo ""
echo "🛠️ Configuration des outils..."

# VS Code settings
if [[ ! -d ".vscode" ]]; then
    mkdir -p .vscode
    
    cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "emmet.includeLanguages": {
    "typescript": "html",
    "javascript": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "javascript": "html"
  }
}
EOF

    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
EOF
    echo "✅ Configuration VS Code créée"
fi

# Test de l'installation
echo ""
echo "🧪 Test de l'installation..."
npm run build > /dev/null || {
    echo "❌ Erreur lors du build"
    exit 1
}
echo "✅ Build réussi"

echo ""
echo "🎉 Configuration développement terminée !"
echo ""
echo "🚀 Commandes disponibles:"
echo "  npm run dev          - Démarrer le serveur de développement"
echo "  npm run build        - Construire l'application"
echo "  npm run lint         - Vérifier le code"
echo "  npm run lint -- --fix - Corriger automatiquement"
echo "  npm run preview      - Prévisualiser le build"
echo ""
echo "📱 Pour le développement mobile:"
echo "  npx cap add android  - Ajouter la plateforme Android"
echo "  npx cap add ios      - Ajouter la plateforme iOS"
echo "  npx cap sync         - Synchroniser les plateformes"
echo "  npx cap run android  - Lancer sur Android"
echo "  npx cap run ios      - Lancer sur iOS"
echo ""
echo "💡 Ouvrez ce projet dans VS Code pour une meilleure expérience !"