pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "afrikoin"

// Map the Android app module to the correct directory
include(":app")
project(":app").projectDir = file("android/app")

// Include Capacitor Android settings so plugins are detected when opening the repo root
apply(from = File("node_modules/@capacitor/android/capacitor.settings.gradle"))
