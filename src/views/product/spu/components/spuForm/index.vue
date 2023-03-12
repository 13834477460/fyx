<template>
  <el-form class="spuform" label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId" placeholder="请选择">
        <el-option v-for="tm in tmList" :key="tm.id" :label="tm.tmName" :value="(tm.id as number)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input v-model="spuForm.description" type="textarea" rows="3" placeholder="SPU描述"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="(spuImageList as any)"
        :action="action"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select v-model="attrIdAttrName" :placeholder="`还有${ saleAttrList.length }个未选择`" class="mr-10">
          <el-option
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="addSaleAttr">添加销售属性</el-button>
      </div>
      <el-table :data="spuForm.spuSaleAttrList" border size="small">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="200" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值列表">
          <template #default="{ row, $index }">

            <!--
              closable tag标签的关闭按钮显示
              :disable-transitions="false"  tag关闭的动画
              @close="handleClose(tag)"  关闭的回调
            -->
            <el-tag
              class="mr-5"
              v-for="(attrVal, index) in row.spuSaleAttrValueList"
              :key="index"
              closable
              @close="handleClose(index, row.spuSaleAttrValueList)"
            >
              {{ attrVal.saleAttrValueName }}
            </el-tag>

            <el-input
              v-if="row.inputVisible"
              ref="InputRef"
              v-model="row.inputValue"
              size="small"
              style="width: 100px"
              @blur="handleInputConfirm(row)"
            />
            <el-button v-else size="small" @click="showInput(row)">
              新增
            </el-button>

          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row, $index }">
            <el-button type="danger" size="small" :icon="Delete" @click="deleteSpuSaleAttr($index)"></el-button>
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
import trademarkApi, { type TrademarkModel } from '@/api/trademark'
import spuApi, { type SaleAttrModel, type SpuModel, type SpuImageModel, type SpuSaleAttrModel, type SpuSaleAttrValueModel } from '@/api/spu'
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage, type UploadProps, type UploadUserFile, type UploadFile, type UploadFiles } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import useCategoryStore from '@/stores/category'
import { cloneDeep } from 'lodash'
const categoryStore = useCategoryStore(); // 三级分类store
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`
const props = defineProps<{ // 编辑的时候接收父组件传过来的spu数据
  spuInfo: SpuModel
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void,
  (e: 'changeSpuInfo'): void // 用来清除父组件中的spuInfo,当点击保存或取消的时候都应该清除
}>()
const cancelSave = () => {
  emits('update:modelValue', STATUS.SPULIST)
  emits('changeSpuInfo')
}


// 保存
const onSave = async () => {
  // 组装数据
  // 三级分类的收集
  spuForm.value.category3Id = categoryStore.category3Id;
  // 图片列表数据收集
  let tempSpuImageList = spuImageList.value.map(item => {
    return {
      imgName: item.name,
      imgUrl: item.imgUrl || item.response.data // 什么时候有response?什么时候没有response?  新增图片都有response,编辑回显的图片都没有response
    }
  })
  spuForm.value.spuImageList = tempSpuImageList as SpuImageModel[];
  // 删除掉 销售属性 row 中的inputVisible 和 inputValue(后端不需要这两个数据,传给后端也没事)
  spuForm.value.spuSaleAttrList.forEach(item => {
    delete item.inputValue
    delete item.inputVisible
  })
  // 简单校验(每个项都有值就通过,没有值给个提示即可)
  const { spuName, description, tmId, category3Id, spuSaleAttrList } = spuForm.value;
  if (   !(spuName && description && tmId && category3Id && spuForm.value.spuImageList.length && spuSaleAttrList.length)   ) {
    ElMessage.error('请检查SPU名称、品牌、描述、三级分类、图片列表和销售属性数据')
    return
  }

  // 发送请求
  try {
    if (spuForm.value.id) { // 有id代表是编辑
      await spuApi.updateSpuInfo(spuForm.value)
    } else { // 没有id代表是新增
      await spuApi.saveSpuInfo(spuForm.value)
    }

    ElMessage.success('保存成功')
    // emits('update:modelValue', STATUS.SPULIST)
    // emits('changeSpuInfo')
    cancelSave()

  } catch (error) {
    ElMessage.error('保存失败,请重试')
  }
}






// 创建收集Spu的数据
const initSpuForm = ():SpuModel  => ({
  spuName: '',
  description: '',
  category3Id: undefined, // 三级分类的id两个位置赋值,要么初始化赋值,保存前组装数据赋值
  tmId: undefined,
  spuSaleAttrList: [],
  spuImageList: []
})
const spuForm = ref<SpuModel>( initSpuForm() )


// 收集销售属性数据
const attrIdAttrName = ref('') // 收集销售属性下拉的id和name
// 添加销售属性
const addSaleAttr = () => {
  if (!attrIdAttrName.value) { // 当下拉框没有数据的时候,不收集
    return
  }

  const [baseSaleAttrId, saleAttrName] = attrIdAttrName.value.split(':');

  // 表格展示的数据是 spuForm.spuSaleAttrList
  spuForm.value.spuSaleAttrList.push({
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: []
  })

  // 清空收集的销售属性
  attrIdAttrName.value = ""
}
// 删除销售属性
const deleteSpuSaleAttr = (index: number) => {
  spuForm.value.spuSaleAttrList.splice(index, 1)
}


// 销售属性值添加/失焦
// 失焦添加
const InputRef = ref<HTMLInputElement>(); // 自动聚焦
const handleInputConfirm = (row: SpuSaleAttrModel) => { // row是当前的销售属性
  // 对空值进行判断,没有值直接切换回来即可
  if (!row.inputValue) {
    row.inputVisible = false
    return
  }
  // 重复

  let isRepate = row.spuSaleAttrValueList.map(item => item.saleAttrValueName).includes(row.inputValue)
  if (isRepate) {
    row.inputVisible = false
    row.inputValue = "" // 数据已经被收集起来了,这里应该清空
    ElMessage.error('输入的内容不能重复,请重新输入')
    return
  }
  row.inputVisible = false // 切换显示div

  // row.spuSaleAttrValueList 销售属性值列表
  row.spuSaleAttrValueList.push({
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.inputValue!
  })

  row.inputValue = "" // 数据已经被收集起来了,这里应该清空
}
// 点击div展示input
const showInput = (row: SpuSaleAttrModel) => { // row是当前的销售属性
  row.inputVisible = true
  nextTick(() => {
    InputRef.value?.focus()
  })
}
// 删除销售属性值
const handleClose = (index: number, spuSaleAttrValueList: SpuSaleAttrValueModel[]) => {
  spuSaleAttrValueList.splice(index, 1)
}




// SPU图片 - 图片列表单独使用一个数据进行收集,最后在保存之前进行[数据组装]即可
const spuImageList = ref<SpuImageModel[]>([]) // 单独收集
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const handlerSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(response, uploadFile, uploadFiles)
  // response 是接口响应的内容
  // uploadFile 是单个文件信息,包括文件名、文件大小等,需要注意的属性有
  //              name 文件名
  //              url 图片路径(目前是本地url)
  //              response 是接口响应的内容
  //              注意: 图片列表数据中单个图片必须要有 name 和 url 两个属性,如果没有,无法预览(这个条件是element规定的)
  // uploadFiles 文件列表,是一个数据,包含多个单个文件
  // 当赋值等号两侧数据的类型不一样的时候,可以使用any进行一下中转
  spuImageList.value = uploadFiles as any;
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  spuImageList.value = uploadFiles as any;
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url! // 预览图片的url赋值,赋值的是单个文件的url属性
  dialogVisible.value = true // 显示弹框
}


// 初始化品牌下拉
const tmList = ref<TrademarkModel[]>([])
const initTrademarkDate = async () => {
  try {
    let result = await trademarkApi.getTrademarkList()
    tmList.value = result;
  } catch (error) {
    ElMessage.error('品牌下拉数据获取失败,请重试')
  }
}
// 初始化销售属性下拉下拉
const baseSaleAttrList = ref<SaleAttrModel[]>([]) // 原始数据
const saleAttrList = computed(() => { // 真正展示的数据,通过计算属性得出
  
  let arr = baseSaleAttrList.value.filter(row => { // row是原始数据中的每个成员 row -> { id: xx, name: xx }

    // 过滤条件: 表格中有当前这个row的name时,应该过滤掉,没有的话应该留下来
    // 去表格中的数据找有没有row这个name
    // spuForm.value.spuSaleAttrList - 表格数据
    // some方法是只要有一个符合回调条件,返回true
    // isExist 为true代表表格存在当前销售属性原始数据 row
    const isExist = spuForm.value.spuSaleAttrList?.some(item => { // item是表格中的每个成员 -> { baseSaleAttrId, saleAttrName, spuSaleAttrValueList }
      return item.saleAttrName == row.name
    })

    // const isExist1 = spuForm.value.spuSaleAttrList.map(item => item.saleAttrName).includes(row.name)

    return !isExist
  })
  
  return arr;
})
const initBaseSaleAttrDate = async () => {
  try {
    let result = await spuApi.getSaleAttrList()
    baseSaleAttrList.value = result;
  } catch (error) {
    ElMessage.error('获取销售属性下拉失败,请重试')
  }
}
// 拿编辑spu的图片列表数据
const initSpuImageData = async () => {
  try {
    let result = await spuApi.getSpuImageListBySpuId(spuForm.value.id!)
    spuImageList.value = result.map(item => {
      return {
        ...item,
        name: item.imgName, // name和url属性是组件预览必要的属性,否则预览不出来
        url: item.imgUrl
      }
    });
  } catch (error) {
    ElMessage.error('获取图片列表数据失败,请重试')
  }
}
// 拿编辑spu销售属性数据
const initSaleAttrData = async () => {
  try {
    let result = await spuApi.getSaleAttrListBySpuId(spuForm.value.id!)
    spuForm.value.spuSaleAttrList = result;
  } catch (error) {
    ElMessage.error('获取销售属性数据失败,请重试')
  }
}

// 初始化数据展示
onMounted(() => {
  initTrademarkDate(); // 初始化品牌下拉
  initBaseSaleAttrDate(); // 初始化销售属性下拉下拉
  if (props.spuInfo.id) { // 有id代表的是编辑
    spuForm.value = cloneDeep(props.spuInfo) // 回显数据 - 这里没有销售属性,需要调接口才能拿到,目前是null
    initSpuImageData(); // 拿编辑spu的图片列表数据
    initSaleAttrData(); // 拿编辑spu销售属性数据
  }
})


// let a: number;
// let b: number | undefined;
// a = b as number;
// a = b!;

// let c: string = '我爱你';
// a = c!; // 这样不行

</script>

<style scoped>

</style>