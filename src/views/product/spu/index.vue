<template>
  <div class="spu">
    <el-card class="mb-10">
      <CategorySelector :disabled="showStatus != STATUS.SPULIST"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="showStatus == STATUS.SPULIST" v-model="showStatus" @changeSpuInfo="changeSpuInfo"></SpuList>
      <SpuForm v-if="showStatus == STATUS.SPUFORM" v-model="showStatus" :spuInfo="spuInfo" @changeSpuInfo="changeSpuInfo"></SpuForm>
      <SkuForm v-if="showStatus == STATUS.SKUFORM" v-model="showStatus" :spuInfo="spuInfo" @changeSpuInfo="changeSpuInfo"></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts">
export enum STATUS {
  SPULIST = 1,
  SPUFORM = 2,
  SKUFORM = 3
}
</script>
<script setup lang="ts">
import SpuList from './components/spuList/index.vue' // 主列表
import SpuForm from './components/spuForm/index.vue' // 新增SPU
import SkuForm from './components/skuForm/index.vue' // 新增SKU
import { ref } from 'vue';
import type { SpuModel } from '@/api/spu';

const showStatus = ref(STATUS.SPULIST) // 默认展示主列表


// initSpuInfo 仅仅使用回来初始化一个spu用的
const initSpuInfo = ():SpuModel  => ({
  spuName: '',
  description: '',
  category3Id: undefined, // 三级分类的id两个位置赋值,要么初始化赋值,保存前组装数据赋值
  tmId: undefined,
  spuSaleAttrList: [],
  spuImageList: []
})
const spuInfo = ref<SpuModel>(initSpuInfo()) // 传给子组件
const changeSpuInfo = (spu: SpuModel | undefined) => {
  spuInfo.value = spu ? spu : initSpuInfo(); // 接收到主列表传过来的spu,在传给SpuForm即可
}
</script>

<style scoped>

</style>