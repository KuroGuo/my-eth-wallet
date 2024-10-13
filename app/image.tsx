import { Stack, router } from "expo-router"
import Gallery from "react-native-awesome-gallery"

export default function ImageScreen() {
  return <>
    <Stack.Screen options={{
      animation: 'fade',
      headerShown: false,
      gestureEnabled: false
    }} />
    <Gallery
      data={['https://data.debox.pro/static/2024/08/9/6khmmmou/7a8dafff3ba8f0f0e2dc6e90f6632c10.png', 'https://data.debox.pro/static/2023/12/21/oo0epp62/debox_christmas2023_1703141029261.png']}
      doubleTapInterval={200}
      onTap={router.back}
    />
  </>
}