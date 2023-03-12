<template>
  <el-form inline :disabled="disabled">
    <el-form-item label="一级分类">
      <el-select v-model="categoryStore.category1Id" placeholder="请选择" @change="categoryStore.getCategory2List">
        <el-option
          v-for="c1 in categoryStore.category1List"
          :key="c1.id"
          :label="c1.name"
          :value="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="categoryStore.category2Id" placeholder="请选择" @change="categoryStore.getCategory3List">
        <el-option
          v-for="c2 in categoryStore.category2List"
          :key="c2.id"
          :label="c2.name"
          :value="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="categoryStore.category3Id" placeholder="请选择">
        <el-option
          v-for="c3 in categoryStore.category3List"
          :key="c3.id"
          :label="c3.name"
          :value="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/stores/category'
const categoryStore = useCategoryStore()

defineProps<{
  disabled: boolean
}>()

onMounted(() => {
  categoryStore.getCategory1List()
})

</script>

<style scoped>

</style>