<template>
  <div class="right-view">
    <div class="title">{{ activeIndex == '1' ? '销售排名' : '访问排名' }}</div>
    
    <div class="item" v-for="(item, index) in activeIndex == '1' ? orderRank : userRank" :key="index">
      <div class="idx" :class="{ active: index < 3 }">{{ item.no }}</div>
      <div class="name">{{ item.name }}</div>
      <div class="count">{{ item.count }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEchartStore from '@/stores/echart'
const echartStore = useEchartStore()
const props = defineProps<{
  activeIndex: string
}>()

const orderRank = computed(() => {
  return echartStore.echartData.orderRank
})
const userRank = computed(() => {
  return echartStore.echartData.userRank
})

</script>

<style lang="scss" scoped>
.right-view {
  .title {
    font-size: 14px;
    padding: 40px 0 10px;
  }
  .item {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin: 5px 0;
    .idx {
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      &.active {
        background-color: #333;
        border-radius: 50%;
        color: #fff;
      }
    }
    .name {
      flex: 1;
      margin: 0 10px;
    }
  }
}
</style>