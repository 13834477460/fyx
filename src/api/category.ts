import request from '@/utils/request'

// getCategory1  GET   /admin/product/getCategory1
// getCategory2  GET   /admin/product/getCategory2/{category1Id}
// getCategory3  GET   /admin/product/getCategory3/{category2Id}

export interface CategoryModel {
  id: number,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export default {
  getCategory1() {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory1`)
  },
  getCategory2(category1Id: number) {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory2/${category1Id}`)
  },
  getCategory3(category2Id: number) {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory3/${category2Id}`)
  }
}