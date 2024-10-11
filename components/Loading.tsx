import { useColorScheme } from "@/hooks/useColorScheme"
import { useEffect, useState } from "react"
import { ActivityIndicator, DeviceEventEmitter } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'

export default function Loading() {
  const [showed, setShowed] = useState<boolean>()

  const opacity = useSharedValue(0)

  useEffect(() => {
    const subShow = DeviceEventEmitter.addListener('loading.show', () => {
      if (showed) return
      setShowed(true)
      DeviceEventEmitter.emit('loading.showedSetted', showed)
    })
    const emitShowedSetted = (showed: boolean) => { DeviceEventEmitter.emit('loading.showedSetted', showed) }
    const subHide = DeviceEventEmitter.addListener('loading.hide', () => {
      // if (!showed) return
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setShowed)(false)
        runOnJS(emitShowedSetted)(false)
      })
    })
    return () => { subShow.remove(); subHide.remove() }
  }, [opacity, showed])

  useEffect(() => {
    if (showed) {
      opacity.value = withTiming(1, { duration: 200 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showed])

  const opacityAnimatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const colorScheme = useColorScheme()

  return showed ? <Animated.View style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none'
  }}>
    <Animated.View style={[
      { padding: 9.888, backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, .1)' : 'rgba(0, 0, 0, .618)', borderRadius: 100 },
      opacityAnimatedStyle
    ]}>
      <ActivityIndicator size={25.89} color="white" />
    </Animated.View>
  </Animated.View> : null
}

export function showLoading() { DeviceEventEmitter.emit('loading.show') }
export function hideLoading() { DeviceEventEmitter.emit('loading.hide') }