import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.627c2a1590254f3b8d084e5bbf9c4f69',
  appName: 'afrikoin',
  webDir: 'dist',
  server: {
    url: 'https://627c2a15-9025-4f3b-8d08-4e5bbf9c4f69.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff'
  },
  ios: {
    backgroundColor: '#ffffff'
  }
};

export default config;