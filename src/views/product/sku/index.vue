<template>
  <el-card>
    <el-table :data="skuList" border class="mb-10">
      <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row, $index }">
          <el-image :src="row.skuDefaultImg" style="width:100px;height:60px"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{ row, $index }">
          <el-button v-if="row.isSale" type="success" size="small" icon="ele-Top" @click="cancelSale(row)" title="下架"></el-button>
          <el-button v-else type="info" size="small" icon="ele-Bottom" @click="onSale(row)" title="上架"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit" @click="updateSku(row)" title="修改"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" @click="showSkuInfo(row)" title="查看详情"></el-button>
          <el-popconfirm :title="`确认要删除[${ row.skuName }]吗?`" @confirm="deleteSku(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="ele-Delete" title="删除sku"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper"
      :total="total" @current-change="getPage" />


    <el-drawer v-model="isShowSkuInfo" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo?.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo?.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo?.price }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <div v-if="skuInfo?.skuAttrValueList && skuInfo?.skuAttrValueList.length > 0">
            <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo?.skuAttrValueList" :key="value.id">
              {{ value.attrName + '-' + value.valueName }}
            </el-tag>
          </div>
          <div v-else>无</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList"
            :key="value.id">
            {{ value.saleAttrName + '-' + value.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">

          <el-carousel class="sku-carousel" trigger="click" height="400px" style="width: 400px">
            <el-carousel-item v-for="item in skuInfo?.skuImageList" :key="item.id">
              <el-image :src="item.imgUrl" style="width: 100%;height: 100%;"></el-image>
            </el-carousel-item>
          </el-carousel>

        </el-col>
      </el-row>
    </el-drawer>

    <!-- 
      当前页面4个组件没有用到: drawer 抽屉、栅格 row 和 col、carousel 走马灯(轮播图)、el-image(图片)
    -->

  </el-card>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import skuApi,  { type SkuModel, type SkuPageModel } from '@/api/sku'
import { ElMessage } from 'element-plus';

const page = ref(1)
const limit = ref(10)
const total = ref(0)


const isShowSkuInfo = ref(false)
const initSkuForm = (): SkuModel => ({
  spuId: undefined,
  tmId: undefined,
  skuName: '',
  price: undefined,
  skuDesc: '',
  weight: '',
  category3Id: undefined,
  skuDefaultImg: '',
  createTime: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
const skuInfo = ref<SkuModel>(initSkuForm())


// 下架
const cancelSale = async (row: SkuModel) => {
  await skuApi.cancelSale(row.id as number)
  ElMessage.success('下架成功')
  getPage()
}
// 上架
const onSale = async (row: SkuModel) => {
  await skuApi.onSale(row.id as number)
  ElMessage.success('上架成功')
  getPage()
}

// 编辑sku
const updateSku = (row: SkuModel) => {
  ElMessage.success('正在开发中！！！！')
}

// 删除sku
const deleteSku = async (row: SkuModel) => {
  await skuApi.delete(row.id as number)
  getPage()
}

// 显示sku详细信息
const showSkuInfo = async (row: SkuModel) => {
  isShowSkuInfo.value = true
  skuInfo.value = await skuApi.getSkuInfo(row.id as number)
}

const skuList = ref<SkuModel[]>([])
const getPage = async (pager = 1) => {
  try {
    page.value = pager
    const result = await skuApi.getPage(page.value, limit.value)
    skuList.value = result.records
    total.value = result.total
  } catch (error) {
    console.error(error);
    ElMessage.error('获取sku分页数据失败')
  }
}

onMounted(() => {
  getPage()
})

</script>

<style scoped>
/* .sku-carousel >>> .el-carousel__button {
  width: 20px;
  height: 20px;
  background: yellow;
  border-radius: 50%;
} */
</style>

<style lang="scss" scoped>
// 需求: 修改 carousel 组件中分页器的样式,改成小圆点
// 1. 不加scoped(不推荐)
// 2. 深度作用选择器
//    1. css深度作用选择器
//       .a >>> .b { 样式 }
//    2. less深度作用选择器
//        .a /deep/ .b { 样式 }
//        /deep/ .b { 样式 }
//    3. scss和less通用的深度作用选择器
//        .a ::v-deep(.b) { 样式 }   ------ vue3写法
//        ::v-deep(.b) { 样式 }      ------ vue3写法
//        -----------------------------------------
//        .a ::v-deep .b { 样式 }    ------ vue2写法
//        ::v-deep .b { 样式 }       ------ vue2写法


// .sku-carousel ::v-deep(.el-carousel__button) {
//   width: 20px;
//   height: 20px;
//   background: black;
//   border-radius: 50%;
// }

::v-deep(.el-carousel__button) {
  width: 20px;
  height: 20px;
  background: blueviolet;
  border-radius: 50%;
}



// .el-carousel__button {  // .el-carousel__button[data-v-xxxxx] {}
//   width: 20px;
//   height: 20px;
//   background: red;
//   border-radius: 50%;
// }

.el-row{
  height: 40px;
  line-height: 40px;
  .el-col{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-col-5{
    font-size: 20px;
    font-weight: bolder;
    text-align: right;
    margin-right: 20px;
  }
}
</style>

<style lang="scss">
// 不加scoped样式是全局的,可以修改小圆点的样式i,但是会影响到其他页面使用的 carousel
// .el-carousel__button {
//   width: 20px;
//   height: 20px;
//   background: red;
//   border-radius: 50%;
// }
</style>