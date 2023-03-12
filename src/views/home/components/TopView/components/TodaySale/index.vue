<template>
  <CommonCard title="今日销售额" :count="salesToday">
    <template #main>
      <div class="content">
        <span>日同比</span>
        <span class="mr-5 ml-5">{{ salesGrowthLastDay }}</span>
        <span :class="{
          down: salesGrowthLastDay < 0,
          up: salesGrowthLastDay > 0
        }"></span>
      </div>
      <div class="content">
        <span>月同比</span>
        <span class="ml-5 mr-5">{{ salesGrowthLastMonth }}</span>
        <span :class="{
          down: salesGrowthLastMonth < 0,
          up: salesGrowthLastMonth > 0
        }"></span>
      </div>
    </template>
    <template #bottom>
      <span class="mr-10">昨日销售额</span>
      <span>{{ salesLastDay }}</span>
    </template>
  </CommonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEchartStore from '@/stores/echart'
const echartStore = useEchartStore();

const salesToday = computed(() => {
  return echartStore.echartData.salesToday
})
const salesLastDay = computed(() => {
  return echartStore.echartData.salesLastDay
})
const salesGrowthLastDay = computed(() => {
  return echartStore.echartData.salesGrowthLastDay
})
const salesGrowthLastMonth = computed(() => {
  return echartStore.echartData.salesGrowthLastMonth
})

</script>

<style lang="scss" scoped>
.content {
  font-size: 12px;
  color: #888;
  font-weight: 600;
  display: flex;
  align-items: center;
}
</style>