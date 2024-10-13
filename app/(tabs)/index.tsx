import { Image, StyleSheet, Platform, TouchableOpacity, TextInput, Button, Pressable } from 'react-native'

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
        text1: 'IM 已断开',
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

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🌐</ThemedText>
        <ThemedText type="title">DAPP 浏览器</ThemedText>
      </ThemedView>
      <ThemedView>
        <Link href='/details' asChild style={{ borderRadius: 100, overflow: 'hidden' }}>
          <TouchableOpacity activeOpacity={0.618}>
            <ThemedText style={{
              color: 'white', textAlign: 'center', lineHeight: 16 * 2.618, backgroundColor: '#0081f1'
            }}>打开 DAPP 浏览器</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      <ThemedView style={[styles.titleContainer]}>
        <ThemedText type="title">💬</ThemedText>
        <ThemedText type="title">聊天</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedView style={{ flexDirection: 'row', marginBottom: 16, gap: 9.888 }}>
          <ThemedView style={{ flexDirection: 'row', gap: 6.11, flex: 1 }}>
            {users.map(user => <ThemedView style={[
              { borderRadius: 100, flex: 1, overflow: 'hidden' },
              user.userID === currentUser.userID && [{
                backgroundColor: '#0081f1'
              }]
            ]}>
              <Pressable android_ripple={{
                color: 'rgba(255, 255, 255, .382)'
              }} key={user.userID} style={{ flex: 1 }} onPress={() => setCurrentUser(user)}>
                <ThemedText style={[
                  { textAlign: 'center', lineHeight: 16 * 2.618 },
                  user.userID === currentUser.userID && [{ color: 'white' }]
                ]}>{user.userID}</ThemedText>
              </Pressable>
            </ThemedView>)}
          </ThemedView>
          <ThemedView style={{ justifyContent: 'center' }}>
            <Button onPress={e => { if (!chat.isReady()) chat.login(currentUser) }} title='　登录　' />
          </ThemedView>
        </ThemedView>
        <TextInput ref={textInputRef} placeholder='发送消息' style={{
          borderWidth: 2,
          marginBottom: messageList?.length ? 9.888 : undefined,
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
        <ThemedText type="title">🖼</ThemedText>
        <ThemedText type="title">图片浏览</ThemedText>
      </ThemedView>
      <ThemedView style={{ flexDirection: 'row', marginBottom: 100 }}>
        <Link href='/image?id=0' asChild style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/static/2024/08/9/6khmmmou/7a8dafff3ba8f0f0e2dc6e90f6632c10.png'
              style={{ height: 100 }}
            />
          </TouchableOpacity>
        </Link>
        <Link href='/image?id=1' asChild style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/static/2023/12/21/oo0epp62/debox_christmas2023_1703141029261.png'
              style={{ height: 100 }}
            />
          </TouchableOpacity>
        </Link>
      </ThemedView>

    </ParallaxScrollView >
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9.888,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
  }
});
