<template>
  <div>
    <el-card>
      <!-- 添加 -->
      <el-button type="primary" class="md-10" @click="orderPupShow">签收</el-button>

      <!-- 搜索 -->
      <el-form inline label-width="90px">
        <el-form-item label="交易编号">
          <!-- 收集交易编号数据 -->
          <el-input placeholder="请输入交易编号" v-model="searchForm.outTradeNo" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <!-- 收集收货人数据 -->
          <el-input placeholder="请输入收货人" v-model="searchForm.consignee" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <!-- 收集收货人电话 -->
          <el-input placeholder="请输入收货人电话" v-model="searchForm.consigneeTel" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <!-- 收集收货人地址 -->
          <el-input placeholder="请输入收货地址" v-model="searchForm.deliveryAddress" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <!-- 收集订单状态 -->
          <el-select v-model="searchForm.orderStatus" style="width: 140px">
            <el-option label="已支付" value="PAID"> </el-option>
            <el-option label="未支付" value="UNPAID"> </el-option>
            <el-option label="支付" value="FINISHED"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <!-- <el-input placeholder="创建时间"></el-input> -->
          <el-date-picker
            v-model="searchForm.createTimeBegin"
            type="datetime"
            placeholder="创建时间"
            style="width: 140px"
            @change="getSTimeBegin"
          />
        </el-form-item>
        <el-form-item label="过期时间">
          <!-- <el-input placeholder="过期时间"></el-input> -->
          <el-date-picker
            v-model="searchForm.createTimeEnd"
            type="datetime"
            placeholder="过期时间"
            style="width: 140px"
            @change="getSTimeEnd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetSearchOrderList">重置</el-button>
          <el-button type="primary" @click="searchOrderList">搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单列表数据展示区 -->
      <el-table v-loading="loading" :data="orderInfoList" border stripe @selection-change="handleSelectionChange" size="default">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="80" label="序号" align="center" />
        <el-table-column label="订单号" align="center" width="80" prop="id">
          <template #default="{ row, $index }">
            <el-tag type="success" @click="orderDetail(row)">{{ row.id }}</el-tag>
            <!-- 阻止a标签的默认跳转 -->
            <!-- <a href="javaScript:null" style="color: royalblue" @click="orderDetail(row)">{{ row.id }}</a> -->
          </template>
        </el-table-column>
        <el-table-column label="交易编号" align="center" width="160" prop="outTradeNo" />
        <el-table-column label="订单状态" align="center" width="160" prop="orderStatus" />
        <el-table-column label="金额" align="center" width="80" prop="totalAmount" />
        <el-table-column label="收货人" align="center" width="80" prop="consignee" />
        <el-table-column label="收货人电话" align="center" width="120" prop="consigneeTel" />
        <el-table-column label="收货地址" align="center" prop="deliveryAddress" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <!-- 标签页 : 用来展示订单详情 -->
      <el-tabs type="border-card" class="mt-10">
        <el-tab-pane label="订单详情">
          <el-table border :data="showOrderDetail">
            <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
            <el-table-column label="商品ID" align="center" prop="sourceId"></el-table-column>
            <el-table-column label="商品名称" align="center" prop="skuName"></el-table-column>
            <el-table-column label="商品图片" align="center">
              <template #default="{ row, $index }">
                <el-image :src="row.imgUrl" style="width: 100px; height: 100px"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center" prop="orderPrice"></el-table-column>
            <el-table-column label="数量" align="center" prop="skuNum"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 组件中使用 -->
    <OrderPup-up @updateOrderInfoList="updateOrderInfoList" :params="params" v-if="dialogVisible"></OrderPup-up>
  </div>
</template>

<script setup lang="ts">
// 导入 ref
import { ref, onMounted } from 'vue'
// 导入api
import { orderManageMentInfoList, orderRecieve } from '@/api/order'
// 导入api类型
import type { orderRecordsModel, orderDetailListModel, orderSearch } from '@/api/order'
// 导入转换时间戳的包
import moment from 'moment'

import { ElMessage } from 'element-plus'

// dialog 组件显示与隐藏
const dialogVisible = ref(false)

// 声明一个自定义事件
const updateOrderInfoList = () => {
  // 这里帮我触发从新获取订单列表数据
  // 以此来刷新页面
  // 将组件的显示状态修改
  dialogVisible.value = false
  getOrderInfoList()
}

// 点击多选框触发
const handleSelectionChange = (list: orderRecordsModel[]) => {
  // list 是 点击每一列数据所组成的数组
  ;(params.value.data as orderRecordsModel[]) = list
}

// ----------------------------------------------------- 签收按钮的逻辑

// 点击签收按钮
const orderPupShow = () => {
  dialogVisible.value = true
}

// ----------------------------------------------------- 搜索页面的逻辑

// 初始化搜索表单数据
const initSearchForm = () => ({
  outTradeNo: '', // 订单编号
  consignee: '', // 收货人姓名
  consigneeTel: '', // 收货人电话
  deliveryAddress: '', // 收货人地址
  orderStatus: '', // 订单状态
  createTimeBegin: '', // 创建时间
  createTimeEnd: '' // 过期时间
})

// 声明一个变量,用来存储搜索表单的数据
const searchForm = ref<orderSearch>(initSearchForm())

