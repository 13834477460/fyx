import request from '@/utils/request'

// 获取spu分页数据          GET    /admin/product/{ page }/{ limit }?category3Id={ id }
// 获取销售属性下拉         GET     /admin/product/baseSaleAttrList
// 新增保存SPU              POST    /admin/product/saveSpuInfo
// 根据spuId获取spu图片列表 GET     /admin/product/spuImageList/{ spuId }
// 根据spuId获取spu销售属性 GET     /admin/product/spuSaleAttrList/{ spuId }
// 更新保存SPU              POST    /admin/product/updateSpuInfo
// 删除spu                  DELETE  /admin/product/deleteSpu/{ spuId }

export interface SpuImageModel {
  id?: number,
  spuId?: number,
  imgName: string, // 图片名
  imgUrl: string, // 图片url
  // -----------
  name?: string,
  url?: string,
  response?: any
  // -----------
  isDefault?: boolean // 标记默认图片
}

export interface SpuSaleAttrValueModel {
  baseSaleAttrId: number,
  saleAttrValueName: string,
  id?: number,
  spuId?: number,
  isChecked?: boolean | null, // 这个没用
  saleAttrName?: string,
}

export interface SpuSaleAttrModel {
  id?: number,
  spuId?: number,
  baseSaleAttrId: number,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueModel[],
  // -------------------
  inputVisible?: boolean // 控制当前这一行销售属性中的 button 和 input 的切换
  inputValue?: string // 收集input框输入的内容
  // -------------------
  attrIdValId?: string // 收集`属性id:属性值id`
}

export interface SaleAttrModel {
  id: number,
  name: string
}

export interface SpuModel {
  id?: number,
  spuName: string,
  description: string,
  category3Id: number | undefined,
  tmId: number | undefined,
  spuSaleAttrList: SpuSaleAttrModel[], // 后面会改
  spuImageList: SpuImageModel[] // 后面会改
}

export interface SpuPageModel {
  records: SpuModel[], //  稍等
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}

export default {
  getPage(page: number, limit: number, id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${ page }/${ limit }?category3Id=${ id }`)
  },
  // 获取销售属性下拉
  getSaleAttrList() {
    return request.get<any, SaleAttrModel[]>(`/admin/product/baseSaleAttrList`)
  },
  saveSpuInfo(spuInfo: SpuModel) {
    return request.post<any, null>(`/admin/product/saveSpuInfo`, spuInfo)
  },
  // 根据spuId获取spu图片列表
  getSpuImageListBySpuId(spuId: number) {
    return request.get<any, SpuImageModel[]>(`/admin/product/spuImageList/${ spuId }`)
  },
  // 根据spuId获取spu销售属性
  getSaleAttrListBySpuId(spuId: number) {
    return request.get<any, SpuSaleAttrModel[]>(`/admin/product/spuSaleAttrList/${ spuId }`)
  },
  updateSpuInfo(spuInfo: SpuModel) {
    return request.post<any, null>(`/admin/product/updateSpuInfo`, spuInfo)
  },
  deleteSpu(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${ spuId }`)
  }
}