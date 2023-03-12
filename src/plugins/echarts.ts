import * as $echarts from 'echarts' // 引入原生的echarts
import type { App } from 'vue' // 引入app类型
import VueEcharts from 'vue-echarts' // 引入echarts的vue包

const vueEcharts = function(app: App){
  app.component('v-chart', VueEcharts) // 注册v-chart组件
}

export {
  $echarts, // 原生
  vueEcharts // 函数
}