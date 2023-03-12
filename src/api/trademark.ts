import request from '@/utils/request'

// 分页列表     GET     /admin/product/baseTrademark/{page}/{limit}
// 新增品牌     POST    /admin/product/baseTrademark/save
// 修改品牌     PUT     /admin/product/baseTrademark/update
// 删除品牌     DELETE  /admin/product/baseTrademark/remove/{id}
// 获取所有品牌列表 GET /admin/product/baseTrademark/getTrademarkList


export interface TrademarkModel {
  id?: number, // 新增没有id,修改的时候才会有id,id可以作为这个数据是否一存在于数据库的标识
  logoUrl: string,
  tmName: string
}

export type TrademarkListModel = TrademarkModel[]

export interface TrademarkPageModel {
  current: number,
  pages: number,
  records: TrademarkListModel,
  searchCount: boolean,
  size: number,
  total: number
}

export default {
  getPage(page: number, limit: number) {
    return request.get<any, TrademarkPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  save(tmForm: TrademarkModel) {
    if (tmForm.id) {
      return request.put<any, null>(`/admin/product/baseTrademark/update`, tmForm)
    }
    return request.post<any, null>(`/admin/product/baseTrademark/save`, tmForm)
  },
  delete(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${id}`)
  },
  // 获取品牌下拉的列表数据
  getTrademarkList() {
    return request.get<any, TrademarkModel[]>(`/admin/product/baseTrademark/getTrademarkList`)
  }
}