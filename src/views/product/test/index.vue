<template>
  <div>
    <h2>祖先组件</h2>
    <Child></Child>
  </div>
</template>

<script setup lang="ts">
import Child from './Child.vue'
</script>

<style scoped>
h2 {
  color: pink;
}
</style>