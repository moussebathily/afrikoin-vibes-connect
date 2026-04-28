# 📱 Guide Android Studio & Génération AAB — AfriKoin

Guide complet pour préparer, builder et publier l'application AfriKoin sur Google Play (format **.aab** — Android App Bundle).

---

## ✅ Pré-requis

| Outil | Version recommandée |
|---|---|
| Node.js | ≥ 18 |
| Java JDK | **17** (obligatoire) |
| Android Studio | Hedgehog ou + récent |
| Android SDK | API 35 (compileSdk/targetSdk) |
| Gradle | wrapper inclus (8.x) |

---

## 🚀 Étape 1 — Cloner & installer

```bash
git clone <votre-repo-github>
cd afrikoin-app
npm install
```

> 💡 Le projet doit d'abord être exporté depuis Lovable vers GitHub via le bouton **GitHub → Export to GitHub**.

---

## 🏗️ Étape 2 — Build web + sync Capacitor

```bash
# Build production (génère /dist)
npm run build

# Ajouter Android (uniquement la 1ère fois)
npx cap add android

# Synchroniser le web vers le projet Android
npx cap sync android
```

---

## 🔐 Étape 3 — Créer le keystore de release

⚠️ **À faire UNE SEULE FOIS et à conserver précieusement** (sauvegardez-le, sinon vous ne pourrez plus mettre à jour l'app sur Play Store).

```bash
keytool -genkey -v \
  -keystore android/app/release.keystore \
  -alias afrikoin-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Puis copiez le template de configuration :

```bash
cp android/gradle-local.properties.example android/gradle-local.properties
```

Éditez `android/gradle-local.properties` :

```properties
MYAPP_UPLOAD_STORE_FILE=app/release.keystore
MYAPP_UPLOAD_STORE_PASSWORD=VotreMotDePasseStore
MYAPP_UPLOAD_KEY_ALIAS=afrikoin-upload
MYAPP_UPLOAD_KEY_PASSWORD=VotreMotDePasseKey
```

> 🔒 Ce fichier est **dans `.gitignore`** — ne jamais le committer.

---

## 🎨 Étape 4 — Ouvrir dans Android Studio

```bash
npx cap open android
```

Android Studio va :
1. Indexer le projet
2. Télécharger les dépendances Gradle
3. Synchroniser le projet (**Sync Project with Gradle Files**)

### Vérifier la signature

Dans le terminal Android Studio :
```bash
./gradlew :app:printSigningConfig
```

Doit afficher `HAS_RELEASE_SIGNING: true`.

---

## 📦 Étape 5 — Générer l'AAB

### Option A — Via Android Studio (recommandé)

1. Menu **Build → Generate Signed Bundle / APK…**
2. Sélectionner **Android App Bundle**
3. Choisir le keystore `android/app/release.keystore`
4. Renseigner les mots de passe
5. Variant : **release**
6. Cliquer **Create**

L'AAB sera généré ici :
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Option B — Via ligne de commande

```bash
cd android
./gradlew clean
./gradlew :app:bundleRelease
```

Résultat :
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Option C — Via GitHub Actions (CI/CD)

Le workflow `.github/workflows/build-android-aab.yml` est déjà configuré.

Secrets à ajouter dans **GitHub → Settings → Secrets**:

| Secret | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Keystore encodé : `base64 -w0 release.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | Mot de passe du store |
| `ANDROID_KEY_ALIAS` | `afrikoin-upload` |
| `ANDROID_KEY_PASSWORD` | Mot de passe de la clé |

Déclenchement automatique : créer un tag `v1.0.0` → AAB téléversé en artifact.

---

## 📝 Étape 6 — Vérifier l'AAB avant publication

```bash
# Inspecter le bundle
bundletool dump manifest --bundle=app-release.aab

# Générer un APK universel pour test local
bundletool build-apks --bundle=app-release.aab --output=app.apks --mode=universal
```

---

## 🛒 Étape 7 — Publier sur Google Play

1. Aller sur [Google Play Console](https://play.google.com/console)
2. Créer l'app (si nouvelle) avec :
   - **Nom** : AfriKoin - Marché Panafricain
   - **Package** : `app.lovable.afrikoin`
3. **Production → Créer une nouvelle version**
4. Téléverser `app-release.aab`
5. Renseigner les notes de version
6. Soumettre pour examen

---

## 🔢 Versioning automatique

Le `versionCode` et `versionName` sont **calculés automatiquement** dans `android/app/build.gradle` :

| Source | versionCode | versionName |
|---|---|---|
| Tag git `v1.2.3` | `10203` | `1.2.3` |
| Build local/dev | `20000000 + RUN_NUMBER` | `dev.N` |

➡️ **Pour publier**, créez un tag : `git tag v1.0.0 && git push --tags`

---

## ⚙️ Configuration actuelle

| Paramètre | Valeur |
|---|---|
| `applicationId` | `app.lovable.afrikoin` |
| `compileSdk` / `targetSdk` | 35 |
| `minSdk` | 22 (Android 5.1+) |
| Java | 17 |
| Format publication | **AAB** (App Bundle) |
| ProGuard | Activé (`minifyEnabled true`) |
| Resource shrinking | Désactivé (hybride Capacitor) |
| Splash screen | Couleur `#f59e0b` (ambre) |

---

## 🐛 Problèmes courants

| Erreur | Solution |
|---|---|
| `SDK location not found` | Créer `android/local.properties` avec `sdk.dir=/path/to/Android/Sdk` |
| `Keystore was tampered with` | Mauvais mot de passe — vérifier `gradle-local.properties` |
| `Execution failed for task ':app:processReleaseResources'` | Lancer `npx cap sync android` puis rebuilder |
| WebView blanche en prod | Vérifier que `npm run build` a généré `/dist` avant `cap sync` |
| `Unable to load script` | Le `server.url` du `capacitor.config.ts` doit être absent en production (déjà géré via `NODE_ENV`) |

---

## 📚 Ressources

- [Lovable Mobile Blog Post](https://lovable.dev/blog/2025-03-25-mobile-development-with-capacitor)
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Google Play Console](https://play.google.com/console)

---

✅ **Votre projet est prêt pour Android Studio et la génération d'AAB !**
