import { Stack, router } from "expo-router"
import Gallery from "react-native-awesome-gallery"
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'

export default function ImageScreen() {
  const params = useLocalSearchParams()

  return <>
    <Stack.Screen options={{
      animation: 'fade',
      headerShown: false,
      gestureEnabled: false
    }} />
    <Gallery
      data={[
        'https://data.debox.pro/im/image/2024/10/13/6khmmmou/96aa8ba44cf7b8a858ae4e2927593904.jpg',
        'https://data.debox.pro/static/2023/03/16/120329_1678973015113.jpg',
        'https://data.debox.pro/im/image/2024/10/14/6khmmmou/2f789606d4940ead7e99eabe60d6bb686645b6f2fcaf8fb4be906d63306d2c35.jpg',
        'https://data.debox.pro/static/2023/07/4/fxi5qm2f/442056db2bed93eea27464b2c324f5b7.jpg',
        'https://data.debox.pro/static/2022/08/11/102785_-1945380697.jpeg'
      ]}
      doubleTapInterval={200}
      onTap={router.back}
      initialIndex={+params.id}
      renderItem={({ item, index, setImageDimensions }: { item: string, index: number, setImageDimensions: Function }) => {
        console.log('renderItem', item)
        return <Image
          source={item}
          contentFit='contain'
          style={{ flex: 1 }}
        />
      }}
    />
  </>
}