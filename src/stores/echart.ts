import { defineStore } from 'pinia'
import echartApi, { type EchartDataModel } from '@/api/echart'
import { ElMessage } from 'element-plus'

const initData = (): EchartDataModel => ({
  "//1": "今日销售额",
  "salesToday": 0,
  "salesLastDay": 0,
  "salesGrowthLastDay": 0,
  "salesGrowthLastMonth": 0,

  "//2": "今日订单量",
  "orderToday": 0,
  "orderLastDay": 0,
  "orderTrend": [],
  "orderTrendAxis": [],
  
  "//3": "今日交易用户数",
  "orderUser": 0,
  "returnRate": 0,
  "orderUserTrend": [],
  "orderUserTrendAxis": [],
  
  "//4": "累计用户数",
  "usersTotal": 0,
  "usersLastDay": 0,
  "usersLastMonth": 0,
  "userGrowthLastDay": "",
  "userGrowthLastMonth": "",
  
  
  "//5": "销售额与访问量",
  "orderFullYearAxis": [],
  "orderFullYear": [],
  "userFullYearAxis": [],
  "userFullYear": [],
  
  "//6": "排行榜",
  "orderRank": [],
  "userRank": [],

  "//7": "关键字搜索",
  "searchWord": [],

  "//8": "分类销售排行",
  "saleRank": {
    "category": {
      "axisX": [],
      "data1": []
    },
    "goods": {
      "axisX": [],
      "data1": []
    }
  }
})

const useEchartStore = defineStore('echartStore', {
  state: () => ({
    echartData: initData()
  }),
  actions: {
    async getEchartData() {
      try {
        let result = await echartApi.getEchartData()
        this.echartData = result;
      } catch (e) {
        ElMessage.error('获取图表数据失败,请重试')
        return Promise.reject(e)
      }
    }
  },
  getters: {}
})

export default useEchartStore