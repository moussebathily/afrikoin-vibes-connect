
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.627c2a1590254f3b8d084e5bbf9c4f69',
  appName: 'AfriKoin - Marché Panafricain',
  webDir: 'dist',
  server: {
    url: 'https://627c2a15-9025-4f3b-8d08-4e5bbf9c4f69.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_FILE,
      keystoreAlias: process.env.ANDROID_KEY_ALIAS,
    },
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Enhanced edge-to-edge configuration for Android 14+
    appendUserAgent: 'AfriKoin/1.0',
    overrideUserAgent: undefined,
    backgroundColor: '#22c55e'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#22c55e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: false, // Updated for edge-to-edge compatibility
      splashImmersive: false, // Updated for modern Android versions
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#22c55e',
      overlaysWebView: true, // Enable for edge-to-edge
    },
  },
};

export default config;
