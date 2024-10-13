import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
// import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import Constants from 'expo-constants'
import { hide, isVisible, useHideAnimation } from 'react-native-bootsplash'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
// import BootSplash from 'react-native-bootsplash'
import Toast from 'react-native-toast-message'
import Loading from '@/components/Loading'

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
  const colorScheme = useColorScheme()

  useEffect(() => {
    // SplashScreen.hideAsync();
    if (!isExpoGo) BootSplash.hide({ fade: true })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ActionSheetProvider useCustomActionSheet={true}>
        <Stack screenOptions={{
          animation: 'ios',
          headerBackTitle: "返回",
          headerTitleAlign: 'center'
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ActionSheetProvider>
      <Loading />
      <Toast visibilityTime={2000} />
    </ThemeProvider>
  )
}
