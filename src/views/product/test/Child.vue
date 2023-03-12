<template>
  <div>
    <h2>子组件</h2>
    <GrandChild></GrandChild>
  </div>
</template>

<script setup lang="ts">
import GrandChild from './GrandChild.vue'

// 结论: scoped 会将样式作用于当前组件和子组件的根标签
// 为什么?
// 不加 scoped,浏览器中的样式
// h2 {
//   color: red;
// }
// 加 scoped,浏览器中的样式
// h2[data-v-3150be79] {
//     color: red;
// }
// ------
</script>

<style scoped>
h2 {
  color: red;
}
</style>