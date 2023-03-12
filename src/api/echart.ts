import mockRequest from '@/utils/mockRequest'

export interface WordModel {
  "word": string,
  "count": number,
  "user": number
}

export interface RankModel {
  "no": number,
  "name": string,
  "count": string
}

export interface EchartDataModel {
  "//1": "今日销售额",
  "salesToday": number,
  "salesLastDay": number,
  "salesGrowthLastDay": number,
  "salesGrowthLastMonth": number,

  "//2": "今日订单量",
  "orderToday": number,
  "orderLastDay": number,
  "orderTrend": number[],
  "orderTrendAxis": string[],
  
  "//3": "今日交易用户数",
  "orderUser": number,
  "returnRate": number,
  "orderUserTrend": number[],
  "orderUserTrendAxis": string[],
  
  "//4": "累计用户数",
  "usersTotal": number,
  "usersLastDay": number,
  "usersLastMonth": number,
  "userGrowthLastDay": string,
  "userGrowthLastMonth": string,
  
  
  "//5": "销售额与访问量",
  "orderFullYearAxis": string[],
  "orderFullYear": number[],
  "userFullYearAxis": string[],
  "userFullYear": number[],
  
  "//6": "排行榜",
  "orderRank": RankModel[],
  "userRank": RankModel[],

  "//7": "关键字搜索",
  "searchWord": WordModel[],

  "//8": "分类销售排行",
  "saleRank": {
    "category": {
      "axisX": string[],
      "data1": number[]
    },
    "goods": {
      "axisX": string[],
      "data1": number[]
    }
  }
}

export default {
  getEchartData() {
    return mockRequest.get<any, EchartDataModel>(`/getEchartData`)
  }
}