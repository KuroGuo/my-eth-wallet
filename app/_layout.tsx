import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
// import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { hide, isVisible, useHideAnimation } from 'react-native-bootsplash'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
// import BootSplash from 'react-native-bootsplash'
import Toast from 'react-native-toast-message'
import Loading from '@/components/Loading'
import { isExpoGo } from '@/app'

import { setJSExceptionHandler } from 'react-native-exception-handler';
import { Alert } from 'react-native'

setJSExceptionHandler((e: any, isFatal: any) => {
  if (isFatal) {
    Alert.alert(
      '未预期的错误发生',
      `Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}\r\n\r\n我们将尝试恢复应用。`,
      [{ text: 'OK' }]
    )
  } else {
    console.log(e) // 仅打印错误
  }
}, true)

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

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
