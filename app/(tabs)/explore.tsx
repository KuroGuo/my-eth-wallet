import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">你好世界 👋</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">第 1 步：试一试</ThemedText>
        <ThemedText>
          编辑 <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> 以查看更改。
          按下{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          打开开发者工具。
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">第 2 步：探索</ThemedText>
        <ThemedText>
          点击探索选项卡，了解更多关于这个入门应用包含的内容。
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">第 3 步：重新开始</ThemedText>
        <ThemedText>
          当你准备好时，运行{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> 以获得一个全新的{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> 目录。这将把当前的{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> 移动到{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>。
        </ThemedText>
      </ThemedView>
      <ThemedText>版本 0.0.5</ThemedText>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">探索</ThemedText>
      </ThemedView>
      <ThemedText>这个应用包含示例代码，帮助你快速入门。</ThemedText>
      <Collapsible title="基于文件的路由">
        <ThemedText>
          这个应用有两个屏幕：
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> 和 <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText> 中的布局文件设置了标签导航器。
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">了解更多</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android、iOS 和 web 支持">
        <ThemedText>
          你可以在 Android、iOS 和 web 上打开这个项目。要打开 web 版本，在运行此项目的终端中按{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText>。
        </ThemedText>
      </Collapsible>
      <Collapsible title="图片">
        <ThemedText>
          对于静态图片，你可以使用 <ThemedText type="defaultSemiBold">@2x</ThemedText> 和{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> 后缀来为不同的屏幕密度提供文件
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">了解更多</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="自定义字体">
        <ThemedText>
          打开 <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> 查看如何加载{' '}
          <ThemedText>
            自定义字体，比如这个字体。
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">了解更多</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="亮色和暗色模式组件">
        <ThemedText>
          这个模板支持亮色和暗色模式。<ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> 钩子让你可以检查用户当前的颜色方案，从而调整 UI 颜色。
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">了解更多</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="动画">
        <ThemedText>
          这个模板包含了一个动画组件的示例。<ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> 组件使用强大的 <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> 库来创建一个挥手动画。
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              组件为头部图像提供了视差效果。
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  }
})