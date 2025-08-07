
# Guide de Build Mobile AfriKoin

## Prérequis
- Node.js 18+ installé
- Android Studio installé
- Java 11+ configuré
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

### 4. Dans Android Studio
1. Attendez l'indexation du projet
2. Allez dans Build > Clean Project
3. Puis Build > Rebuild Project
4. Allez dans Build > Generate Signed Bundle / APK
5. Sélectionnez "Android App Bundle"
6. Créez ou sélectionnez votre keystore
7. Choisissez "release" build
8. Générez l'AAB

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
