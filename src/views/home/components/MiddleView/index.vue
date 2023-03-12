<template>
  <el-card>
    <div class="top">
      <el-menu
        :default-active="activeIndex"
        class="menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>

      <el-radio-group v-model="radio" class="mr-20">
        <el-radio-button label="今天" />
        <el-radio-button label="本周" />
        <el-radio-button label="本月" />
        <el-radio-button label="今年" />
      </el-radio-group>

      <el-date-picker
        v-model="value"
        type="daterange"
        unlink-panels
        range-separator="To"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="shortcuts"
      />
    </div>
    
    <el-row>
      <el-col :span="18">
        <LeftView :activeIndex="activeIndex"></LeftView>
      </el-col>
      <el-col :span="6">
        <RightView :activeIndex="activeIndex"></RightView>
      </el-col>
    </el-row>

  </el-card>
</template>

<script setup lang="ts">
import LeftView from './components/LeftView/index.vue'
import RightView from './components/RightView/index.vue'
import { ref } from 'vue'


const value = ref('')
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '上3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const radio = ref('今天')

const activeIndex = ref('1')
const handleSelect = (val: string) => {
  activeIndex.value = val
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #dcdfe6;
  .menu {
    flex: 10;
    border: none;
  }
}
</style>