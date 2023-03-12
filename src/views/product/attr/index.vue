<template>
  <div class="attr">
    <el-card class="mb-10">
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>
    <el-card>
      <!-- 列表展示 -->
      <div class="list" v-if="!isEdit">
        <el-button class="mb-10" type="primary" :icon="Plus" :disabled="!categoryStore.category3Id" @click="isEdit = true">添加属性</el-button>

        <el-table :data="attrList" border>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名" width="160" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <template #default="{ row, $index }">

              <el-tag
                class="mr-5"
                v-for="item in row.attrValueList"
                :key="item.id"
                type="success"
                size="small"
              >{{ item.valueName }}</el-tag>
              
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row, $index }">
              <el-button type="warning" size="small" :icon="Edit" @click="editAttr(row)"></el-button>
              

              <el-popconfirm :title="`确认要删除[${ row.attrName }]吗?`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>


            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 新增编辑 -->
      <div class="edit" v-else>
        <el-form inline>
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <div class="mb-10">
          <el-button type="primary" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
          <el-button @click="isEdit = false">取消</el-button>
        </div>
        <el-table :data="attrForm.attrValueList" border class="mb-10">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称" prop="valueName">
            <template #default="{ row, $index }">
              <el-input v-if="row.inputVisible" v-model="row.valueName" size="small" @blur="inputBlur(row, $index)" ref="inputRef"></el-input>
              <div v-else @click="clickHandler(row)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row, $index }">
              <el-button type="danger" size="small" :icon="Delete" @click="deleteAttrValue($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-button type="primary" @click="onSave" :disabled="!(attrForm.attrName && attrForm.attrValueList.length)">保存</el-button>
          <el-button @click="cancelSave">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import attrApi, { type AttrModel, type AttrValueModel } from '@/api/attr'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref, watch, nextTick } from 'vue';
import useCategoryStore from '@/stores/category'
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash';
const categoryStore = useCategoryStore()

const isEdit = ref(false); // 默认不是编辑状态,是列表展示状态


const inputRef = ref<HTMLInputElement>()

// input框切换显示
const inputBlur = (row: AttrValueModel, index: number) => {
  // 需要判断input输入的有没有内容,如果没有内容,该数据不应该存在
  if (!row.valueName) {
    attrForm.value.attrValueList.splice(index, 1)
    ElMessage.error('输入内容不能空')
    return
  }
  // 去重
  // attrForm.value.attrValueList  中 查找 有没有和当前 row.valueName 相同的
  // isRepeat 是否有重复(需要把自己排除掉)
  const isRepeat = attrForm.value.attrValueList.some((item, idx) => {
    if (index === idx) { // 代表是自己,把自己排除掉
      return false
    }
    return item.valueName === row.valueName
  })
  if (isRepeat) { // 代表有重复
    attrForm.value.attrValueList.splice(index, 1)
    ElMessage.error('输入内容重复,请重新输入')
    return
  }
  row.inputVisible = false
}
const clickHandler = (row: AttrValueModel) => {
  row.inputVisible = true
  // 自动聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })
}



// 编辑
const editAttr = (row: AttrModel) => {
  attrForm.value = cloneDeep(row) // 回显数据
  isEdit.value = true // 切换编辑状态
}
// 删除
const deleteAttr = async (row: AttrModel) => {
  try {
    await attrApi.deleteAttr(row.id as number)
    ElMessage.success('删除成功')
    getList() // 重新获取当前页面数据
  } catch (error) {
    ElMessage.error('删除失败,请重试')
  }
}




// 初始化数据函数
const initAttrForm = () => ({
  attrName: '',
  categoryId: undefined,
  categoryLevel: 3,
  attrValueList: []
})
// 收集表单数据
const attrForm = ref<AttrModel>(initAttrForm())

// 添加属性值按钮
const addAttrValue = () => {
  attrForm.value.attrValueList.push({
    // valueName: `随便写${ Date.now() }`, // 这里先随便写,写死,别管,表格中input的切换单独去考虑,现在只管增改
    valueName: ``, // 这里应该是空串,让用户输入
    inputVisible: true
  })

  // 自动聚焦
  // 在vue中DOM更新是异步的,当所有的数据变完之后,最后才要更新DOM,只有DOM真实的更新之后才能拿到组件实例
  nextTick(() => {
    inputRef.value?.focus()
  })

}
// 删除属性值
const deleteAttrValue = (index: number) => {
  attrForm.value.attrValueList.splice(index, 1)
}




// 保存
const onSave = async () => {
  // 组装数据
  attrForm.value.categoryId = categoryStore.category3Id;
  // 发送请求
  try {
    await attrApi.saveAttrInfo(attrForm.value)
    ElMessage.success('保存成功') // 提示
    isEdit.value = false; // 切换回列表显示状态
    attrForm.value = initAttrForm(); // 初始化收集数据的对象
    getList(); // 重新发送请求拿数据
  } catch (error) {
    ElMessage.error('保存失败,请重试')
  }
}

// 取消保存
const cancelSave = () => {
  attrForm.value = initAttrForm(); // 初始化收集数据的变量
  isEdit.value = false; // 切换主列表显示
}







// 获取平台属性数据
const attrList = ref<AttrModel[]>([])
const getList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore;
    let result = await attrApi.getAttrInfoList(category1Id as number, category2Id as number, category3Id as number)
    attrList.value = result
  } catch (error) {
    ElMessage.error('获取平台属性列表失败,请重试')
  }
}

// 页面初始化数据展示 - 只有在第三级数据发生变化的时候才要展示
watch(() => categoryStore.category3Id, (nval) => {
  if (nval) {
    // 请求数据
    getList();
  } else {
    // 清空数据
    attrList.value = []
  }
}, { immediate: true })

</script>

<style scoped>

</style>