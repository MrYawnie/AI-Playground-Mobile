import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mryawnie.openai-playground',
  appName: 'OpenAI-playground',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    allowNavigation: ['https://ai-playground-ogdm.onrender.com'],
  }
};

export default config;
