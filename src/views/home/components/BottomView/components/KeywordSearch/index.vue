<template>
  <el-card>
    <template #header>
      关键词搜索
    </template>

    <el-row :gutter="10">
      <el-col :span="12">
        <div class="content">
          <div class="title">搜索用户数</div>
          <div class="count">{{ userCount }}</div>
          <v-chart class="chart" :option="setOption(1)" autoresize></v-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content">
          <div class="title">搜索量</div>
          <div class="count">{{ totalCount }}</div>
          <v-chart class="chart" :option="setOption(0)" autoresize></v-chart>
        </div>
      </el-col>
    </el-row>

    <el-table :data="tableData" class="mt-10 mb-10">
      <el-table-column label="排名" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="关键字" prop="word" align="center"></el-table-column>
      <el-table-column label="搜索数量" prop="count" align="center"></el-table-column>
      <el-table-column label="搜索用户数" prop="user" align="center"></el-table-column>
      <el-table-column label="搜索占比" prop="percent" align="center"></el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useEchartStore from '@/stores/echart'
import { result } from 'lodash';
const echartStore = useEchartStore();

// 原始数据
const searchWord = computed(() => {
  return echartStore.echartData.searchWord
})
// 搜索总数量
const totalCount = computed(() => {
  let result = searchWord.value.reduce((prev, item) => {
    return prev + item.count
  }, 0)
  return result
})
// 搜索用户总量
const userCount = computed(() => {
  let result = searchWord.value.reduce((prev, item) => {
    return prev + item.user
  }, 0)
  return result
})

// 整理所有的数据列表
const searchWordList = computed(() => {

  let reuslt = searchWord.value.map(item => {
    return {
      ...item,
      percent: (item.user / userCount.value * 100).toFixed(2) + '%'
    }
  })

  total.value = searchWord.value.length // 所有数据的长度就是总条数

  return reuslt
})

// 表格数据
const tableData = computed(() => {
  // Array.property.slice(0, 5)  // 从下标为0的位置开始截取,截取到下标为5的位置,但不包含5这个位置
  // return searchWordList.value.slice(0, 5)   // page -> 1 从下标为0的位置开始截取,截取到下标为5的位置,但不包含5这个位置
  // return searchWordList.value.slice(5, 10)  // page -> 2 从下标为5的位置开始截取,截取到下标为10的位置,但不包含10这个位置
  // return searchWordList.value.slice(10, 15) // page -> 3
  // return searchWordList.value.slice(15, 20) // page -> 4
  return searchWordList.value.slice((page.value - 1) * 5, page.value * 5)
})


// x轴(类目轴的数据 - 两个图都一样)
const axisList = computed(() => {
  return searchWord.value.map(item => item.word)
})
// 左侧图数值轴数据
const userList = computed(() => {
  return searchWord.value.map(item => item.user)
})
// 右侧图数值轴数据
const countList = computed(() => {
  return searchWord.value.map(item => item.count)
})


const setOption = (flag: number) => ({
  xAxis: {
    show: false,
    data: axisList.value // 类目轴数据
  },
  yAxis: {
    show: false,
  },
  tooltip: {
    trigger: 'axis' // 默认是'item'
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  series: [
    {
      name: flag ? '搜索用户数' : '搜索量',
      type: 'line',
      data: flag ? userList.value : countList.value, // 数值轴数据
      itemStyle: {
        opacity: 0
      },
      lineStyle: {
        color: 'hotpink'
      },
      areaStyle: {
        color: 'skyblue'
      },
      smooth: true
    }
  ]
})




const page = ref(1)
const limit = ref(5)
const total = ref(0)
const handleCurrentChange = (val: number) => {
  page.value = val
}


</script>

<style lang="scss" scoped>
.content {
  .title {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 5px;
  }
  .count {
    font-size: 24px;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  .chart {
    height: 50px;
  }
}
</style>