// 声明一个函数,用于处理过期时间的转换
const getSTimeEnd = async (val: string) => {
  // 将数据进行处理
  searchForm.value.createTimeEnd = moment(val).format('YYYY-MM-DD HH:mm:ss')
}

// 声明一个函数,用于处理创建时间的转换
const getSTimeBegin = async (val: string) => {
  // 将数据进行处理
  searchForm.value.createTimeBegin = moment(val).format('YYYY-MM-DD HH:mm:ss')
}

// 搜索按钮
const searchOrderList = () => {
  // 开启 loading 效果
  loading.value = true
  // 将当前页面改成1
  currentPage.value = 1
  // 发送请求传递参数
  getOrderInfoList()
}

// 重置按钮
const resetSearchOrderList = () => {
  // 开启 loading 效果
  loading.value = true
  // 清除表单数据
  searchForm.value = initSearchForm()
  // 重新获取订单列表数据
  getOrderInfoList()
}

// ----------------------------------------------------- 分页器数据和事件

// 当前在第几页 --> 默认是第一页
const currentPage = ref(1)

// 每页展示多少条数据 -- 默认显示十条
const pageSize = ref(10)

// 总数据
const total = ref(100)

// 分页器上的两个方法 -- > 点击每页展示多少条时触发
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  // 重新定义每页展示多少条数据
  pageSize.value = val
  // 重新发送请求获取订单数据
  getOrderInfoList()
}
// 点击换页时触发
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  // 重新定义当前页码
  currentPage.value = val
  // 重新发送请求获取订单数据
  getOrderInfoList()
}

// ----------------------------------------------------- 订单列表的展示和逻辑

// 声明一个变量 用于开启或取消 loading 效果
const loading = ref(false)

// 声明一个变量,用于存储请求回来的数据 -- > 展示订单列表数据
const orderInfoList = ref<orderRecordsModel[]>([])

// 声明函数用于挂载完成时调用 --> 此函数用于获取表格展示数据
const getOrderInfoList = async () => {
  loading.value = true
  try {
    const result = await orderManageMentInfoList(currentPage.value, pageSize.value, searchForm.value)
    // console.log(result) // 测试
    // 判断
    // if (result.code === 200) {
      // 存储数据
      orderInfoList.value = result.records
      // 存储分页器需要的数据
      total.value = result.total // 总数据
      pageSize.value = result.size // 当前每页展示多少条
      currentPage.value = result.current // 当前页码
      // 当数据展示之后 关闭loading效果
      loading.value = false
      // 原因: 因为在点击id才在订单详情中展示当前列的数据信息, 所以会出现当我们切换页或者点击搜索和重置之后,请求是刷新了
      // 但是订单详情还是之前列数据
      // 如果此时出现一个新的订单数据,或者当搜索重置进行重新获取页面数据之后,就会出现问题

      // 解决: 默认使其展示每页数据中的第一个数据详情
      // 因为每次点击换页或者搜索重置都需要重新获取到订单列表数据
      // 所以将代码放置在这个请求接口函数中
      // 判断当前请求回来的数据判断长度
      if (result.records.length > 0) {
        // 在函数被调用的时候默认展示第一条数据的订单详情数据
        showOrderDetail.value = result.records[0].orderDetailList
      } else {
        // 当搜索数据为空的时候 , 下方订单详情不展示
        showOrderDetail.value = []
      }
    // }
  } catch (error) {
    // 提示
    ElMessage.error('获取订单分页数据失败,请重试')
  }
}

// ----------------------------------------------------- 订单详情的展示和逻辑

// 声明一个变量 用来存储订单详情展示数据
const showOrderDetail = ref<orderDetailListModel[]>([])

// 点击订单号 -- > 将当前这一列数据放在订单详情中展示
const orderDetail = (row: orderRecordsModel) => {
  // 将当前点击的那一列数据的订单详情属性存储起来
  // 用于在订单详情组件中展示
  // if (orderInfoList.length > 0) {
  //   console.log(111)

  //   showOrderDetail.value = orderInfoList[0].orderDetailList
  // }
  showOrderDetail.value = row.orderDetailList
}

// ----------------------------------------------------- 挂载完成时

// 修改思路
// 1. 声明一个数据,用于存储请求地址和子组件中需要使用的数据
// 2. 将数据通过 props 传值的方式给子组件传递过去
// 3. 子组件使用defineProps接收到数据
// 4. 根据传递的数据来控制子组件的结构动态展示
// 5. 在类型上添加两个属性 status 和 reason -- 用于展示成功状态或失败状态和失败原因
// 6. 在组件挂载时调用发送请求
// 7. 使用Promise.all方法 -- 接收一个数组作为参数,且数组中的每一项都是一个 Promise 对象
// dialog 数据显示
const params = ref({
  data: [], // 存储多选框选中的数据
  propField: 'id', // 动态展示数据
  propName: '订单号', // 动态在对话框中展示
  paramsField: 'id', // 根据id取值
  apiFn: orderRecieve // 存储请求地址
})

// 调用api发送请求获取订单分页数据
onMounted(() => {
  // 获取订单分页数据
  getOrderInfoList()
  loading.value = true // 获取订单列表之前开启loading效果
})
</script>

<style scoped></style>
