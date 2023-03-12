<template>
  <CommonCard title="交易用户数" :count="orderUser">
    <template #main>
      <v-chart :option="setOption()" autoresize></v-chart>
    </template>
    <template #bottom>
      <span class="mr-10">退货率</span>
      <span>{{ returnRate }}</span>
    </template>
  </CommonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEchartStore from '@/stores/echart';
const echartStore = useEchartStore()

const orderUser = computed(() => {
  return echartStore.echartData.orderUser
})
const returnRate = computed(() => {
  return echartStore.echartData.returnRate
})
const orderUserTrend = computed(() => {
  return echartStore.echartData.orderUserTrend
})
const orderUserTrendAxis = computed(() => {
  return echartStore.echartData.orderUserTrendAxis
})

const setOption = () => ({
  xAxis: {
    data: orderUserTrendAxis.value,
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
      type: 'bar',
      data: orderUserTrend.value,
      barWidth: '50%'
    }
  ]
})

</script>

<style scoped>

</style>