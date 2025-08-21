# AfriKoin GitHub Actions Workflows

## Configuration Standard Android SDK

Tous les workflows Android utilisent maintenant une configuration standardisée pour éviter les erreurs de licences :

### Configuration Android SDK Standardisée

```yaml
- name: Setup Android SDK
  uses: android-actions/setup-android@v3
  with:
    accept-android-sdk-licenses: true
    log-accepted-android-sdk-licenses: true
    packages: |
      platform-tools
      platforms;android-35
      build-tools;35.0.0
```

### Corrections Apportées

1. **Paramètres corrigés** :
   - ✅ `accept-android-sdk-licenses: true` (au lieu de `accept-licenses`)
   - ✅ `log-accepted-android-sdk-licenses: true` (pour éviter les invites interactives)

2. **Packages standardisés** :
   - `platform-tools` : Outils de base Android
   - `platforms;android-35` : API Android 35
   - `build-tools;35.0.0` : Outils de build

3. **Workflows mis à jour** :
   - ✅ `build-android-aab.yml`
   - ✅ `extract-sha1-and-build.yml`
   - ✅ `production-deploy.yml`
   - ✅ `android-ci.yml`
   - ✅ `publish-google-play.yml` (déjà correct)

### Avantages

- **Acceptation automatique** des licences Android SDK
- **Pas d'interruption** des workflows pour des prompts interactifs
- **Configuration unifiée** sur tous les workflows
- **Meilleure fiabilité** des builds Android

## Solution pour les problèmes persistants

Si vous voyez encore l'erreur même après la correction :

### 1. Vider le cache GitHub Actions
- Aller sur GitHub → Actions → Caches
- Supprimer tous les caches Android/Gradle
- Ou déclencher un workflow avec `workflow_dispatch`

### 2. Forcer un nouveau build
```bash
# Créer un commit vide pour forcer la synchronisation
git commit --allow-empty -m "chore: force workflows sync - Android SDK fix"
git push
```

### 3. Vérifier la branche
- Les workflows se déclenchent depuis la branche `main`
- S'assurer que tous les fichiers workflow sont sur `main`

### 4. Déclencher manuellement
- GitHub → Actions → Choisir un workflow
- "Run workflow" → Sélectionner branche `main`

### Notes Importantes

- Tous les workflows utilisent maintenant Java 17 et Node.js 20
- Les licences Android sont acceptées automatiquement
- Les packages Android sont installés de manière cohérente
- Les logs des licences acceptées sont activés pour le débogage