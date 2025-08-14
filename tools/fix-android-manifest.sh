#!/usr/bin/env bash
set -euo pipefail

APP_DIR="android/app"
RES_XML="$APP_DIR/src/main/res/xml"
GRADLE_APP="$APP_DIR/build.gradle"

echo "==> Auto-fix Android manifest prerequisites"

# 1) Fichiers XML de sauvegarde/transfer
mkdir -p "$RES_XML"

if [ ! -f "$RES_XML/backup_rules.xml" ]; then
  cat > "$RES_XML/backup_rules.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <include domain="file" path="."/>
</full-backup-content>
XML
  echo "  + Created res/xml/backup_rules.xml"
fi

if [ ! -f "$RES_XML/data_extraction_rules.xml" ]; then
  cat > "$RES_XML/data_extraction_rules.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="file" path="."/>
    </cloud-backup>
    <device-transfer>
        <include domain="file" path="."/>
    </device-transfer>
</data-extraction-rules>
XML
  echo "  + Created res/xml/data_extraction_rules.xml"
fi

# 2) Namespace obligatoire dans build.gradle (si manquant)
if ! grep -q '^\s*namespace\s\+"' "$GRADLE_APP"; then
  # Essaie de déduire depuis applicationId, sinon met un défaut
  APP_ID=$(grep -o 'applicationId\s*"\([^"]\+\)"' "$GRADLE_APP" | head -n1 | sed 's/.*"\(.*\)".*/\1/')
  [ -z "$APP_ID" ] && APP_ID="com.afrikoin.myapplication"

  echo "  * 'namespace' absent. Ajout automatique: $APP_ID"
  # insère juste après "android {"
  awk -v ns="$APP_ID" '
    BEGIN {added=0}
    {
      print $0
      if ($0 ~ /^android\s*\{/) {
        print "    namespace \"" ns "\""
        added=1
      }
    }
    END { if(!added) exit 1 }
  ' "$GRADLE_APP" > "$GRADLE_APP.tmp"
  mv "$GRADLE_APP.tmp" "$GRADLE_APP"
fi

# 3) Icônes & strings & thème → on ne créé pas d’assets ici, on vérifie juste
missing=0
for p in \
  "$APP_DIR/src/main/res/mipmap-anydpi-v26/ic_launcher.xml" \
  "$APP_DIR/src/main/res/mipmap-hdpi/ic_launcher.png" \
  "$APP_DIR/src/main/res/values/strings.xml" \
  "$APP_DIR/src/main/res/values/themes.xml" \
  "$APP_DIR/src/main/AndroidManifest.xml"
do
  if [ ! -e "$p" ]; then
    echo "  ! Missing: $p"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "::warning::Certaines ressources semblent manquantes (icônes/strings/thème). Le build peut échouer si le manifest les référence."
fi

echo "==> Auto-fix done"
