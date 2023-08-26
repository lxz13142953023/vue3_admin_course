import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/el-message.css'

// 注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入全局样式
import './styles/index.scss'
const app = createApp(App)

app.use(createPinia())
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
