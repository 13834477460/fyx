<template>
  <CommonCard title="今日订单量" :count="orderToday">
    <template #main>
      <!-- 第二步:准备容器(必须有高度) -->
      <div class="main" ref="mainRef"></div>
    </template>
    <template #bottom>
      <span class="mr-10">昨日销售额</span>
      <span>{{ orderLastDay }}</span>
    </template>
  </CommonCard>
</template>

<script setup lang="ts">
// 第一步:安装
// 引入使用(全局要引入,同时当组件也要引入)
import { $echarts } from '@/plugins/echarts';
import { debounce, throttle } from 'lodash'
import type { EChartsType } from 'echarts';
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import useEchartStore from '@/stores/echart';
const echartStore = useEchartStore()

const orderToday = computed(() => {
  return echartStore.echartData.orderToday
})
const orderLastDay = computed(() => {
  return echartStore.echartData.orderLastDay
})
const orderTrend = computed(() => {
  return echartStore.echartData.orderTrend
})
const orderTrendAxis = computed(() => {
  return echartStore.echartData.orderTrendAxis
})

const initOption = () => ({
  xAxis: {
    data: orderTrendAxis.value,
    show: false
  },
  yAxis: {
    show: false
  },
  tooltip: {},
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  series: [
    {
      type: 'line',
      data: orderTrend.value,
      smooth: true, // 曲线平滑
      itemStyle: { // 代表的是具体数据的某一个点
        // color: "red" // 颜色
        opacity: 0 // 隐藏当前的点
      },
      lineStyle: { // 线样式
        opacity: 0
      },
      areaStyle: { // 折线区域
        color: 'hotpink'
      }
    }
  ]
})

const resizeHandler = debounce(() => {
  myChart.value?.resize()
}, 300)


const mainRef = ref<HTMLDivElement>()
let myChart = ref<EChartsType>()
onMounted(() => {
  
  // 第三步: 创建实例
  myChart.value = $echarts.init(mainRef.value as HTMLDivElement)

  // 第四步: 写入配置项
  myChart.value.setOption( initOption() )

  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})

// 注意: 数据是异步请求拿回来的,需要等数据回来之后在画一次这个图
watch(orderToday, (nval) => {
  if (nval) {
    myChart.value?.setOption( initOption() )
  }
}, { immediate: true })


// 优化点:
// 1. 让图表有响应式
//    当浏览器大小发生变化的时候,让图表也进行响应式
//    当mounted的时候,给窗口加resize事件监听,只要窗口大小发生变化
//    用实例 调用resize方法即可  myChart.value?.resize()
//    注意: 页面销毁的时候,把window的resize事件监听给删掉
// 2. 对于频繁触发函数进行防抖和节流
//    防抖节流的使用场景: 对于频繁触发函数进行防抖和节流,例如:
//    1. 浏览器的 resize 事件(窗口大小改变)
//    2. 滚动条滚动事件 onScroll 事件
//    3. 搜索框联想搜索的时候,也可以使用防抖节流
//    4. 秒杀抢购,点击按钮发送网络请求可以进行防抖或节流
//    什么是防抖?什么是节流?
//    防抖和节流是对函数的防抖和函数的节流
//    防抖: 多次执行变成一次执行
//    节流: 多次执行变成少量执行
//    -----------------------
//    使用lodash中的防抖和节流即可

</script>

<style lang="scss" scoped>
.main {
  height: 50px;
}
</style>