<template>
  <div class="home">
    <TopView class="mb-20"></TopView>
    <MiddleView class="mb-20"></MiddleView>
    <BottomView></BottomView>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import TopView from './components/TopView/index.vue'
import MiddleView from './components/MiddleView/index.vue'
import BottomView from './components/BottomView/index.vue'
import { onMounted } from 'vue';
import useEchartStore from '@/stores/echart'
const echartStore = useEchartStore();

onMounted(() => {
  echartStore.getEchartData()
})

</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #ddd; // 背景灰色
  }
</style>
