import request from '@/utils/request'
import type { SpuImageModel } from './spu'
// 查看spu的sku列表   GET     /admin/product/findBySpuId/${ spuId }
// 保存               POST    /admin/product/saveSkuInfo
// 获取sku的分页列表  GET     /admin/product/list/{page}/{limit}
// 下架               GET     /admin/product/cancelSale/{skuId}
// 上架               GET     /admin/product/onSale/{skuId}
// 删除SKU            DELETE  /admin/product/deleteSku/{skuId}
// 获取SKU详细信息    GET     /admin/product/getSkuById/{skuId}
/** */

export interface SkuSaleAttrValueModel {
  saleAttrId: string,
  saleAttrValueId: string,
  // ---以上两个属性保存必须有------
  id?: number,
  saleAttrName?: string,
  saleAttrValueName?: string,
  skuId?: number,
  spuId?: number,
}


export interface SkuAttrValueModel {
  attrId: string,
  valueId: string
  // ---以上两个属性保存必须有------
  attrName?: string,
  id?: number,
  skuId?: number,
  valueName?: string,
}

export interface SkuModel {
  id?: number,
  isSale?: number, // 选中状态
  spuId: number | undefined,
  price: number | undefined,
  skuName: string,
  skuDesc: string,
  weight: string,
  tmId: number | undefined,
  category3Id: number | undefined,
  skuDefaultImg: string, // 默认图片
  createTime: string,
  // 图片列表
  skuImageList: SpuImageModel[],
  // 平台属性
  skuAttrValueList: SkuAttrValueModel[],
  // 销售属性
  skuSaleAttrValueList: SkuSaleAttrValueModel[]
}

export type SkuListModel = SkuModel[]

export type SkuPageModel = {
  records: SkuListModel
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}


export default {
  // 保存SKU
  save(skuInfo: SkuModel) {
    return request.post<any, null>('/admin/product/saveSkuInfo', skuInfo)
  },
  // 根据spuId获取sku
  findBySpuId(spuId: number) {
    return request.get<any, SkuModel[]>(`/admin/product/findBySpuId/${ spuId }`)
  },
  // 获取sku的分页列表
  getPage(page: number, limit: number) {
    return request.get<any, SkuPageModel>(`/admin/product/list/${page}/${limit}`)
  },
  // 下架
  cancelSale(skuId: number) {
    return request.get<any, null>(`/admin/product/cancelSale/${skuId}`)
  },
  // 上架
  onSale(skuId: number) {
    return request.get<any, null>(`/admin/product/onSale/${skuId}`)
  },
  // 删除sku
  delete(skuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSku/${skuId}`)
  },
  // 获取SKU详细信息
  getSkuInfo(skuId: number) {
    return request.get<any, SkuModel>(`/admin/product/getSkuById/${skuId}`)
  },
}