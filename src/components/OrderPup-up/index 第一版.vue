<!-- 此文件用于的单独封装订单签收的弹框 -->

<template>
  <!-- // 在点击签收的时候,就需要发送请求,并且立刻展示数据
// 在弹框表格中,只展示订单id和状态并且 (订单id和状态是需要动态展示的) -->
  <el-dialog v-model="dialogTableVisible" :before-close="handleClose">
    <el-table :data="orderList" border v-loading="loading">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column property="id" label="订单号" align="center" />
      <el-table-column property="orderStatusName" label="操作状态" align="center" />
      <el-table-column property="address" label="失败原因" align="center" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
// 导入ref
import { ref } from 'vue'
// 导入pubsub
import Pubsub from 'pubsub-js'
// 导入类型
import type { orderRecordsModel } from '@/api/order'

// 接收传递过来的参数
defineProps(['loading'])

// 接收传递过来的自定义事件
const emits = defineEmits<{
  (e: 'updateOrderInfoList'): void
}>()

// 对话框关闭前的回调
const handleClose = () => {
  // 对话框关闭之前,将显示和隐藏状态修改
  dialogTableVisible.value = false
  // 对话框关闭之前帮我触发这个自定义事件
  if (orderList.value) {
    emits('updateOrderInfoList')
  }
}

// 此变量用于展示对话框弹框的展示和隐藏
const dialogTableVisible = ref(false)

// 接收
Pubsub.subscribe('isShow', (type: string, val: any) => {
  dialogTableVisible.value = val.value
})

// 声明变量存储
const orderList = ref<orderRecordsModel[]>([])
// 接收
Pubsub.subscribe('orderDetail', (type: string, val: orderRecordsModel[]) => {
  console.log(val)
  // 存储每一个选中的列数据
  orderList.value = val
})
</script>

<style scoped></style>
