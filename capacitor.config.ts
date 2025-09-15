
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.afrikoin',
  appName: 'AfriKoin - Marché Panafricain',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: process.env.NODE_ENV === 'production'
    ? {
        // Production: use local files, no external server
        androidScheme: 'https',
        iosScheme: 'capacitor'
      }
    : {
        // Development: use Lovable preview URL
        url: 'https://627c2a15-9025-4f3b-8d08-4e5bbf9c4f69.lovableproject.com?forceHideBadge=true',
        cleartext: true
      },
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_FILE,
      keystoreAlias: process.env.ANDROID_KEY_ALIAS,
    },
    allowMixedContent: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== 'production'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#f59e0b",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#f59e0b'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
};

export default config;
