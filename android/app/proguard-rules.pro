# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Capacitor specific rules
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.plugins.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.PluginMethod <methods>;
}

# Ionic Native
-keep class org.apache.cordova.** { *; }
-keep class org.crosswalk.engine.** { *; }
-keep class cordova.** { *; }

# WebView & JavaScript Interface
-keep class android.webkit.JavascriptInterface { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep all classes that might be referenced from WebView
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Enhanced rules for hybrid apps - more conservative
-dontwarn **

# Keep critical JavaScript interfaces for Capacitor
-keep class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep all Capacitor plugin classes and methods
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.plugins.** { *; }

# Keep React/JavaScript bridge classes
-keepclassmembers class * {
    @com.getcapacitor.annotation.CapacitorPlugin *;
    @com.getcapacitor.PluginMethod *;
}

# Preserve all public classes and methods for hybrid app compatibility
-keep public class * {
    public protected *;
}

# Conservative optimization for hybrid apps
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*,!class/unboxing/enum
-optimizationpasses 3
-dontpreverify

# Keep native method names
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enum values
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Performance optimizations for WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# Network and HTTP optimizations
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**

# Gson/JSON serialization
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Remove unused resources
-keepresources string/app_name
-keepresources drawable/ic_launcher*
-keepresources mipmap/ic_launcher*

# Keep all classes that might be used by JavaScript
-keep class **.R$* {
    public static <fields>;
}

# Keep all classes with @JavascriptInterface annotation
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep React Native/Capacitor specific classes
-keep class com.facebook.react.** { *; }
-keep class com.swmansion.** { *; }

# Keep all enum values and methods
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep all classes that extend WebViewClient and WebChromeClient
-keep class * extends android.webkit.WebViewClient { *; }
-keep class * extends android.webkit.WebChromeClient { *; }

# Less aggressive obfuscation for hybrid apps
-renamesourcefileattribute SourceFile
-dontobfuscate