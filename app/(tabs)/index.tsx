import { Image, StyleSheet, Platform, TouchableOpacity, Text, TextInput, View, Button } from 'react-native'

import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Link } from 'expo-router'
import chat from '@/chat'
import { useEffect, useMemo, useRef, useState } from 'react'
import TencentCloudChat from '@tencentcloud/chat'
import Toast from 'react-native-toast-message'

export default function HomeScreen() {
  const [messageList, setMessageList] = useState<any[]>()

  const textInputRef = useRef<TextInput>(null)

  const users = useMemo(() => ([{
    userID: 'User 1',
    userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqHFqUUKhlCZ4pTsxIKCzBQlK0MzAwMDUzMTAxOITGpFQWZRKlDc1NTUCCgFES3JzAWJmRtZWBiYmltYQk3JTAca7OSRnWaRbxZWYZllbOBrkhajH6Of75*aWqIdmVWibehU6huQUWBWUeVo4OqWb6tUCwB5YDF8',
  }, {
    userID: 'User 2',
    userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqHFqUUKRlCZ4pTsxIKCzBQlK0MzAwMDUzMTAxOITGpFQWZRKlDc1NTUCCgFES3JzAWJmRtZWBiYmluaQU3JTAcaHBJhnldiaKntF*nk7ptkGOYfkaZtEuXjVxGj71WZ4uIUnJcdmFGUHBxpGaOfbqtUCwBwnzFa',
  }]), [])
  const [currentUser, setCurrentUser] = useState(users[0])

  useEffect(() => {
    const onMessageReceived = (e: any) => {
      // event.data - 存储 Message 对象的数组 - [Message]
      // Message 数据结构详情请参考 https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html
      console.log('onMessageReceived', e)
      setMessageList(messageList => [...e.data, ...messageList || []])
    }

    const onReady = () => {
      chat.getMessageList({ conversationID: `C2C${users.find(user => user.userID !== currentUser.userID)!.userID}` }).then(imResponse => {
        const messageList = imResponse.data.messageList; // 消息列表。
        // const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
        // const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。

        console.log('messageList', JSON.stringify(messageList, null, 2))
        setMessageList(messageList.reverse())

        requestIdleCallback(() => {
          Toast.show({
            type: 'success',
            text1: 'IM 已连接',
            position: 'top',
            text1Style: { color: '#010101' }
          })
        })
      })
      chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived)
    }
    const onNotReady = () => {
      Toast.show({
        type: 'error',
        text1: 'IM 连接已断开',
        position: 'top',
        text1Style: { color: '#010101' }
      })
    }
    chat.on(TencentCloudChat.EVENT.SDK_READY, onReady)
    chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, onNotReady)

    return () => {
      chat.off(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived)
      chat.off(TencentCloudChat.EVENT.SDK_READY, onReady)
      chat.off(TencentCloudChat.EVENT.SDK_NOT_READY, onNotReady)
    }
  }, [currentUser, users])

  useEffect(() => { if (chat.isReady()) chat.logout() }, [currentUser])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView>
        <Link href='/details' asChild style={{ borderRadius: 100, overflow: 'hidden' }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Text style={{
              color: 'white', textAlign: 'center', lineHeight: 35.776, backgroundColor: '#0081f1'
            }}>DAPP 浏览器</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>
      <Link href='/image' asChild>
        <TouchableOpacity activeOpacity={0.618}>
          <Image
            src='https://data.debox.pro/static/2024/08/9/6khmmmou/7a8dafff3ba8f0f0e2dc6e90f6632c10.png'
            style={{ width: 200, height: 100 }}
          />
        </TouchableOpacity>
      </Link>
      <ThemedView>
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 9.888 }}>
          {users.map(user => <TouchableOpacity key={user.userID} style={[
            {
              paddingVertical: 9.888,
              paddingHorizontal: 16,
              flex: 1
            },
            user.userID === currentUser.userID && [{
              backgroundColor: '#0081f1',
              borderRadius: 100
            }]
          ]} activeOpacity={0.618} onPress={() => setCurrentUser(user)}>
            <Text style={[
              { textAlign: 'center' },
              user.userID === currentUser.userID && [{ color: 'white' }]
            ]}>{user.userID}</Text>
          </TouchableOpacity>)}
          <View style={{ justifyContent: 'center' }}>
            <Button onPress={e => { if (!chat.isReady()) chat.login(currentUser) }} title='登录' />
          </View>
        </View>
        <TextInput ref={textInputRef} placeholder='发送消息' style={{
          borderWidth: 2,
          marginBottom: 9.888,
          paddingVertical: 6.11,
          paddingHorizontal: 9.888
        }} onEndEditing={e => {
          if (!chat.isReady()) return
          const message = chat.createTextMessage({
            to: users.find(user => user.userID !== currentUser.userID)!.userID,
            conversationType: TencentCloudChat.TYPES.CONV_C2C,
            payload: { text: e.nativeEvent.text }
          })
          chat.sendMessage(message).then(imResponse => {
            console.log('发送成功', imResponse);
          })
          setMessageList(messageList => [message, ...messageList || []])
          textInputRef.current?.clear()
        }}></TextInput>
        {messageList?.map(msg => <ThemedText key={msg.ID}>{msg.payload.text}</ThemedText>)}
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">欢迎光临</ThemedText>
        <ThemedText type="title">👋</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <ThemedText>v 0.0.3</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
  }
});
