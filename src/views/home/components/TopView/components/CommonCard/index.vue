<template>
  <el-card>
    <div class="title">{{ title }}</div>
    <div class="count">{{ count }}</div>
    <div class="main">
      <slot name="main"></slot>
    </div>
    <div class="line"></div>
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  count: number
}>()
</script>

<style lang="scss" scoped>
.title {
  font-size: 12px;
  color: #ccc;
}
.count {
  font-size: 26px;
  margin-top: 5px;
  letter-spacing: 1px;
}
.main {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around; // 均匀分布
}
.line {
  width: 100%;
  height: 2px;
  background-color: #aaa;
  margin: 10px 0;
}
.bottom {
  font-size: 12px;
  color: #ccc;
}
</style>