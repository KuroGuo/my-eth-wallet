import TencentCloudChat from '@tencentcloud/chat'
import TIMUploadPlugin from 'tim-upload-plugin'
import NetInfo from '@react-native-community/netinfo'

let options = {
  SDKAppID: 1600056404 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TencentCloudChat.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
const chat = TencentCloudChat.create(options) // SDK 实例通常用 chat 表示

chat.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用

// 注册腾讯云即时通信富媒体资源上传插件
chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
// 注册网络监听插件
chat.registerPlugin({ 'chat-network-monitor': NetInfo })

export default chat