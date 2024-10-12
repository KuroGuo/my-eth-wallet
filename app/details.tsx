import { Stack } from 'expo-router'
import { WebView, WebViewNavigation } from 'react-native-webview'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BackHandler, Platform, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import { ethers } from 'ethers'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated'

const address = "0xe0d189e654efaa8b2593738088c2cd307ad98834"
const injectedJavaScript = `
    window.ethereum = {};
    window.ethereum.isMetaMask = true;
    // window.ethereum.isConnected = function() {
    //   console.log('-----------连接成功后调用---------')
    //   return true
    // };
    // window.ethereum.wallet = {};
    window.ethereum.on = function (name) { }
    window.ethereum.removeListener = function (name) { }
    window.ethereum.request = function(args = {}) {
      console.log('---------Dapp交互触发该事件-----------', args)
      const { method, params } = args
            //  alert('request:' +method+', ' +JSON.stringify( params))
      console.log('---------send-----------', method, params)
      return new Promise(function(resolve, reject) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ethereum',
            payload: {
                method: method,
                params: params,
            }
        }));
        document.addEventListener("message", function(event) {
    
          /**
          * wallet端主动调用postMessage触发该事件
          * 将webviewRef.current.postMessage回调的event.data作为Promise的值返回
          */
          const data = JSON.parse(event.data) || {}
          if (data.type === 'ethereum' && data.payload.id === method) {
              if (data.payload.error) {
                  reject(data.payload.error);
              } else {
                  //  alert('resolve: ' + JSON.stringify( data.payload))
                  resolve(data.payload.result);
              }
          }
        }, { once: true })
        window.addEventListener("message", function(event) {
    
          /**
          * wallet端主动调用postMessage触发该事件
          * 将webviewRef.current.postMessage回调的event.data作为Promise的值返回
          */
          const data = JSON.parse(event.data) || {}
          if (data.type === 'ethereum' && data.payload.id === method) {
              if (data.payload.error) {
                  reject(data.payload.error);
              } else {
                  //  alert('resolve: ' + JSON.stringify( data.payload))
                  resolve(data.payload.result);
              }
          }
        }, { once: true })
      })
    }
    // alert(JSON.stringify(window.ethereum))
`

