<template>
  <div class="spu">
    <el-card class="mb-10">
      <CategorySelector :disabled="showStatus != 1"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="showStatus == 1" @updateShowStatus="showStatus = $event"></SpuList>
      <!-- <SpuForm v-if="showStatus == 2" @updateShowStatus="showStatus = $event"></SpuForm>
      <SkuForm v-if="showStatus == 3" @updateShowStatus="showStatus = $event"></SkuForm> -->
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SpuList from './components/spuList/index.vue' // 主列表
import SpuForm from './components/spuForm/index.vue' // 新增SPU
import SkuForm from './components/skuForm/index.vue' // 新增SKU
import { ref } from 'vue';

const showStatus = ref(1) // 默认展示主列表

// const updateShowStatus = (n: number) => {
//   showStatus.value = n;
// }

</script>

<style scoped>

</style>