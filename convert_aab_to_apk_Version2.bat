@echo off
REM ======== CONFIGURATION ========
REM Chemin du fichier .aab
set "AAB_FILE=ton_app.aab"
REM Nom du keystore à créer ou utiliser
set "KEYSTORE=mon_keystore.jks"
REM Alias de la clé
set "ALIAS=mon_alias"
REM Mot de passe du keystore et de la clé
set "PASSWORD=motdepasse"
REM Nom du fichier .apks généré
set "APKS_FILE=mon_app.apks"
REM Nom du fichier universel APK extrait
set "APK_FILE=universal.apk"
REM Chemin de bundletool.jar
set "BUNDLETOOL=bundletool.jar"
REM ===============================

REM 1. Générer un keystore si besoin
if not exist "%KEYSTORE%" (
    echo [1/4] Création du keystore...
    keytool -genkeypair -v -keystore "%KEYSTORE%" -keyalg RSA -keysize 2048 -validity 10000 -alias %ALIAS% -storepass %PASSWORD% -keypass %PASSWORD% -dname "CN=Android,O=Test,C=FR"
) else (
    echo [1/4] Keystore déjà présent.
)

REM 2. Générer l'APK universel
echo [2/4] Conversion du .aab en .apks (APK universel)...
java -jar "%BUNDLETOOL%" build-apks ^
  --bundle="%AAB_FILE%" ^
  --output="%APKS_FILE%" ^
  --mode=universal ^
  --ks="%KEYSTORE%" ^
  --ks-key-alias=%ALIAS% ^
  --ks-pass=pass:%PASSWORD% ^
  --key-pass=pass:%PASSWORD%

REM 3. Extraire l'APK universel
echo [3/4] Extraction de l'APK...
powershell -command "Expand-Archive -Force '%APKS_FILE%' ."
if exist "%APK_FILE%" (
    echo APK extrait avec succès.
) else (
    echo Extraction avec PowerShell échouée, tentative avec 7z...
    if exist "C:\Program Files\7-Zip\7z.exe" (
        "C:\Program Files\7-Zip\7z.exe" e "%APKS_FILE%" "%APK_FILE%" -aoa
    ) else (
        echo Extraction échouée. Installe 7-Zip ou extrait manuellement le fichier universal.apk du .apks.
        pause
        exit /b
    )
)

REM 4. Installer sur l'appareil Android connecté
echo [4/4] Installation sur l'appareil (assure-toi qu'il est connecté en USB et en mode débogage)...
adb install -r "%APK_FILE%"

echo.
echo ======= FINI ! =======
pause