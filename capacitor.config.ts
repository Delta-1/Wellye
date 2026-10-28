import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = { appId: 'com.wellye.app', appName: 'Wellye', webDir: 'dist', server: { androidScheme: 'https' }, plugins: { StatusBar: { style: 'DARK', backgroundColor: '#0c0c18' }, LocalNotifications: { iconColor: '#9b6dff' } } };
export default config;
