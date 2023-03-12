<template #default>
  <SidebarItem v-for="item in list" :key="item.name" :item="item"></SidebarItem>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 导入组件
import SidebarItem from './SidebarItem.vue'
// 需求: 把所有的name使用ul li渲染出来
const list = ref([
  {
    id: 1,
    name: '姓名',
    children: [
      {
        id: 2,
        name: '张三',
        children: [
          {
            id: 3,
            name: '李四'
          }
        ]
      },
      {
        id: 4,
        name: '王五'
      }
    ]
  },
  {
    id: 5,
    name: '学校',
    children: [
      {
        id: 6,
        name: '尚硅谷'
      },
      {
        id: 7,
        name: '清华'
      },
      {
        id: 8,
        name: '北大'
      }
    ]
  }
])
</script>

<style scoped></style>
