import { Stack } from 'expo-router'
import { WebView, WebViewNavigation } from 'react-native-webview'
import { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BackHandler, Button } from 'react-native'

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
    const { type, payload = {} } = JSON.parse(data) || {};
    const { method, params } = payload;
    console.log('method: ', method, params);
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
              }],
            },
          }),
        )
      }
      if (method === 'wallet_revokePermissions') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'wallet_revokePermissions',
              result: null,
            },
          }),
        )
      }
      method === 'eth_requestAccounts' &&
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_requestAccounts',
              result: [address],
            },
          }),
        );
      if (method === 'eth_accounts') {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_accounts',
              result: [address],
            }
          })
        )
      }
      method === 'eth_chainId' &&
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'eth_chainId',
              result: '0x38',
            },
          }),
        );
      method === 'net_version' &&
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'ethereum',
            payload: {
              id: 'net_version',
              result: '56',
            },
          }),
        );
    }
  };
  const colorScheme = useColorScheme();

  const [canGoBack, setCanGoBack] = useState(false)

  const handleBackPress = () => {
    if (canGoBack && webviewRef.current) {
      webviewRef.current.goBack()
      return true // 防止默认的返回行为
    }
    return false // 允许默认的返回行为
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
  }, [canGoBack])

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack)
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '详情', headerRight: () => {
            return (<Button title='刷新' onPress={() => { webviewRef.current?.reload() }} />)
          },
          gestureEnabled: !canGoBack
        }}
      />
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.voicore.shop/' }}
        style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}
        javaScriptEnabled={true}
        onMessage={handleWebViewMessage}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onNavigationStateChange={onNavigationStateChange}
        allowsBackForwardNavigationGestures={true}

      />
    </>
  );
}


