import Taro from '@tarojs/taro'
import { create } from 'dva-core'
import createLoading from 'dva-loading'

let app, store

function createApp(options) {
  app = create(options)
  app.use(createLoading({}))

  // 适配支付宝小程序
  if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
    global = {};
  }

  if (!global.registered) options.models.forEach(model => app.model(model))

  global.registered = true

  app.start()
  store = app._store;
  app.getStore = () => store;
  app.dispatch = store.dispatch
  return app
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch
  }
}
