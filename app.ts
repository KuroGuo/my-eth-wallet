import { DeviceEventEmitter } from 'react-native'

export const loading = (() => {
  return {
    show() { DeviceEventEmitter.emit('loading.show') },
    hide() { DeviceEventEmitter.emit('loading.hide') }
  }
})()