import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

//提示组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 全局样式
import './common/vant.less'

// 编译环境
const isDev = import.meta.env.DEV
//离开提示
if (!isDev) {
  window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault()
    // Chrome requires returnValue to be set.
    event.returnValue = ''
  })
}



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
