<template>
  <CommonCard title="累计用户数" :count="usersTotal">
    <template #main>
      <v-chart :option="setOption()" autoresize></v-chart>
    </template>
    <template #bottom>
      <div class="bottom">
        <div class="content">
          <span>日同比</span>
          <span class="mr-10 ml-10">{{ userGrowthLastDay }}</span>
          <span :class="{
            up: Number(userGrowthLastDay) > 0,
            down: Number(userGrowthLastDay) < 0
          }"></span>
        </div>
        <div class="content">
          <span>月同比</span>
          <span class="mr-10 ml-10">{{ userGrowthLastMonth }}</span>
          <span :class="{
            up: Number(userGrowthLastMonth) > 0,
            down: Number(userGrowthLastMonth) < 0
          }"></span>
        </div>
      </div>
    </template>
  </CommonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEchartStore from '@/stores/echart';
const echartStore = useEchartStore()

const usersTotal = computed(() => {
  return echartStore.echartData.usersTotal
})
const usersLastDay = computed(() => {
  return echartStore.echartData.usersLastDay
})
const usersLastMonth = computed(() => {
  return echartStore.echartData.usersLastMonth
})
const userGrowthLastDay = computed(() => {
  return echartStore.echartData.userGrowthLastDay
})
const userGrowthLastMonth = computed(() => {
  return echartStore.echartData.userGrowthLastMonth
})


const setOption = () => ({
  xAxis: {
    // type: 'category', // x轴默认是类目轴
    type: 'value', // 需要变成数值轴
    show: false,
    max: usersTotal.value // 设置数值轴的最大值
  },
  yAxis: {
    // type: 'value', // y轴默认是数值轴
    type: 'category', // 需要变成类目轴
    show: false,
  },
  tooltip: {
    // trigger: 'item', // 提示框触发方式默认是 'item'
    trigger: 'axis',
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  series: [
    {
      name: '用户增长量', // 显示在tooltip上
      type: 'bar',
      data: [usersTotal.value - usersLastMonth.value],
      barWidth: '30%', // 柱状图宽度
      itemStyle: { // 某一项样式
        color: 'red'
      },
      showBackground: true, // 展示背景  -  默认false
      label: { // 每个项展示的文本
        show: true, // 默认是false不展示,需要设置成true才能展示
        formatter() { // 展示的具体内容,可以自定义
          return '|'
        },
        color: 'red', // 展示文本的颜色
        position: 'right', // 展示文本相较于 当前柱的位置
        distance: 50 // 文本与柱状图之间的举例
      }
    }
  ]
})

</script>

<style lang="scss" scoped>
.bottom {
  display: flex;
  justify-content: space-between;
  .content {
    display: flex;
    align-items: center;
  }
}
</style>