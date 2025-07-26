# AfriKoin ProGuard Rules
# Architecture: React + Capacitor
# Design System: Material Design 3

# React and JavaScript optimization
-keep class com.facebook.react.** { *; }
-keep class com.getcapacitor.** { *; }

# Material Design Components
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# Architecture Components
-keep class androidx.lifecycle.** { *; }
-keep class androidx.arch.core.** { *; }

# AfriKoin specific classes
-keep class app.lovable.afrikoin.** { *; }

# Keep WebView JavaScript Bridge
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capacitor specific rules
-keep public class * extends com.getcapacitor.Plugin
-keep public class com.getcapacitor.annotation.*

# Keep BuildConfig for architecture detection
-keep class **.BuildConfig { *; }

# Optimization settings
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose