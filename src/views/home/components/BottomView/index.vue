<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <KeywordSearch></KeywordSearch>
    </el-col>
    <el-col :span="12">
      <SaleRank></SaleRank>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import KeywordSearch from './components/KeywordSearch/index.vue'
import SaleRank from './components/SaleRank/index.vue'
</script>

<style scoped>

</style>