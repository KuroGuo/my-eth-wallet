import { Image, StyleSheet, TouchableOpacity, TextInput, Button, Pressable } from 'react-native'

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

  const [textInputValue, setTextInputValue] = useState<string>()

  const sendMessage = (text: string) => {
    if (!chat.isReady()) return Toast.show({
      type: 'info',
      text1: '请先登录',
      position: 'top',
      text1Style: { color: '#010101' }
    })
    if (!text) return
    const message = chat.createTextMessage({
      to: users.find(user => user.userID !== currentUser.userID)!.userID,
      conversationType: TencentCloudChat.TYPES.CONV_C2C,
      payload: { text }
    })
    chat.sendMessage(message).then(imResponse => {
      console.log('发送成功', imResponse);
    })
    setMessageList(messageList => [message, ...messageList || []])
    textInputRef.current?.clear()
  }

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
        <ThemedText type="title">🌐 DAPP 浏览器</ThemedText>
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
        <ThemedText type="title">💬 聊天</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedView style={{ flexDirection: 'row', marginBottom: 16, gap: 9.888 }}>
          <ThemedView style={{ flexDirection: 'row', gap: 6.11, flex: 1 }}>
            {users.map(user => <ThemedView key={user.userID} style={[
              { borderRadius: 100, flex: 1, overflow: 'hidden' },
              user.userID === currentUser.userID && [{
                backgroundColor: '#0081f1'
              }]
            ]}>
              <Pressable android_ripple={{
                color: 'rgba(255, 255, 255, .382)'
              }} style={{ flex: 1 }} onPress={() => setCurrentUser(user)}>
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
        <ThemedView style={{
          flexDirection: 'row', gap: 9.888, marginBottom: messageList?.length ? 9.888 : undefined,
        }}>
          <TextInput ref={textInputRef} placeholder='发送消息' style={{
            borderWidth: 1,
            paddingVertical: 6.11,
            paddingHorizontal: 16,
            borderRadius: 100,
            flex: 1
          }} onChangeText={text => { setTextInputValue(text) }} onSubmitEditing={e => {
            sendMessage(e.nativeEvent.text)
          }} cursorColor='black' />
          <ThemedView style={{ justifyContent: 'center' }}>
            <Button onPress={() => { if (textInputValue) sendMessage(textInputValue) }} title='　发送　' />
          </ThemedView>
        </ThemedView>
        <ThemedView>
          {messageList?.map(msg => <ThemedText key={msg.ID}>{msg.payload.text}</ThemedText>)}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🖼 图片浏览</ThemedText>
      </ThemedView>
      <ThemedView style={{ flexDirection: 'row', marginBottom: 100, flexWrap: 'wrap', marginHorizontal: -16 / 0.618 }}>
        <Link href='/image?id=0' asChild style={{ minWidth: '100%', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/im/image/2024/10/13/6khmmmou/96aa8ba44cf7b8a858ae4e2927593904.jpg'
              style={{ aspectRatio: 1 }}
            />
          </TouchableOpacity>
        </Link>
        <Link href='/image?id=1' asChild style={{ minWidth: '45%', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/static/2023/03/16/120329_1678973015113.jpg'
              style={{ aspectRatio: 1 }}
            />
          </TouchableOpacity>
        </Link>
        <Link href='/image?id=2' asChild style={{ minWidth: '45%', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/im/image/2024/10/14/6khmmmou/2f789606d4940ead7e99eabe60d6bb686645b6f2fcaf8fb4be906d63306d2c35.jpg'
              style={{ aspectRatio: 1 }}
            />
          </TouchableOpacity>
        </Link>
        <Link href='/image?id=3' asChild style={{ minWidth: '45%', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/static/2023/07/4/fxi5qm2f/442056db2bed93eea27464b2c324f5b7.jpg'
              style={{ aspectRatio: 1 }}
            />
          </TouchableOpacity>
        </Link>
        <Link href='/image?id=4' asChild style={{ minWidth: '45%', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.618}>
            <Image
              src='https://data.debox.pro/static/2022/08/11/102785_-1945380697.jpeg'
              style={{ aspectRatio: 1 }}
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
