
# Build Automatisé Android - AfriKoin

## Vue d'ensemble

Ce système permet de générer des builds Android (APK/AAB) sans utiliser Android Studio, en utilisant uniquement la ligne de commande et GitHub Actions.

## Prérequis

### Développement Local
- Node.js 18+
- Java 11+
- Android SDK avec build-tools
- Git

### Variables d'environnement (pour production)
```bash
export ANDROID_HOME=/path/to/android/sdk
export ANDROID_KEYSTORE_FILE=/path/to/keystore.jks
export ANDROID_KEYSTORE_PASSWORD=your_keystore_password
export ANDROID_KEY_ALIAS=your_key_alias
export ANDROID_KEY_PASSWORD=your_key_password
```

## Utilisation

### 1. Build Local

#### Linux/macOS
```bash
# Build de développement (APK)
./scripts/build-android.sh debug

# Build de production (AAB)
./scripts/build-android.sh release
```

#### Windows
```powershell
# Build de développement (APK)
.\scripts\build-android.ps1 debug

# Build de production (AAB)
.\scripts\build-android.ps1 release
```

### 2. Build via GitHub Actions

#### Build Manuel
1. Aller dans l'onglet "Actions" de votre repo GitHub
2. Sélectionner "Build Android AAB"
3. Cliquer "Run workflow"
4. Choisir le type de build (debug/release)
5. Télécharger l'artifact généré

#### Build Automatique
- Les builds se déclenchent automatiquement sur push vers `main`
- Les fichiers générés sont disponibles dans les artifacts

## Configuration du Keystore

### Pour le développement
Un keystore de debug est automatiquement généré.

### Pour la production
1. Créer un keystore de production :
```bash
keytool -genkey -v -keystore afrikoin-release.keystore \
  -alias afrikoin -keyalg RSA -keysize 2048 -validity 10000
```

2. Encoder en base64 pour GitHub Secrets :
```bash
base64 -i afrikoin-release.keystore -o keystore.base64
```

3. Ajouter les secrets dans GitHub :
   - `ANDROID_KEYSTORE_BASE64` : contenu du fichier keystore.base64
   - `KEYSTORE_PASSWORD` : mot de passe du keystore
   - `KEY_ALIAS` : alias de la clé
   - `KEY_PASSWORD` : mot de passe de la clé

## Fichiers générés

### APK Debug
- Localisation : `android/app/build/outputs/apk/debug/app-debug.apk`
- Usage : Tests, installation directe sur appareil
- Signature : Keystore de debug automatique

### AAB Release
- Localisation : `android/app/build/outputs/bundle/release/app-release.aab`
- Usage : Publication sur Google Play Store
- Signature : Keystore de production

## Déploiement sur Play Console

### Méthode 1 : Interface Web
1. Connectez-vous à [Google Play Console](https://play.google.com/console)
2. Sélectionnez votre application
3. Allez dans "Production" > "Créer une nouvelle version"
4. Uploadez le fichier `.aab` généré
5. Remplissez les notes de version
6. Publiez

### Méthode 2 : CLI (Automatisé)
Utilisez l'API Google Play Developer pour automatiser l'upload :

```bash
# Installation de l'outil CLI
npm install -g @google-cloud/storage

# Upload automatisé (script à développer)
node scripts/upload-to-play-console.js
```

## Optimisations

### Réduction de la taille
- **Proguard** : Activé en production pour minifier le code
- **Bundle splits** : Optimisation par densité et ABI
- **Compression** : Assets automatiquement compressés

### Performance
- **Build cache** : Utilisation du cache Gradle
- **Parallel builds** : Builds parallèles activés
- **Incremental compilation** : Compilation incrémentale

## Dépannage

### Erreurs communes

#### "SDK location not found"
```bash
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew build --debug
```

#### "Keystore not found"
Vérifiez que les variables d'environnement sont correctement définies :
```bash
echo $ANDROID_KEYSTORE_FILE
echo $ANDROID_KEYSTORE_PASSWORD
```

### Logs utiles
```bash
# Logs détaillés Gradle
./gradlew bundleRelease --debug --stacktrace

# Logs Capacitor
npx cap sync android --verbose

# Vérification de la signature
jarsigner -verify -verbose android/app/build/outputs/bundle/release/app-release.aab
```

## Scripts utiles

### Vérification de l'AAB
```bash
# Installer bundletool
wget https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar

# Générer l'APK universel pour test
java -jar bundletool-all.jar build-apks \
  --bundle=app-release.aab \
  --output=app-release.apks \
  --mode=universal
```

### Test de l'APK
```bash
# Installer sur appareil connecté
adb install -r app-debug.apk

# Logs de l'application
adb logcat | grep AfriKoin
```

## Intégration Continue

Le workflow GitHub Actions automatise :
1. ✅ Installation des dépendances
2. ✅ Build de l'application web
3. ✅ Synchronisation Capacitor
4. ✅ Configuration du keystore
5. ✅ Build Android (APK/AAB)
6. ✅ Upload des artifacts
7. ✅ Notifications de succès/échec

Cela permet un déploiement continu sans intervention manuelle !
