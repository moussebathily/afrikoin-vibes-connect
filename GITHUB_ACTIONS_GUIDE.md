# 🔧 Guide de Correction des GitHub Actions

## 📊 État actuel des workflows

| Workflow | Statut | Problème | Solution |
|----------|--------|---------|----------|
| `.gradle-publish.yml` | ❌ CORROMPU | Contenu en français mélangé | ✅ CORRIGÉ |
| `android-ci.yml` | ⚠️ ÉCHOUE | Secrets manquants / Dépendances | À vérifier |
| `optimized-deploy.yml` | ⚠️ ÉCHOUE | Secrets Vercel manquants | À configurer |
| `supabase.yml` | ✅ SUCCESS | Fonctionne correctement | Aucune action |

---

## 🔴 Problème 1: Secrets GitHub manquants

### Secrets requis pour `optimized-deploy.yml`:
```
VERCEL_TOKEN          → Token Vercel
VERCEL_ORG_ID         → ID Organisation Vercel
VERCEL_PROJECT_ID     → ID Projet Vercel
ANDROID_KEYSTORE      → Keystore Android (base64)
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

### Comment ajouter les secrets:
1. Allez sur https://github.com/moussebathily/afrikoin-vibes-connect/settings/secrets/actions
2. Cliquez sur "New repository secret"
3. Ajoutez chaque secret avec sa valeur

---

## 🔴 Problème 2: Configuration Vercel

### Récupérer les credentials Vercel:
```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Login à Vercel
vercel login

# 3. Récupérer les IDs
vercel link

# 4. Afficher le token
cat ~/.vercel/auth.json
```

### Ajouter les secrets:
```
VERCEL_TOKEN = (votre token personnel Vercel)
VERCEL_ORG_ID = (votre organisation ID)
VERCEL_PROJECT_ID = (l'ID du projet déployé)
```

---

## 🔴 Problème 3: Configuration Android Keystore

### Générer ou récupérer le keystore:
```bash
# Si vous avez déjà un keystore:
base64 android/app/release.keystore | tr -d '\n'

# Ajouter en secret GitHub avec le nom: ANDROID_KEYSTORE

# Ajouter aussi les mots de passe:
ANDROID_KEYSTORE_PASSWORD = (votre mot de passe keystore)
ANDROID_KEY_ALIAS = (votre alias)
ANDROID_KEY_PASSWORD = (votre mot de passe clé)
```

---

## 📋 Checklist de correction

### ✅ Phase 1: Nettoyage des workflows
- [x] Corriger `.gradle-publish.yml`
- [ ] Valider la syntaxe YAML des autres workflows
- [ ] Tester localement avec `act` (GitHub Actions emulator)

### ⚙️ Phase 2: Configuration des secrets
- [ ] Ajouter `VERCEL_TOKEN`
- [ ] Ajouter `VERCEL_ORG_ID`
- [ ] Ajouter `VERCEL_PROJECT_ID`
- [ ] Ajouter `ANDROID_KEYSTORE`
- [ ] Ajouter `ANDROID_KEYSTORE_PASSWORD`
- [ ] Ajouter `ANDROID_KEY_ALIAS`
- [ ] Ajouter `ANDROID_KEY_PASSWORD`

### 🧪 Phase 3: Tests
- [ ] Déclencher `optimized-deploy.yml` manuellement (workflow_dispatch)
- [ ] Vérifier les logs en cas d'erreur
- [ ] Valider le déploiement Vercel
- [ ] Valider la génération Android AAB

---

## 🔍 Dépannage

### Erreur: "No such file or directory: android/gradlew"
**Solution:**
```bash
chmod +x android/gradlew
git add android/gradlew
git commit -m "fix: Make gradlew executable"
git push
```

### Erreur: "VERCEL_TOKEN is not set"
**Solution:**
1. Aller à https://vercel.com/account/tokens
2. Créer un nouveau token
3. L'ajouter en secret GitHub

### Erreur: "Failed to install npm dependencies"
**Solution:**
```bash
# Vérifier package.json
npm install
npm ci --legacy-peer-deps

# Commit et push
git add package-lock.json
git commit -m "fix: Update dependencies"
git push
```

---

## 🚀 Script de correction automatique

Créez `scripts/setup-github-actions.sh`:

```bash
#!/bin/bash
set -e

echo "🔧 Configuration des GitHub Actions..."

# 1. Rendre gradlew exécutable
chmod +x android/gradlew

# 2. Installer les dépendances
npm install

# 3. Valider les fichiers YAML
echo "📋 Validation YAML..."
for file in .github/workflows/*.yml; do
  echo "  Vérification: $file"
  # Vous pouvez ajouter une validation YAML ici si yamllint est installé
done

echo "✅ Configuration terminée!"
echo ""
echo "🔑 Étapes suivantes:"
echo "1. Ajouter les secrets GitHub (voir GITHUB_ACTIONS_GUIDE.md)"
echo "2. Déclencher workflow_dispatch pour tester"
echo "3. Vérifier les logs GitHub Actions"
```

Exécutez:
```bash
chmod +x scripts/setup-github-actions.sh
./scripts/setup-github-actions.sh
```

---

## 📝 Template de secrets GitHub

Visitez: `https://github.com/moussebathily/afrikoin-vibes-connect/settings/secrets/actions`

Créez ces secrets:

```yaml
# Vercel Deployment
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here

# Android Signing
ANDROID_KEYSTORE=your_base64_encoded_keystore_here
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_ALIAS=your_key_alias
ANDROID_KEY_PASSWORD=your_key_password

# Optional: SSH Deploy Key
DEPLOY_SSH_KEY=your_ssh_private_key_here
```

---

## 🧪 Test local avec `act`

Installez `act` pour tester les workflows localement:

```bash
# Installation
brew install act  # macOS
# ou
choco install act  # Windows

# Test du workflow optimized-deploy
act -j deploy-web

# Test avec inputs
act workflow_dispatch -i deploy_target=web
```

---

## 📚 Ressources utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git)
- [Android Signing Configuration](https://reactnative.dev/docs/signed-apk-android)
- [Act - GitHub Actions Local Runner](https://github.com/nektos/act)

---

## ✨ État final attendu

Après correction:
- ✅ `.gradle-publish.yml` - YAML valide
- ✅ `android-ci.yml` - Construit correctement
- ✅ `optimized-deploy.yml` - Déploie sur Vercel
- ✅ Supabase CI/CD - Fonctionne déjà

**Temps estimé:** 30-45 minutes pour la configuration complète
