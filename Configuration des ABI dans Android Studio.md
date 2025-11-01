# Configuration des ABI dans Android Studio

Voici la configuration à ajouter à votre fichier `build.gradle` (module: app) pour inclure les ABI **`arm64-v8a`** et **`armeabi-v7a`**.

Cette configuration est essentielle si votre projet utilise le NDK (Native Development Kit) ou des bibliothèques tierces qui contiennent du code natif (fichiers `.so`).

## 1. Pour Groovy DSL (fichier `build.gradle`)

Si votre fichier de configuration utilise la syntaxe Groovy (le plus courant pour les anciens projets), ajoutez le bloc `ndk` à l'intérieur de `defaultConfig` :

```groovy
android {
    // ...
    defaultConfig {
        // ... autres configurations (applicationId, minSdkVersion, etc.)

        ndk {
            // Liste des ABI à inclure dans votre APK/AAB
            abiFilters 'armeabi-v7a', 'arm64-v8a'
        }
    }
    // ...
}
```

## 2. Pour Kotlin DSL (fichier `build.gradle.kts`)

Si votre fichier de configuration utilise la syntaxe Kotlin (le standard pour les nouveaux projets), ajoutez le bloc `ndk` à l'intérieur de `defaultConfig` :

```kotlin
android {
    // ...
    defaultConfig {
        // ... autres configurations (applicationId, minSdkVersion, etc.)

        ndk {
            // Liste des ABI à inclure dans votre APK/AAB
            abiFilters.addAll("armeabi-v7a", "arm64-v8a")
        }
    }
    // ...
}
```

## Explication

*   **`armeabi-v7a`** : Cible les architectures ARM 32 bits. C'est nécessaire pour la compatibilité avec de nombreux appareils plus anciens ou d'entrée de gamme.
*   **`arm64-v8a`** : Cible les architectures ARM 64 bits. C'est l'architecture moderne et obligatoire pour les applications publiées sur Google Play.

En incluant uniquement ces deux-là, vous couvrez la grande majorité des appareils tout en évitant d'inclure les ABI obsolètes (`armeabi`) ou moins courantes (`x86`, `x86_64`), ce qui permet de **réduire la taille de votre fichier APK/AAB**.

Après avoir ajouté ce code, assurez-vous de synchroniser votre projet Gradle en cliquant sur **"Sync Now"** dans Android Studio.
