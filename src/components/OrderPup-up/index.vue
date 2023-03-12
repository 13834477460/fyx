<!-- 此文件用于的单独封装订单签收的弹框 -->

<template>
  <!-- // 在点击签收的时候,就需要发送请求,并且立刻展示数据
// 在弹框表格中,只展示订单id和状态并且 (订单id和状态是需要动态展示的) -->
  <el-dialog v-model="dialogTableVisible" :before-close="handleClose">
    <el-table :data="params.data" border v-loading="loading">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column :property="params.propField" :label="params.propName" align="center" />
      <el-table-column label="操作状态" align="center">
        <template #default="{ row, $index }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败原因" align="center">
        <template #default="{ row, $index }">
          <span>{{ row.reason }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
// 导入ref
import { ref, onMounted } from 'vue'

// 接收传递过来的参数
const props = defineProps(['params'])

// 接收传递过来的自定义事件
const emits = defineEmits<{
  (e: 'updateOrderInfoList'): void
}>()

// 对话框关闭前的回调
const handleClose = () => {
  // 对话框关闭之前,将显示和隐藏状态修改
  dialogTableVisible.value = false
  // 对话框关闭之前帮我触发这个自定义事件
  emits('updateOrderInfoList')
}

// 此变量用于展示对话框弹框的展示和隐藏
const dialogTableVisible = ref(true)
// 此变量用于开启loading效果
const loading = ref(false)

// 声明一个函数,用于发送请求
const orderSign = async () => {
  // 请求发送之前开启loading效果
  if (props.params.data.length > 0) {
    loading.value = true
    try {
      // Promise.all方法接收的参数是一个数组，数组中的每一项是一个个的Promise对象
      await Promise.all(
        // 在
        props.params.data.map(async (item: any) => {
          try {
            // props.params.apiFn 是提前存储好的请求地址
            // item[props.params.paramsField] 是根据当前每一个选中状态的数据中的id来取值
            const res = await props.params.apiFn(item[props.params.paramsField])
            // console.log(res)
            // if (res.code === 200) {
              item.status = '成功'
            // }
          } catch (error) {
            item.status = '失败'
            item.reason = error
          }
          // 同样关闭loading效果
          loading.value = false
        })
      )
    } catch (error) {
      // 同样关闭loading效果
      loading.value = false
    }
  }
}

// 在页面挂载完成时发送请求
onMounted(() => {
  // 调用发送请求的方法
  orderSign()
})
</script>

<style scoped></style>
