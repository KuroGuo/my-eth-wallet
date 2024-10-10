import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
// import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import Constants from 'expo-constants'
import { hide, isVisible, useHideAnimation } from 'react-native-bootsplash'
import { Ionicons } from '@expo/vector-icons';
// import BootSplash from 'react-native-bootsplash'

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

const isExpoGo = Constants.appOwnership === 'expo'

if (!isExpoGo) {
  var BootSplash: {
    hide: typeof hide
    isVisible: typeof isVisible
    useHideAnimation: typeof useHideAnimation
  } = require("react-native-bootsplash")
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync();
      if (!isExpoGo) BootSplash.hide({ fade: true })
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        animation: 'ios',
        headerBackTitle: "返回",
        headerTitleAlign: 'center'
      }}>
        <Stack.Screen name="(tabs)" options={{
          headerShown: false
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  )
}
