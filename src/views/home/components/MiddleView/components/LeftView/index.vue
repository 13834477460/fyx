<template>
  <v-chart :option="setOption()" autoresize style="height: 300px;"></v-chart>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEchartStore from '@/stores/echart'
const echartStore = useEchartStore();
const props = defineProps<{
  activeIndex: string
}>()

const orderFullYearAxis = computed(() => {
  return echartStore.echartData.orderFullYearAxis
})
const orderFullYear = computed(() => {
  return echartStore.echartData.orderFullYear
})
const userFullYearAxis = computed(() => {
  return echartStore.echartData.userFullYearAxis
})
const userFullYear = computed(() => {
  return echartStore.echartData.userFullYear
})

const setOption = () => ({
  title: {
    text: props.activeIndex == '1' ? '销售趋势' : '访问趋势',
    left: 5,
    top: 20,
    textStyle: {
      fontSize: 14
    }
  },
  xAxis: {
    data: props.activeIndex == '1' ? orderFullYearAxis.value : userFullYearAxis.value
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '20%',
    bottom: '10%',
  },
  yAxis: {},
  tooltip: {
    trigger: 'axis' // 触发方式默认是 'item'
  },
  series: [
    {
      name: props.activeIndex == '1' ? '销售额' : '访问量',
      type: 'bar',
      data: props.activeIndex == '1' ? orderFullYear.value : userFullYear.value,
      barWidth: '30%'
    }
  ]
})

</script>

<style scoped>

</style>