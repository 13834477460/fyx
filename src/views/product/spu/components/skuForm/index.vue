<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      {{ spuInfo.spuName }}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuForm.price" type="number" placeholder="价格(元)"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuForm.weight" type="number" placeholder="重量(千克)"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input v-model="skuForm.skuDesc" type="textarea" rows="3" placeholder="规格描述"></el-input>
    </el-form-item>


    <el-form-item label="平台属性">

      <el-form inline>
        <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
          <el-select v-model="attr.attrIdValId" placeholder="请选择">
            <el-option
              v-for="attrVal in attr.attrValueList"
              :key="attrVal.id"
              :label="attrVal.valueName"
              :value="`${ attr.id }:${ attrVal.id }`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
          <el-select v-model="saleAttr.attrIdValId" placeholder="请选择">
            <el-option
              v-for="saleAttrVal in saleAttr.spuSaleAttrValueList"
              :key="saleAttrVal.id"
              :label="saleAttrVal.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrVal.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </el-form-item>

    <el-form-item label="图片列表">
      
      <el-table :data="spuImageList" border size="small" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"/>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <img :src="row.imgUrl" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row, $index }">
            <el-tag v-if="row.isDefault" type="success" size="small">默认</el-tag>
            <el-button v-else type="primary" size="small" @click="setDefaultHandler(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>      

    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script setup lang="ts">
import { STATUS } from '../../index.vue'
import spuApi, { type SaleAttrModel, type SpuImageModel, type SpuSaleAttrModel, type SpuModel } from '@/api/spu';
import attrApi, { type AttrModel } from '@/api/attr';
import type { SkuModel } from '@/api/sku'
import skuApi from '@/api/sku'
import { onMounted, ref } from 'vue';
import useCategoryStore from '@/stores/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore(); // 拿到categoryStore
const props = defineProps<{
  spuInfo: SpuModel
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void,
  (e: 'changeSpuInfo'): void
}>()
// 取消保存
const cancelSave = () => {
  emits('update:modelValue', STATUS.SPULIST)
  emits('changeSpuInfo')
}
// 保存
const onSave = async () => {
  // 组装数据
  // 组装spuId
  skuForm.value.spuId = props.spuInfo.id
  // 组装tmId
  skuForm.value.tmId = props.spuInfo.tmId
  // 组装三级分类id
  skuForm.value.category3Id = categoryStore.category3Id
  // 组装默认图片
  skuForm.value.skuDefaultImg = spuImageList.value.find(item => item.isDefault)?.imgUrl!
  // 图片列表在表格选中的回调中已经收集了
  // 组装平台属性
  const selAttrList = attrList.value.filter(item => item.attrIdValId) // 过滤出已选择的属性
  skuForm.value.skuAttrValueList = selAttrList.map(item => {
    const [attrId, valueId] = item.attrIdValId?.split(':') as Array<any>
    return {
      attrId,
      valueId,
    }
  })
  // 组装销售属性
  const selSaleAttrList = saleAttrList.value.filter(item => item.attrIdValId)
  skuForm.value.skuSaleAttrValueList = selSaleAttrList.map(item => {
    const [saleAttrId, saleAttrValueId] = item.attrIdValId?.split(':')!
    return {
      saleAttrId,
      saleAttrValueId
    }
  })
  // 发送请求
  try {
    await skuApi.save(skuForm.value)
    ElMessage.success('保存成功')
    cancelSave() // 切换主列表
  } catch (error) {
    ElMessage.error('保存失败')
  }
}






// 初始化收集数据
const initSkuForm = ():SkuModel  => ({
  spuId: undefined,
  tmId: undefined,
  skuName: '',
  price: undefined,
  weight: '',
  skuDesc: '',
  category3Id: undefined,
  skuDefaultImg: '',
  createTime: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
const skuForm = ref<SkuModel>( initSkuForm() )


// 收集图片列表
const handleSelectionChange = (list: SpuImageModel[]) => {
  skuForm.value.skuImageList = list
}
// 默认图片交互
const setDefaultHandler = (row: SpuImageModel) => {
  // 排他思想
  spuImageList.value.forEach(item => item.isDefault = false)
  row.isDefault = true
}


// 平台属性
const attrList = ref<AttrModel[]>([])
const initAttrList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore;
    let result = await attrApi.getAttrInfoList(category1Id!, category2Id!, category3Id as number)
    attrList.value = result
  } catch (error) {
    ElMessage.error('获取平台属性数据失败,请重试')
  }
}
// 销售属性
const saleAttrList = ref<SpuSaleAttrModel[]>([])
const initSaleAttrList = async () => {
  try {
    let result = await spuApi.getSaleAttrListBySpuId(props.spuInfo.id!)
    saleAttrList.value = result;
  } catch (error) {
    ElMessage.error('获取销售属性数据失败,请重试')
  }
}
// 图片列表
const spuImageList = ref<SpuImageModel[]>([])
const initSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageListBySpuId(props.spuInfo.id!)
    spuImageList.value = result;
  } catch (error) {
    ElMessage.error('获取图片列表数据失败,请重试')
  }
}

// 初始化数据
const initData = () => {
  initAttrList(); // 平台属性
  initSaleAttrList(); // 销售属性
  initSpuImageList(); // 图片列表
}

onMounted(() => {
  initData()
})
</script>

<style scoped>

</style>