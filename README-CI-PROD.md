# Android Play Store CI (AfriKoin)

Quick guide to our automatic Google Play publishing pipeline.

Secrets (GitHub → Settings → Secrets and variables → Actions):
- PLAY_SERVICE_ACCOUNT_JSON: Full JSON key of Play Console service account
- ANDROID_KEYSTORE: Base64 of your .jks upload keystore
- ANDROID_KEYSTORE_PASSWORD: Keystore password
- ANDROID_KEY_ALIAS: Key alias
- ANDROID_KEY_PASSWORD: Key alias password

Triggers:
- Push to main/master: uploads to Internal track
- Tag vX.Y.Z: uploads to Production with staged rollout (default 20%)
- Manual run: choose track; for production you can set rollout (0-1). Empty = full rollout.

Versioning:
- Tags vX.Y.Z → versionCode = X*10000 + Y*100 + Z, versionName = X.Y.Z
- Non-tag builds → versionCode = 20000000 + GITHUB_RUN_NUMBER, versionName = dev.RUN_NUMBER

Artifacts:
- The workflow also uploads the built AAB and ProGuard mapping as artifacts for each run

Notes:
- Package name: app.lovable.afrikoin (must match Play Console app)
- Uses r0adkll/upload-google-play for upload
- If Play App Signing is enabled, ensure the upload key matches the registered one
