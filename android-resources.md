
# Configuration Android pour AfriKoin

## Icônes requises (à placer dans android/app/src/main/res/)

### Icônes d'application (mipmap-*)
- mipmap-mdpi/ic_launcher.png (48x48)
- mipmap-hdpi/ic_launcher.png (72x72)
- mipmap-xhdpi/ic_launcher.png (96x96)
- mipmap-xxhdpi/ic_launcher.png (144x144)
- mipmap-xxxhdpi/ic_launcher.png (192x192)

### Splash screen (drawable-*)
- drawable/splash.png (1080x1920 recommandé)

### Couleurs de thème (values/colors.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#22c55e</color>
    <color name="colorPrimaryDark">#16a34a</color>
    <color name="colorAccent">#fb923c</color>
    <color name="splashBackground">#22c55e</color>
</resources>
```

### Styles (values/styles.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>
    
    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:windowBackground">@drawable/splash</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
```

## Instructions pour générer l'AAB

1. Exportez le projet vers GitHub
2. Clonez le projet localement
3. Exécutez : `npm install`
4. Exécutez : `npm run build`
5. Ajoutez Android : `npx cap add android`
6. Synchronisez : `npx cap sync android`
7. Ouvrez dans Android Studio : `npx cap open android`
8. Dans Android Studio, allez à Build > Generate Signed Bundle/APK
9. Sélectionnez "Android App Bundle"
10. Créez/sélectionnez votre keystore
11. Générez l'AAB pour le Play Store

## Permissions requises (android/app/src/main/AndroidManifest.xml)
- INTERNET
- ACCESS_NETWORK_STATE
- ACCESS_WIFI_STATE
- CAMERA (pour les photos de produits)
- WRITE_EXTERNAL_STORAGE
- ACCESS_FINE_LOCATION (pour la géolocalisation)
