
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.afrikoin',  // Updated to match AndroidManifest.xml
  appName: 'AfriKoin',
  webDir: 'dist',
  
  server: {
    url: 'https://627c2a15-9025-4f3b-8d08-4e5bbf9c4f69.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    androidScheme: 'https'
  },
  
  // Architecture and Design Metadata for Android Studio Detection
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_FILE,
      keystoreAlias: process.env.ANDROID_KEY_ALIAS,
      releaseType: "APK"
    },
    
    // Architecture metadata for automatic detection
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    
    // Design system configuration
    appendUserAgent: 'AfriKoin-React-Capacitor/1.0',
    backgroundColor: '#22c55e',
    toolbarColor: '#22c55e',
    navigationBarColor: '#ffffff',
    
    // Performance and compatibility
    loggingBehavior: 'debug',
    mixedContentMode: 'compatibility'
  },
  
  // iOS configuration for completeness
  ios: {
    scheme: 'AfriKoin',
    backgroundColor: '#22c55e'
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#22c55e",
      androidSplashResourceName: "splash_screen",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      androidSpinnerStyle: "large"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#22c55e',
      overlay: false,
      // Android 15+ edge-to-edge configuration
      androidForceStatusBarTranslucent: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  },
};

export default config;
