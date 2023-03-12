<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <TodaySale></TodaySale>
    </el-col>
    <el-col :span="6">
      <TodayOrder></TodayOrder>
    </el-col>
    <el-col :span="6">
      <TradeUser></TradeUser>
    </el-col>
    <el-col :span="6">
      <TotalUser></TotalUser>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import TodaySale from './components/TodaySale/index.vue'
import TodayOrder from './components/TodayOrder/index.vue'
import TradeUser from './components/TradeUser/index.vue'
import TotalUser from './components/TotalUser/index.vue'
</script>

<style lang="scss" scoped>
::v-deep(.down) {
  margin-top: 5px;
  border: 5px solid blue;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
::v-deep(.up) {
  margin-top: -4px;
  border: 5px solid red;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
}
</style>