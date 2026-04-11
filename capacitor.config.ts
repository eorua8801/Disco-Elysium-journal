import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.discojounal.app',
  appName: 'Disco Journal',
  webDir: 'dist',
  android: {
    backgroundColor: '#22180a',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
