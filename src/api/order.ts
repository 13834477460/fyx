// 导入axios
import service from '@/utils/request'

// 获取订单分页数据
// GET /admin/order/{page}/{limit}
// /admin/order/1/10?outTradeNo=&consignee=&consigneeTel=13250202045&deliveryAddress=&orderStatus=&createTimeBegin=&createTimeEnd=

// 定义类型 -- > 订单详情展示数据的类型规范
export interface orderDetailListModel {
  id: number
  orderId: number
  skuId: number
  skuName: string
  imgUrl?: null
  orderPrice: number
  skuNum: number
  createTime: string
  sourceType: string
  sourceId: number
  splitTotalAmount: number
  splitActivityAmount: number
  splitCouponAmount: number
  refundStatus: string
  refundStatusString: string
  hasStock?: null
  activityRule?: null
  couponInfoList?: null
}

// 定义类型 -- > 列表主要展示数据类型规范
export interface orderRecordsModel {
  id: number
  consignee: string // 收货人姓名
  consigneeTel: string // 收货人电话
  totalAmount: number
  orderStatus: string // 订单状态
  userId: number
  paymentWay: string
  deliveryAddress: string // 地址
  orderComment: string
  outTradeNo: string // 订单编号
  tradeBody: string
  createTime: string // 创建时间
  operateTime?: null
  expireTime: string // 过期时间
  processStatus: string // 支付状态
  trackingNo?: null
  parentOrderId?: null
  imgUrl?: null
  provinceId?: null
  activityReduceAmount?: null
  couponAmount?: null
  originalTotalAmount?: null
  feightFee?: null
  feightFeeReduce?: null
  refundableTime?: null
  orderDetailList: orderDetailListModel[] // 订单详情展示数据
  orderDetailVoList?: null
  orderStatusName: string
  wareId?: null
  couponInfo?: null
  status?: string
  reason?: string
}

// 定义类型 -- > data 类型规范
export interface orderModel {
  current: number // 当前页码
  pages: number // 总有多少页
  records: orderRecordsModel[] // 列表展示数据
  searchCount: boolean
  size: number // 每页显示多少条
  total: number // 总数据
}

// 定义类型 -- > response响应体类型规范
export interface orderDataModel {
  code: number
  data: orderModel
}

// 定义搜索参数
export interface orderSearch {
  outTradeNo?: string // 订单编号
  consignee?: string // 收货人姓名
  consigneeTel?: string // 收货人电话
  deliveryAddress?: string // 收货人地址
  orderStatus?: string // 订单状态
  createTimeBegin?: string | any // 创建时间
  createTimeEnd?: string // 过期时间
}
/**
 *
 * @param page 当前页码
 * @param limit 每页展示多少条数据
 * @returns Promise
 */
export const orderManageMentInfoList = (page: number, limit: number, orderSearch?: orderSearch) => {
  return service.get<any, orderModel>(`/admin/order/${page}/${limit}`, {
    params: orderSearch
  })
}

// 签收 /admin/order/recieve/16631

// 定义签收订单的response类型规范
export interface orderRecieveModel {
  code: number
  data: null
}

/**
 *
 * @param id 订单号
 * @returns Promise
 */
export const orderRecieve = (id: number) => {
  return service.get<any, null>(`/admin/order/recieve/${id}`)
}
