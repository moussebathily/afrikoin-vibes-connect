# Create a comprehensive ZIP with a single, production-ready GitHub Actions workflow
# that builds Android AAB, publishes to Google Play (GPP), deploys Web to Vercel,
# includes robust caching fallbacks, npm fallback, Gradle retries, artifact detection,
# and a README.


import os, zipfile, textwrap, time

os.makedirs(".github/workflows", exist_ok=True)

workflow = textwrap.dedent("""\
name: Production Deploy • Android + Google Play + Web (Vercel)

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:
    inputs:
      release_notes:
        description: "Release notes (optional)"
        required: false
        default: ""

jobs:
  build-android:
    name: Build Android AAB & Publish to Google Play
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: "temurin"
          java-version: "21"

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Setup Gradle (non-blocking cache)
        uses: gradle/actions/setup-gradle@v3
        continue-on-error: true
        with:
          cache-read-only: true

      - name: Install Android SDK
        uses: android-actions/setup-android@v3

      - name: NPM install (ci -> install fallback)
        shell: bash
        run: |
          set -e
          if command -v npm >/dev/null 2>&1; then
            echo "→ npm ci"
            if ! npm ci --legacy-peer-deps --ignore-optional; then
              echo "⚠️ npm ci failed, trying npm install..."
              rm -rf node_modules package-lock.json || true
              npm install --legacy-peer-deps
              npm run build || true
            fi
          else
            echo "npm not found, skipping web build deps."
          fi

      - name: Detect Gradle wrapper path
        id: gradle
        shell: bash
        run: |
          if [ -f "./gradlew" ]; then
            echo "dir=." >> $GITHUB_OUTPUT
          elif [ -f "./android/gradlew" ]; then
            echo "dir=android" >> $GITHUB_OUTPUT
          else
            echo "❌ gradlew not found (./gradlew or ./android/gradlew)."
            exit 1
          fi

      - name: Decode Android keystore (upload key)
        if: ${{ secrets.ANDROID_KEYSTORE_BASE64 != '' }}
        shell: bash
        run: |
          echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > $HOME/release.keystore

      - name: Configure Gradle signing
        shell: bash
        run: |
          mkdir -p $HOME/.gradle
          {
            echo "RELEASE_STORE_FILE=$HOME/release.keystore"
            echo "RELEASE_STORE_PASSWORD=${{ secrets.ANDROID_KEYSTORE_PASSWORD }}"
            echo "RELEASE_KEY_ALIAS=${{ secrets.ANDROID_KEY_ALIAS }}"
            echo "RELEASE_KEY_PASSWORD=${{ secrets.ANDROID_KEY_PASSWORD }}"
          } >> $HOME/.gradle/gradle.properties

      - name: Write Play service account JSON
        shell: bash
        run: |
          echo "${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}" > $HOME/play-account.json

      - name: Define retry helper
        shell: bash
        run: |
          retry() {
            local n=0
            local try=$1; shift
            until [ $n -ge $try ]; do
              "$@" && break
              n=$((n+1))
              echo "⏳ Retry $n/$try in 10s…"
              sleep 10
            done
            [ $n -lt $try ]
          }
          declare -f retry

      - name: Verify Gradle
        shell: bash
        run: |
          cd "${{ steps.gradle.outputs.dir }}"
          ./gradlew --version
          ./gradlew tasks || true

      - name: Build AAB (release) with retry
        shell: bash
        run: |
          cd "${{ steps.gradle.outputs.dir }}"
          if ./gradlew tasks --all | grep -q ":app:bundleRelease"; then
            retry 3 ./gradlew :app:bundleRelease --stacktrace --info
          else
            retry 3 ./gradlew bundleRelease --stacktrace --info
          fi

      - name: Locate artifacts (AAB & mapping.txt)
        id: locate
        shell: bash
        run: |
          cd "${{ steps.gradle.outputs.dir }}"
          AAB=$(find . -type f -path "*/outputs/bundle/*/*.aab" | head -n1)
          MAP=$(find . -type f -path "*/outputs/mapping/*/mapping.txt" | head -n1 || true)
          if [ -z "$AAB" ]; then
            echo "❌ No AAB found under */outputs/bundle/*/*.aab"
            echo "Nearby outputs dirs:"
            find . -maxdepth 6 -type d -name outputs -print
            exit 1
          fi
          echo "aab=$AAB" >> $GITHUB_OUTPUT
          echo "map=$MAP" >> $GITHUB_OUTPUT
          echo "Found AAB: $AAB"
          if [ -n "$MAP" ]; then echo "Found mapping.txt: $MAP"; fi

      - name: Upload AAB artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: ${{ steps.locate.outputs.aab }}
          if-no-files-found: error
          retention-days: 14

      - name: Upload mapping (optional)
        if: ${{ steps.locate.outputs.map != '' }}
        uses: actions/upload-artifact@v4
        with:
          name: mapping-release
          path: ${{ steps.locate.outputs.map }}
          retention-days: 14

      - name: Publish to Google Play (production, completed) with retry
        env:
          NOTES: ${{ github.event.inputs.release_notes }}
        shell: bash
        run: |
          cd "${{ steps.gradle.outputs.dir }}"
          ARGS=(
            "-Pplay.serviceAccountCredentials=$HOME/play-account.json"
            "-Pplay.track=production"
            "-Pplay.releaseStatus=completed"
          )
          if [ -n "$NOTES" ]; then
            echo "$NOTES" > whatsnew-default.txt
            ARGS+=("-Pplay.releaseNotes=en-US:whatsnew-default.txt")
          fi
          retry 3 ./gradlew publishReleaseBundle "${ARGS[@]}" --stacktrace --info

  deploy-web:
    name: Deploy Web to Vercel • Production
    runs-on: ubuntu-latest
    needs: [build-android]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install deps (ci -> install fallback)
        shell: bash
        run: |
          set -e
          if ! npm ci --legacy-peer-deps --ignore-optional; then
            echo "⚠️ npm ci failed, trying npm install..."
            rm -rf node_modules package-lock.json || true
            npm install --legacy-peer-deps
          fi

      - name: Build Web
        run: npm run build

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-args: "--prod"
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./

  validate:
    name: Post-Deploy Validation
    runs-on: ubuntu-latest
    needs: [build-android, deploy-web]

    steps:
      - name: Check website availability
        shell: bash
        run: |
          URL="https://www.afrikoin.online"
          code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
          if [ "$code" -eq 200 ]; then
            echo "✅ Website reachable (HTTP $code)"
          else
            echo "❌ Website check failed (HTTP $code)"
            exit 1
          fi

      - name: Check sitemap
        shell: bash
        run: |
          URL="https://www.afrikoin.online/sitemap.xml"
          code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
          if [ "$code" -eq 200 ]; then
            echo "✅ Sitemap reachable (HTTP $code)"
          else
            echo "❌ Sitemap check failed (HTTP $code)"
            exit 1
          fi
""")

