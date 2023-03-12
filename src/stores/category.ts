import { defineStore } from 'pinia'
import categoryApi, { type CategoryModel } from '@/api/category'
import { ElMessage } from 'element-plus'

interface CategoryStateModel {
  category1Id: undefined | number,
  category2Id: undefined | number,
  category3Id: undefined | number,
  category1List: CategoryModel[],
  category2List: CategoryModel[]
  category3List: CategoryModel[]
}

const useCategoryStore = defineStore('category', {
  state: (): CategoryStateModel => ({
    category1Id: undefined,
    category2Id: undefined,
    category3Id: undefined,
    category1List: [], // 1级分类的下拉数据
    category2List: [], // 2级分类的下拉数据
    category3List: [], // 3级分类的下拉数据
  }),
  actions: {
    async getCategory1List() {
      // 调接口
      try {
        let result = await categoryApi.getCategory1()
        this.category1List = result
      } catch (error) {
        ElMessage.error('获取一级分类数据失败,请重试')        
      }
    },
    async getCategory2List() {
      try {
        // 将2级和3级的所有相关数据都清空
        this.category2Id = undefined;
        this.category3Id = undefined;
        this.category2List = [];
        this.category3List = [];
        // 重新回去2级下拉的数据
        let result = await categoryApi.getCategory2(this.category1Id as number)
        this.category2List = result
      } catch (error) {
        ElMessage.error('获取二级分类数据失败,请重试')      
      }
    },
    async getCategory3List() {
      try {
        // 将所有3级的数据清空
        this.category3Id = undefined
        this.category3List = []
        // 重新获取3级下拉的数据
        let result = await categoryApi.getCategory3(this.category2Id as number)
        this.category3List = result
      } catch (error) {
        ElMessage.error('获取三级分类数据失败,请重试')      
      }
    }
  },
  getters: {}
})

export default useCategoryStore