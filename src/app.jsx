import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import Home from '@/pages/home'
import dva from '@/utils/dva'
import {updateWeapp} from '@/utils/tool'
import {setGlobalData} from "@/utils/globalData"
import models from './models'

import './app.less'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})

const store = dvaApp.getStore()

class App extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    pages: [
      'pages/home/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '接机弹幕',
      navigationBarTextStyle: 'black'
    }
  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        Taro.setStorage({key:'system_info', data: res})
      }
    })
    const first_entry_time = Taro.getStorageSync('first_entry_time')
    if (!first_entry_time) { // 表示首次进入
      Taro.setStorageSync('first_entry_time', 1)
    }
    if (first_entry_time >= 1) { // 表示后面再进入
      Taro.setStorageSync('first_entry_time', first_entry_time + 1)
    }
  }

  componentDidShow() {
    setTimeout(() => {
      setGlobalData('positionInWeApp', true)
    }, 2000)
    // 更新应用
    updateWeapp()
  }

  componentWillUnmount() {
    Taro.removeStorageSync('firstIntoCasePage')
    Taro.removeStorageSync('firstIntoServicePage')
  }

  componentDidMount () {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

// 获取进入的场景值，判断用户是否已经使用过小程序
App({
  onLaunch: function(options) {
    console.log(options)
    // 生成 uniqid 用户唯一标识存在storage
    const uniqid = 'd01' + Math.random().toString(35).slice(2, 30);
    Taro.setStorage({key: 'uniqid', data: uniqid})
    const scene = options.scene
    Taro.setStorage({key: 'source_scene', data: scene ? scene : ''})
    const list = [1001, 1027, 1034, 1038, 1089, 1090]
    if (list.indexOf(scene) > -1) {
      Taro.setStorage({ key: 'has_used', data: true })
    } else {
      Taro.setStorage({ key: 'has_used', data: false })
    }
  }
})

Taro.render(<App />, document.getElementById('app'))
