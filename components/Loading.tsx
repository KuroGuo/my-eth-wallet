import { useEffect, useState } from "react"
import { View, ActivityIndicator, DeviceEventEmitter } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'

export default function Loading() {
  const [showed, setShowed] = useState<boolean>()

  const opacity = useSharedValue(0)

  useEffect(() => {
    const subShow = DeviceEventEmitter.addListener('loading.show', () => {
      setShowed(true)
      opacity.value = withTiming(1, { duration: 200 })
    })
    const subHide = DeviceEventEmitter.addListener('loading.hide', () => {
      opacity.value = withTiming(0, { duration: 200 }, ended => { if (ended) runOnJS(setShowed)(false) })
    })
    return () => { subShow.remove(); subHide.remove() }
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return showed ? <View style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Animated.View style={[{ padding: 9.888, backgroundColor: 'rgba(0, 0, 0, .618)', borderRadius: 100 }, animatedStyle]}>
      <ActivityIndicator size={25.89} color="white" />
    </Animated.View>
  </View > : null
}