export default function Details() {
  const webviewRef = useRef<WebView>(null)
  const handleWebViewMessage = async function (event: any) {
    /**
    * Dapp端交互调用window.ethereum.request时触发
    * 根据window.ReactNativeWebView.postMessage传递的不同参数，返回对应的结果
    */
    const { data } = event.nativeEvent;
    const { payload = {} } = JSON.parse(data) || {};
    const { method, params } = payload;
    console.log('method: ', method, params)
    if (webviewRef.current) {
      if (method === 'wallet_requestPermissions') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'wallet_requestPermissions',
              result: [{
                parentCapability: 'eth_accounts',
                caveats: [{ type: "restrictReturnedAccounts", value: [address] }]
              }]
            }
          })
        )
      } else if (method === 'wallet_requestPermissions') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'wallet_requestPermissions',
              result: [{
                parentCapability: 'eth_accounts',
                caveats: [{ type: "restrictReturnedAccounts", value: [address] }]
              }]
            }
          })
        )
      } else if (method === 'wallet_revokePermissions') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'wallet_revokePermissions',
              result: null,
            }
          })
        )
      } else if (method === 'eth_requestAccounts') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_requestAccounts',
              result: [address],
            }
          })
        )
      } else if (method === 'eth_accounts') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_accounts',
              result: [address],
            }
          })
        )
      } else if (method === 'eth_chainId') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_chainId',
              result: '0x38',
            }
          })
        )
      } else if (method === 'net_version') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'net_version',
              result: '56',
            }
          })
        )
      } else if (method === 'personal_sign') {
        const wallet = ethers.HDNodeWallet.fromPhrase('urban tag repair noble saddle under income warrior ball brain walnut discover bridge mandate banner double bullet refuse rescue trumpet reopen dress kiss shoot')
        const signature = await wallet.signMessage(ethers.getBytes(params[0]))
        console.log('地址:', wallet.address)
        // console.log('消息:', ethers.getBytes(params[0]).toString())
        console.log('签名:', signature)
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'personal_sign',
              result: signature,
            }
          })
        )
      }
    }
  }
  const colorScheme = useColorScheme()

  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack()
        return true // 防止默认的返回行为
      }
      return false // 允许默认的返回行为
    }
    BackHandler.addEventListener('hardwareBackPress', handler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler)
    }
  }, [canGoBack])

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack)
  }

  const { showActionSheetWithOptions } = useActionSheet()

  const openMenu = () => {
    const options = ['刷新', '复制链接', '取消']
    const cancelButtonIndex = 2

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        textStyle: { flex: 1, textAlign: 'center', color: '#010101' }
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // 处理选项1
            webviewRef.current?.reload()
            break;
          case 1:
            // 处理选项2
            Clipboard.setStringAsync('https://www.voicore.shop/')
            Toast.show({
              type: 'success',
              text1: '已复制链接！',
              position: 'bottom',
              text1Style: { color: '#010101' }
            })
            break;
          case 2:
            // 处理选项3
            console.log('选择了选项3')
            break
        }
      }
    )
  }

  const [pageTransitionEnded, setPageTransitionEnded] = useState<boolean>()
  useEffect(() => {
    const timeout = setTimeout(() => setPageTransitionEnded(true), 350)
    return () => clearTimeout(timeout)
  }, [])
  const [webviewLoaded, setWebviewLoaded] = useState<boolean>()
  const webviewOpacity = useSharedValue(0)
  useEffect(() => {
    if (pageTransitionEnded && webviewLoaded) webviewOpacity.value = withDelay(200, withTiming(1, { duration: 350 }))
  }, [pageTransitionEnded, webviewLoaded, webviewOpacity])

  const [progress, setProgress] = useState<number>(0)

  const progressTimeout = useMemo<{ value: NodeJS.Timeout | undefined }>(() => ({ value: undefined }), [])

  return <>
    <Stack.Screen
      options={{
        title: '详情',
        headerRight: () => (
          <TouchableOpacity onPress={openMenu}>
            <Ionicons name='ellipsis-horizontal' size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        ),
        gestureEnabled: !canGoBack,
        contentStyle: { backgroundColor: colorScheme === 'dark' ? '#111' : '#eee' }
      }}
    />
    {/* <Animated.View style={[
      { flex: 1 },
      useAnimatedStyle(() => ({ transform: [{ scale: webviewOpacity.value }] }))
    ]}> */}
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://www.voicore.shop/me/' }}
      style={{
        flex: 1,
        backgroundColor: Platform.select({ ios: colorScheme === 'dark' ? 'black' : 'white', android: 'white' }),
        display: pageTransitionEnded ? 'flex' : 'none'
      }}
      javaScriptEnabled={true}
      onMessage={handleWebViewMessage}
      injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
      onNavigationStateChange={onNavigationStateChange}
      allowsBackForwardNavigationGestures={true}
      onLoadProgress={(e) => {
        clearTimeout(progressTimeout.value)
        const progress = e.nativeEvent.progress
        progressTimeout.value = setTimeout(() => setProgress(progress), 200)
      }}
      onLoadEnd={() => { setWebviewLoaded(true) }}
      userAgent={Platform.select({
        ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        android: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      })}
      setSupportMultipleWindows={false}
    />
    {/* </Animated.View> */}
    <Animated.View style={[{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
      pointerEvents: 'none'
    }, useAnimatedStyle(() => ({
      opacity: 1 - webviewOpacity.value, display: 1 - webviewOpacity.value ? 'flex' : 'none'
    }))]}></Animated.View>
    <View style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0, display: progress < 1 ? 'flex' : 'none' }}>
      <View style={{ height: '100%', backgroundColor: 'gold', width: `${progress * 100}%` }}></View>
    </View>
  </>
}