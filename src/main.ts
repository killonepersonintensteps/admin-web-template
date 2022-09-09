/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-08-31 16:06:22
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-08 09:58:31
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import i18n from './locales/index'
import inComponents from '@/components/Index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import '@/assets/icon-font/iconfont.js'
import 'normalize.css'
import { Notification, MessageBox } from '@/utils/Notification'
import { useCommonStore } from '@/store/common'

const render = () => {
  const app = createApp(App)
  app.config.globalProperties.$notice = Notification
  app.config.globalProperties.$inMessageBox = MessageBox
  app.config.globalProperties.isMicroApp = window.__POWERED_BY_QIANKUN__
  app.use(createPinia()).use(router).use(inComponents).use(ElementPlus).use(i18n).mount('#indata-app')
  return app
}
// 如果子应用和基座项目的访问ip不同，qiankun可以动态的改变子应用的ip
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line camelcase
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

if (!window.__POWERED_BY_QIANKUN__) {
  // TODO: 优化到挂载顺序
  const app = render()
  //   const commonStore = useCommonStore()
  //   app.use(VForm3, commonStore.token)
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  // console.log('%c indata子应用bootstrap', 'color: green; font-size: 20px')
}

/** 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法 */
export async function mount(props) {
  const app = render()
  props.onGlobalStateChange((state, prev) => {
    const commonStore = useCommonStore()
    commonStore.token = state.token
  }, true)

  window.setGlobalState = props.setGlobalState
  // 主应用的 emmit
  window.deliveryEmmiter = props.deliveryEmmiter
}

/** 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例 */
export async function unmount(props) {
  // console.log('%c indata子应用 unmount', 'color: green; font-size: 20px')
}
