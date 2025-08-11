
# Guide de Build Mobile AfriKoin

## Prérequis
- Node.js 18+ installé
- Android Studio installé
- Java 17 configuré
- Variables d'environnement Android SDK configurées

## Étapes pour générer l'AAB

### 1. Préparation du projet
```bash
# Cloner le projet depuis GitHub
git clone [VOTRE_REPO_URL]
cd afrikoin-vibes-connect

# Installer les dépendances
npm install

# Build de l'application web
npm run build
```

### 2. Configuration Capacitor
```bash
# Initialiser Capacitor (déjà fait dans le code)
npx cap init

# Ajouter la plateforme Android
npx cap add android

# Synchroniser les fichiers
npx cap sync android
```

### 3. Configuration Android
```bash
# Ouvrir le projet dans Android Studio
npx cap open android
```

### 4. Signature locale via gradle-local.properties (recommandé)
1) Copiez `android/gradle-local.properties.example` vers `android/gradle-local.properties` (ne pas commettre) et remplissez:
   - `MYAPP_UPLOAD_STORE_FILE=app/release.keystore` (ou chemin absolu)
   - `MYAPP_UPLOAD_STORE_PASSWORD=...`
   - `MYAPP_UPLOAD_KEY_ALIAS=...`
   - `MYAPP_UPLOAD_KEY_PASSWORD=...`
2) Vérifiez la config: `./gradlew :app:printSigningConfig` (Windows: `gradlew.bat :app:printSigningConfig`). Assurez-vous que `HAS_RELEASE_SIGNING: true` et `Android Studio externalOverride: false`.
3) Générez l’AAB en CLI: `./gradlew :app:bundleRelease`.

### 5. Dans Android Studio (optionnel)
1. Attendez l'indexation du projet
2. Build > Clean Project
3. Build > Rebuild Project
4. Build > Generate Signed Bundle / APK > Android App Bundle
5. IMPORTANT: pour éviter l’injection de signature « externe » (externalOverride), laissez les champs de signature vides si Android Studio propose d’enregistrer une config; Gradle signera via `gradle-local.properties`.
6. Sélectionnez le build type "release" et générez l’AAB

## 🔧 Dépannage: externalOverride / validateSigningRelease
- Symptôme: `Task :app:validateSigningRelease FAILED` avec `Keystore file ... not found for signing config 'externalOverride'`.
- Cause: Android Studio a injecté une signature temporaire (externalOverride) pointant vers un keystore inexistant.
- Correctifs:
  1) Recommandé: signature via Gradle
     - Configurez `android/gradle-local.properties` avec `MYAPP_UPLOAD_*`
     - Vérifiez: `./gradlew :app:printSigningConfig` (externalOverride: false)
     - Build: `./gradlew :app:bundleRelease`
  2) Alternative: corriger le chemin du keystore dans l’assistant Android Studio (Generate Signed Bundle)
- Vérification automatique: `./gradlew :app:doctorSigning` échouera tôt si externalOverride est cassé.

### 5. Upload sur Play Console
1. Connectez-vous à Google Play Console
2. Créez une nouvelle application
3. Uploadez le fichier .aab généré
4. Remplissez les métadonnées requises
5. Soumettez pour révision

## Fichiers importants générés
- `android/app/build/outputs/bundle/release/app-release.aab` (fichier AAB pour Play Store)
- Icônes et ressources dans `android/app/src/main/res/`

## Commandes utiles
```bash
# Pour nettoyer et reconstruire
npx cap sync android --clean

# Pour tester sur émulateur
npx cap run android

# Pour voir les logs
npx cap run android -l
```

## 🔐 Secrets GitHub requis

Définissez ces secrets pour les builds signés et la vérification automatique:

- ANDROID_KEYSTORE: contenu base64 du fichier .jks
- ANDROID_KEYSTORE_PASSWORD: mot de passe du keystore
- ANDROID_KEY_ALIAS: alias de la clé
- ANDROID_KEY_PASSWORD: mot de passe de la clé
- EXPECTED_UPLOAD_SHA1: empreinte SHA-1 attendue (format avec ou sans deux-points)

- Alternatif (workflow "🔐 Extraire SHA-1 et build"):
  - SIGNING_KEYSTORE_BASE64, SIGNING_KEYSTORE_PASSWORD, SIGNING_KEY_ALIAS, SIGNING_KEY_PASSWORD
  - Remarque: ce workflow accepte aussi les secrets ANDROID_* listés ci-dessus.

## 🧪 Vérifier l'empreinte dans CI/CD

- Les workflows `Build Android AAB` et `Production Deploy` comparent automatiquement la SHA-1 extraite au secret `EXPECTED_UPLOAD_SHA1` (fallback: `PLAY_UPLOAD_SHA1`).
- Le build échoue si ça ne matche pas.

## 🖥️ Extraction locale rapide (Bash)

```bash
read -p "Keystore (.jks/.keystore): " KEYSTORE
read -p "Alias: " ALIAS
read -s -p "Store password: " STOREPASS; echo
read -s -p "Key password: " KEYPASS; echo
keytool -list -v -keystore "$KEYSTORE" -alias "$ALIAS" -storepass "$STOREPASS" -keypass "$KEYPASS" \
| sed -n -e 's/.*SHA-1:\s*\(.*\)/\1/p' -e 's/.*SHA1:\s*\(.*\)/\1/p' | head -n1
```

## 📤 Exporter le certificat PEM (Play App Signing)

```bash
keytool -exportcert -rfc -alias "$ALIAS" -keystore "$KEYSTORE" -storepass "$STOREPASS" -keypass "$KEYPASS" > upload_cert.pem
```

Conseil: encodez votre keystore en base64 pour GitHub Secrets:
```bash
base64 -w0 release.keystore > keystore.b64
```
