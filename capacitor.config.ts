import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.dailymass.companion',
  appName: 'Daily Mass Companion',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e3a8a'
    }
  }
};

export default config;