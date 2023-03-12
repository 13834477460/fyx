<template>
  <el-card class="trademark">
    <template #header>
      <!-- 通过v-if判断按钮权限的做法是最原始的,每次都需要在组件中引入 userinfoStore,很麻烦 -->
      <!-- <el-button v-if="userInfoStore.userInfo.buttons.includes('btn.Trademark.add')" type="primary" :icon="Plus" @click="showAddTrademark">添加</el-button> -->
      <!--
        自定义指令
      -->
      <el-button v-permissionBtn="`btn.Trademark.add`" type="primary" :icon="Plus" @click="showAddTrademark">添加</el-button>
    </template>
    
    <!-- 
      el-table
        data 属性,表格渲染的数据,是一个数组
        border 边框
      el-table-column - 代表的是列
        label 属性代表的是展示的列头
        type  是列的内置属性(element写好的,只需要写固定的属性即可) - index 代表的是序号  selection 是多选框
        prop  是展示数据中某个字段的说明
        自定义列用的是插槽,当使用自定义列的时候不需要prop这个属性,想用哪个属性自己从row身上去拿
    -->
    <el-table :data="trademarkList" border class="mb-10">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #default="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- row是当前这一行展示的数据 $index是下标 -->
        <template #default="{ row, $index }">
          <el-button v-permissionBtn="`btn.Trademark.update`" :icon="Edit" type="warning" @click="handleEdit($index, row)">编辑</el-button>
          <el-button v-permissionBtn="`btn.Trademark.remove`" :icon="Delete" type="danger" @click="handleDelete($index, row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      current-page 当前页
      page-size 每页条数
      total 总条数
      @size-change 每页条数改变触发的事件
      @current-change 翻页触发的事件
     -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, -> ,sizes, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />


    <!-- 弹框 -->
    <el-dialog v-model="isShow" :title="tmForm.id ? '修改品牌' : '添加品牌'" :close-on-click-modal="false" :before-close="beforeClose">
      
      <el-form label-width="100px" style="width: 500px" :model="tmForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">

          <!--
            upload 组件发请求的时候,走的是action这个属性中放的url,并没有走 axios
            没有走axios并不代表不是一个ajax请求,他是会过代理的,代理需要转发到真正的服务器上
          -->
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                图片必须是JPG格式且不能大于2MB
              </div>
            </template>
          </el-upload>

        </el-form-item>
      </el-form>


      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSave(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="onSave(ruleFormRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue';
import tradermarkApi, { type TrademarkListModel, type TrademarkModel } from '@/api/trademark'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, FormRules, FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash' // 我们项目的依赖用到了这个包,所以安装上了
import { useUserInfoStore } from '@/stores/userInfo';
const userInfoStore = useUserInfoStore()
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`


// 弹框关闭前的回调
const beforeClose = (done: any) => {
  // done();
  cancelSave(ruleFormRef.value); // 目的是为了清除红色提示的显示
}



// 自定义校验的回调
const checkTmName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('品牌名不能为空'))
  } else {
    if (tmForm.value.tmName.length >= 2 && tmForm.value.tmName.length <= 10) {
      callback()
    } else {
      callback(new Error('品牌名称的长度应为2到10个字符!!'))
    }
  }
}


// 表单校验
const rules = reactive<FormRules>({
  // 内置规则
  // tmName: [
  //   { required: true, message: '请输入品牌名称', trigger: 'blur' },
  //   { min: 2, max: 10, message: '品牌名长度应为2到10个字符', trigger: 'blur' },
  // ],
  // 自定义校验规则
  tmName: [
    { validator: checkTmName, trigger: 'blur' },
  ],
  logoUrl: [
    { required: true, message: '请上传图片', trigger: 'blur' },
  ]
})





// 编辑
const handleEdit = ($index: number, row: TrademarkModel) => {
  // 弹出弹框
  isShow.value = true
  // 回显数据
  tmForm.value = cloneDeep(row)
}
// 删除
const handleDelete = ($index: number, row: TrademarkModel) => {
  ElMessageBox.confirm(
    `确认要删除[${ row.tmName }]吗?`,
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    // 删除数据
    try {
      await tradermarkApi.delete(row.id as number)
      ElMessage.success('删除成功')
      getPage()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}




// 添加
const isShow = ref(false);
const showAddTrademark = () => {
  isShow.value = true;
}

// 展示表单upload文件上传
// 上传成功的回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  tmForm.value.logoUrl = response.data;
}
// 上传之前的回调
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是JPG格式的!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  return true
}

// 收集数据 - tmForm 用来收集表单的数据
const initTMForm = () => ({
  tmName: '',
  logoUrl: ''
})
const tmForm = ref<TrademarkModel>(initTMForm())

// 取消保存
const cancelSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields() // 清除校验飘红
  tmForm.value = initTMForm() // 重置表单
  isShow.value = false // 弹框消失
}

// 保存
const ruleFormRef = ref<FormInstance>();
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // 获取到form表单的实例,调用validate()方法 手动对表单进行一次校验,校验通过回调中的 valid 参数为true
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      
      // 之前保存的代码
      try {
        await tradermarkApi.save(tmForm.value)
        ElMessage.success('保存成功') // 用户提示
        getPage(); // 刷新页面
        cancelSave(formEl);
      } catch (error) {
        ElMessage.error('保存失败')
      }

    } else {
      console.error('保存失败', fields)
    }
  }) 
}





// 初始化数据
const trademarkList = ref<TrademarkListModel>([])
const getPage = async () => {
  try {
    let result = await tradermarkApi.getPage(page.value, limit.value)
    // 表格展示的数据赋值
    trademarkList.value = result.records;
    // 总条数赋值
    total.value = result.total;
  } catch (error) {
    ElMessage.error('获取品牌分页数据失败,请重试')
    // 抛出错误这行代码写不写由外部调用当前这个函数来决定
    // 外部需要拿到这个错误的时候需要抛出,不需要的时候不抛出
    // return Promise.reject(error)
  }
}


const page = ref(1); // 当前页
const limit = ref(3); // 每页条数
const total = ref(0); // 总条数
const handleSizeChange = (val: number) => {
  // 组装数据
  limit.value = val;
  // 发送请求
  getPage();
}
const handleCurrentChange = (val: number) => {
  // 组装数据
  page.value = val;
  // 发送请求
  getPage();
}

// 页面初始化
onMounted(() => {
  getPage();
})

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>