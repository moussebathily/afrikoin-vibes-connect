# AfriKoin v1.2.2

Application mobile AfriKoin développée avec Capacitor, React et TypeScript.

## 🚀 Fonctionnalités

- Interface utilisateur moderne et responsive
- Support Android avec génération AAB automatique
- Détection automatique par Android Studio
- Déploiement continu avec GitHub Actions
- Architecture basée sur Capacitor pour les fonctionnalités natives

## 📱 Développement Mobile

### Prérequis
- Node.js 18+
- Android Studio (pour le développement Android)
- Java JDK 17

### Installation

```bash
# Installation des dépendances
npm install

# Construction de l'application web
npm run build

# Ajout de la plateforme Android (première fois uniquement)
npx cap add android

# Synchronisation avec les plateformes natives
npx cap sync
```

### Développement

```bash
# Serveur de développement
npm run dev

# Build de développement
npm run build:dev

# Build de production
npm run build
```

### Android Studio

```bash
# Ouvrir dans Android Studio
npx cap open android

# Lancer sur émulateur/appareil
npx cap run android
```

## 🔧 Configuration CI/CD

### GitHub Actions

Le projet inclut deux workflows automatiques :

1. **Android CI** (`android-ci.yml`) - Tests et vérifications sur chaque push
2. **Build AAB** (`build-android-aab.yml`) - Génération AAB pour la production

### Secrets GitHub requis

Pour la signature AAB en production, configurez ces secrets :

```
ANDROID_KEYSTORE          # Keystore encodé en base64
ANDROID_KEYSTORE_PASSWORD # Mot de passe du keystore
ANDROID_KEY_ALIAS         # Alias de la clé
ANDROID_KEY_PASSWORD      # Mot de passe de la clé
```

## 📦 Génération AAB

### Automatique (via GitHub Actions)
- Push sur `main` → AAB de release
- Tag `v*` → Release GitHub avec AAB
- Pull Request → AAB de debug pour tests

### Manuel
```bash
cd android
./gradlew bundleRelease  # Pour la production
./gradlew bundleDebug    # Pour les tests
```

## 🛠️ Structure du Projet

```
afrikoin/
├── src/                 # Code source React
├── android/             # Projet Android natif
│   ├── app/build.gradle # Configuration Android
│   └── variables.gradle # Variables partagées
├── .github/workflows/   # Actions GitHub
└── capacitor.config.ts  # Configuration Capacitor
```

## 📋 Version

- **Version App**: 1.2.2
- **Version Code**: 122
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 22 (Android 5.1)

## 🔗 Liens Utiles

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Guide Android Studio](https://developer.android.com/studio)
- [Distribution Google Play](https://play.google.com/console)

---

Développé avec ❤️ pour AfriKoin