export default {
  expo: {
    name: 'PocketDex',
    slug: 'pocketdex',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mobile',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bitcode: false,
      bundleIdentifier: 'com.anonymous.pocketdex',
      infoPlist: {
        NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera',
        NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false,
          NSAllowsLocalNetworking: true,
        },
        UIBackgroundModes: ['audio', 'voip'],
        RTCScreenSharingExtension: {
          BundleIdentifier: 'com.anonymous.pocketdex.ScreenShareExtension',
          BundleName: 'ScreenShareExtension'
        }
      },
      associatedDomains: ['applinks:*.livekit.cloud'],
      entitlements: {
        'com.apple.security.application-groups': ['group.com.rf4.pocketdex']
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      permissions: [
        'android.permission.ACCESS_NETWORK_STATE',
        'android.permission.CAMERA',
        'android.permission.INTERNET',
        'android.permission.MODIFY_AUDIO_SETTINGS',
        'android.permission.RECORD_AUDIO',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.WAKE_LOCK',
        'android.permission.BLUETOOTH',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      '@livekit/react-native-expo-plugin',
      '@config-plugins/react-native-webrtc',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      livekitUrl: process.env.LIVEKIT_URL || 'wss://pocketdex-5benn6su.livekit.cloud',
      apiUrl: process.env.API_URL || 'http://localhost:3000',
    },
  },
}; 