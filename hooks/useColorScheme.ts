import { ColorSchemeName, Platform, useColorScheme as _useColorScheme } from 'react-native'

export function useColorScheme() {
  const colorScheme = _useColorScheme()
  return Platform.select<ColorSchemeName>({ android: colorScheme, ios: colorScheme })
}
