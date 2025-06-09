
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.627c2a1590254f3b8d084e5bbf9c4f69',
  appName: 'AfriKoin - Marché Panafricain',
  webDir: 'dist',
  server: {
    url: 'https://627c2a15-9025-4f3b-8d08-4e5bbf9c4f69.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#22c55e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
