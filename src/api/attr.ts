import request from '@/utils/request'

// 查看列表attrInfoList       GET     /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 保存平台属性saveAttrInfo   POST    /admin/product/saveAttrInfo
// 删除Attr                   DELETE /admin/product/deleteAttr/{ id }

export interface AttrValueModel {
  id?: number,
  valueName: string,
  attrId?: number
  inputVisible?: boolean // 用来控制input框的显示和隐藏的
}

export interface AttrModel {
  id?: number, // 新增数据没有id,只有在编辑的情况下才有id
  attrName: string,
  categoryId: number | undefined,
  categoryLevel: number,
  attrValueList: AttrValueModel[],
  // --------------------
  attrIdValId?: string // 用来收集`属性id:属性值id`
}

export default {
  getAttrInfoList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrModel[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  saveAttrInfo(data: AttrModel) {
    return request.post<any, null>(`/admin/product/saveAttrInfo`, data)
  },
  deleteAttr(id: number) {
    return request.delete<any, null>(`/admin/product/deleteAttr/${ id }`)
  }
}