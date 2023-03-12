<template>
  <div class="spulist">
    <el-button class="mb-10" type="primary" :icon="Plus" :disabled="!categoryStore.category3Id" @click="addSpu">添加SPU</el-button>
    
    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Plus" size="small" title="新增SKU" @click="addSku(row)"></el-button>
          <el-button type="warning" :icon="Edit" size="small" title="修改SPU" @click="editSpu(row)"></el-button>
          <el-button type="info" :icon="InfoFilled" size="small" title="查看SKU列表" @click="showSkuList(row)"></el-button>
          
          <el-popconfirm :title="`确认要删除[${ row.spuName}]吗?`" @confirm="deleteSpu(row)">
            <template #reference>
              <el-button type="danger" :icon="Delete" size="small" title="删除SPU"></el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="title"
      v-model="isShow"
      width="80%"
    >
      <el-table :data="skuList" size="small">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template #default="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus, InfoFilled } from '@element-plus/icons-vue'
import { ref, watch } from 'vue';
import { STATUS } from '../../index.vue'
import spuApi, { type SpuModel } from '@/api/spu'
import skuApi, { type SkuModel } from '@/api/sku'
import useCategoryStore from '@/stores/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore() // 拿到store

const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void
  (e: 'changeSpuInfo', spu: SpuModel): void
}>()
// 新增spu
const addSpu = () => {
  emits('update:modelValue', STATUS.SPUFORM)
}

// 新增sku
const addSku = (row: SpuModel) => {
  emits('update:modelValue', STATUS.SKUFORM)
  emits('changeSpuInfo', row) // 传要修改的spu数据
}

// 编辑spu
const editSpu = (row: SpuModel) => {
  emits('changeSpuInfo', row) // 传要修改的spu数据
  emits('update:modelValue', STATUS.SPUFORM) // 切换页面
}

// 删除spu
const deleteSpu = async (row: SpuModel) => {
  // 调用接口
  try {
    await spuApi.deleteSpu(row.id!)
    ElMessage.success('删除成功')
    getPage() // 重新获取数据
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 查看当前spu下的sku列表
const isShow = ref(false) // 控制弹框的显示和隐藏
const title = ref('')
const skuList = ref<SkuModel[]>([]) // 用来展示表格的数据
const showSkuList = async (row: SpuModel) => {
  // 拿数据
  try {
    let result = await skuApi.findBySpuId(row.id!)
    skuList.value = result;
    title.value = `查看[${ row.spuName }]的SKU列表`
    isShow.value = true;
  } catch (error) {
    ElMessage.error('获取sku列表数据失败,请重试')    
  }
}


// 分页
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const handleSizeChange = (val: number) => { // 改变每页条数
  // 组装数据
  limit.value = val;
  // 发送请求
  getPage()
}
const handleCurrentChange = (val: number) => { // 翻页
  // 组装数据
  page.value = val;
  // 发送请求
  getPage()
}



const getPage = async () => {
  try {
    let result = await spuApi.getPage(page.value, limit.value, categoryStore.category3Id as number)
    spuList.value = result.records;
    total.value = result.total;
  } catch (error) {
    ElMessage.error('获取SPU列表数据失败,请重试')
  }
}

// 监听三级id的值,拿数据
const spuList = ref<SpuModel[]>([]) // 存放展示spu列表的数据
watch(() => categoryStore.category3Id, (nval) => {
  if (nval) {
    // 拿数据
    getPage();
  } else {
    // 清数据
    spuList.value = []
  }
}, { immediate: true })

</script>

<style scoped>

</style>