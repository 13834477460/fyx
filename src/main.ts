import { createApp } from 'vue'
import pinia from './stores' // store
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue' // 根组件
import router from './router' // 路由
import './styles/index.scss' // 全局的scss
import ElSvg from './components/SvgIcon/ElSvg' // 图标组件,知道就行,不用深究
import './permission' // 路由守卫(登录、权限相关)
import './mock' // 让mock数据起效果

const app = createApp(App)

// 全局注册 CategorySelector 组件
import CategorySelector from '@/components/CategorySelector/index.vue'
app.component('CategorySelector', CategorySelector) // 全局注册
import CommonCard from '@/views/home/components/TopView/components/CommonCard/index.vue'
app.component('CommonCard', CommonCard)
import {vueEcharts} from '@/plugins/echarts'
app.use(vueEcharts)

// 全局注册订单弹框组件
import OrderPupup from '@/components/OrderPup-up/index.vue'
app.component('OrderPup-up', OrderPupup)

import { useUserInfoStore } from './stores/userInfo'
const userInfoStore = useUserInfoStore() // 拿到store
app.directive('permissionBtn', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  // userInfoStore.userInfo.buttons -- 按钮权限数据
  if (!userInfoStore.userInfo.buttons.includes(binding.value)) {
    // el.parentNode?.removeChild(el)
    el?.remove()
  }
})


ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')

// console.log(import.meta)
// console.log(import.meta.env)
// console.log(import.meta.env.VITE_API_URL)