readme = textwrap.dedent("""\
# Production Deploy • Android + Google Play + Web (Vercel)

Ce workflow unique :
- construit un **AAB Android** signé,
- **publie** automatiquement sur **Google Play (production, completed)** via **Gradle Play Publisher**,
- déploie le **Web** sur **Vercel (prod)**,
- effectue des **vérifications post-déploiement**.

## Déclenchement
- **Tags `v*`** (ex: `v1.2.3`) → pipeline complet
- **Manuel** via *Run workflow* (release notes possibles)

## Prérequis
1. **Plugin GPP** dans `app/` :
   - Groovy
     ```groovy
     plugins {
       id 'com.android.application'
       id 'com.github.triplet.play' version '3.9.1'
     }
     ```
   - Kotlin DSL
     ```kotlin
     plugins {
       id("com.android.application")
       id("com.github.triplet.play") version "3.9.1"
     }
     ```

2. **Secrets GitHub** (Settings → Secrets and variables → Actions) :
   - `PLAY_SERVICE_ACCOUNT_JSON` → contenu complet du JSON du compte de service Google Play
   - `ANDROID_KEYSTORE_BASE64` → ton `.jks` encodé en base64 (clé d’upload)
   - `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`, `ANDROID_KEY_ALIAS`
   - `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID` pour Vercel

3. **Play Console** → Paramètres → **Accès à l’API** : associer `afrikoin-publisher@afrikoin-deploy.iam.gserviceaccount.com` et lui donner **Gestionnaire de versions** (ou Administrateur).

## Notes techniques
- **npm ci → fallback npm install** si désync du lockfile.
- **Gradle cache non bloquant** (tolère les pannes du cache GitHub).
- **Retries** sur `bundleRelease` et `publishReleaseBundle`.
- **Détection automatique** du chemin Gradle (`./gradlew` ou `./android/gradlew`) et du **.aab**.
- Les **artifacts** (`.aab`, `mapping.txt`) sont uploadés pour téléchargement.

## Lancer
- Crée un tag `v1.2.3` et pousse-le → publication Google Play + déploiement Vercel.
- Ou lance **Run workflow** et fournis éventuellement `release_notes`.
""")

with open(".github/workflows/production-deploy.yml", "w", encoding="utf-8") as f:
    f.write(workflow)

with open("README-PROD-PIPELINE.md", "w", encoding="utf-8") as f:
    f.write(readme)

zip_path = f"/mnt/data/prod-pipeline-afrikoin-{int(time.time())}.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(".github/workflows/production-deploy.yml")
    z.write("README-PROD-PIPELINE.md")

zip_path
