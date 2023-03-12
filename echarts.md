# 数据可视化报表开发准备



## 项目中引入echarts

### 下载依赖包

```
npm i echarts vue-echarts
注意：vue-echarts5以上是针对vue3的，不包含5
```



### plugins/echarts.ts

```js
import * as $echarts from 'echarts'
import type { App } from 'vue'
import VueEcharts from 'vue-echarts'

const vueEcharts = function(app:App){
  app.component('v-chart',VueEcharts)
}

export {
  $echarts,
  vueEcharts
}
```



### main.ts

```
import {vueEcharts} from '@/plugins/echarts'
app.use(vueEcharts)
```



## mock数据接口

### mock/data.json

```json
{
  "//1": "今日销售额",
  "salesToday": 30346799,
  "salesLastDay":   36000000,
  "salesGrowthLastDay": -19.16,
  "salesGrowthLastMonth": 56.67,

  "//2": "今日订单量",
  "orderToday": 2562061,
  "orderLastDay": 2100000,
  "orderTrend": [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530, 220],
  "orderTrendAxis": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  
  "//3": "今日交易用户数",
  "orderUser": 182425,
  "returnRate": 5.91,
  "orderUserTrend": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290, 330, 150],
  "orderUserTrendAxis": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  
  "//4": "累计用户数",
  "usersTotal": 1177965,
  "usersLastDay": 1000000,
  "usersLastMonth": 800000,
  "userGrowthLastDay": "17.70",
  "userGrowthLastMonth": "47.12",
  
  
  "//5": "销售额与访问量",
  "orderFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "orderFullYear": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
  "userFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "userFullYear": [110, 120, 90, 220, 175, 212, 192, 95, 88, 120, 250, 310],
  
  "//6": "排行榜",
  "orderRank": [
    {
    "no": 1,
    "name": "肯德基",
    "count": "323,234"
  }, {
    "no": 2,
    "name": "麦当劳",
    "count": "299,132"
  }, {
    "no": 3,
    "name": "肯德基",
    "count": "283,998"
  }, {
    "no": 4,
    "name": "海底捞",
    "count": "266,223"
  }, {
    "no": 5,
    "name": "西贝筱面村",
    "count": "223,445"
  }, {
    "no": 6,
    "name": "汉堡王",
    "count": "219,663"
  }, {
    "no": 7,
    "name": "真功夫",
    "count": "200,997"
  }],
  "userRank": [
    {
    "no": 1,
    "name": "麦当劳",
    "count": "211,335"
  }, {
    "no": 2,
    "name": "肯德基",
    "count": "210,597"
  }, {
    "no": 3,
    "name": "必胜客",
    "count": "200,998"
  }, {
    "no": 4,
    "name": "海底捞",
    "count": "199,220"
  }, {
    "no": 5,
    "name": "西贝筱面村",
    "count": "195,444"
  }, {
    "no": 6,
    "name": "汉堡王",
    "count": "180,161"
  }, {
    "no": 7,
    "name": "真功夫",
    "count": "172,995"
  }],

  "//7": "关键字搜索",
  "searchWord": [
    {
    "word": "北京",
    "count": 3440,
    "user": 1626
  }, {
    "word": "上海",
    "count": 8101,
    "user": 6660
  }, {
    "word": "广州",
    "count": 7814,
    "user": 2196
  }, {
    "word": "深圳",
    "count": 8888,
    "user": 7102
  }, {
    "word": "南京",
    "count": 6204,
    "user": 1949
  }, {
    "word": "杭州",
    "count": 8159,
    "user": 3548
  }, {
    "word": "合肥",
    "count": 269,
    "user": 151
  }, {
    "word": "济南",
    "count": 2045,
    "user": 1320
  }, {
    "word": "太原",
    "count": 5693,
    "user": 2297
  }, {
    "word": "成都",
    "count": 4850,
    "user": 1635
  }, {
    "word": "重庆",
    "count": 906,
    "user": 269
  }, {
    "word": "苏州",
    "count": 5576,
    "user": 3937
  }, {
    "word": "无锡",
    "count": 1576,
    "user": 796
  }, {
    "word": "常州",
    "count": 9002,
    "user": 8508
  }, {
    "word": "温州",
    "count": 8103,
    "user": 4903
  }, {
    "word": "哈尔滨",
    "count": 7961,
    "user": 6173
  }, {
    "word": "长春",
    "count": 5916,
    "user": 3117
  }, {
    "word": "大连",
    "count": 5012,
    "user": 78
  }, {
    "word": "沈阳",
    "count": 8410,
    "user": 5696
  }, {
    "word": "拉萨",
    "count": 3385,
    "user": 2547
  }, {
    "word": "呼和浩特",
    "count": 4672,
    "user": 34
  }, {
    "word": "武汉",
    "count": 7386,
    "user": 4047
  }, {
    "word": "南宁",
    "count": 6192,
    "user": 612
  }, {
    "word": "必胜客",
    "count": 3504,
    "user": 2480
  }, {
    "word": "肯德基",
    "count": 3727,
    "user": 2527
  }, {
    "word": "麦当劳",
    "count": 8959,
    "user": 6198
  }, {
    "word": "海底捞",
    "count": 5295,
    "user": 2264
  }, {
    "word": "美食",
    "count": 7348,
    "user": 5555
  }, {
    "word": "商超",
    "count": 1628,
    "user": 1295
  }, {
    "word": "水果",
    "count": 892,
    "user": 215
  }, {
    "word": "跑腿",
    "count": 254,
    "user": 40
  }, {
    "word": "送药",
    "count": 8377,
    "user": 4363
  }, {
    "word": "烩饭",
    "count": 2009,
    "user": 1080
  }, {
    "word": "面条",
    "count": 7684,
    "user": 4299
  }, {
    "word": "小龙虾",
    "count": 3187,
    "user": 562
  }, {
    "word": "牛肉",
    "count": 3612,
    "user": 3449
  }, {
    "word": "鸡腿",
    "count": 4460,
    "user": 367
  }, {
    "word": "全家桶",
    "count": 7206,
    "user": 3682
  }, {
    "word": "麦乐鸡",
    "count": 3383,
    "user": 3048
  }, {
    "word": "炭烤",
    "count": 8818,
    "user": 26
  }, {
    "word": "麻辣",
    "count": 1297,
    "user": 905
  }, {
    "word": "冒菜",
    "count": 3015,
    "user": 2362
  }],

  "//8": "分类销售排行",
  "saleRank": {
    "category": {
      "axisX": ["粉面粥店", "简餐便当", "汉堡披萨", "香锅冒菜", "小吃炸串", "地方菜系", "轻食简餐"],
      "data1": [56, 52, 95, 41, 30, 69, 63]
    },
    "goods": {
      "axisX": ["草莓", "甘蔗", "榴莲", "菠萝", "香蕉", "梨", "苹果"],
      "data1": [68, 15, 41, 56, 70, 25, 31]
    }
  }
}
```

### mock/index.ts

```js
import Mock from 'mockjs'
import echartsData from './echartsData.json'

Mock.mock('/mock/getEchartsData', {
  status: 200,
  data:echartsData
})
```

### main.js

```
import '@/mock'
```



## 接口请求函数

### utils/mockRequest.ts

mock接口的axios封装:

```js
import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: '/mock',
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const result = response.data
    if (result.status === 2000) {
      return result
    } else {
      return Promise.reject(new Error('请求失败'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
```



### api/echarts.js

```js
/* 
数据可视化接口请求函数模块
*/
import mockRequest from '@/utils/mockRequest'

export function getEchartsData() {
  return mockRequest.get('/getEchartsData')
}
```



## 请求可视化数据的vuex模块

### stores/echarts.ts

```js
import {defineStore} from 'pinia'
import getEchartsData from '@/api/echarts'
export const useEchartsStore = defineStore('echarts',{
  state:() => {
    return {
      echartsData:{}
    }
  },
  actions:{
    async getEchartsData(){
      try {
        const result = await getEchartsData()
        console.log(result);
        this.echartsData = result
      } catch (error) {
        alert('获取echarts数据失败')
      }
    }
  }
})
```



views/home.vue

```js
const echartsStore = useEchartsStore()
onMounted(() => {
  echartsStore.getEchartsData()
})
```

查看vuex数据

## echarts常用配置

```
title: 标题组件
	text: '主标题文本'
	subtext: '子标题文本'
	textStyle: 主标题字体样式
		color: 颜色
		fontSize: 大小
	subtextStyle: 子标题字体样式
		color: 颜色
		fontSize: 大小
	left: 离容器左侧的距离
	top: 离容器上面的距离
	textAlign: 标题的对齐方式

legend: 图例组件
	orient: 多个图例的排列方式  horizontal/vertical
	left: 离容器左侧的距离
	top: 离容器上面的距离
	textStyle: 字体样式
		color: 颜色

grid: 网格组件
	left: 离容器左侧的距离
	top: 离容器上面的距离
	right: 离容器右侧的距离
	bottom: 离容器下侧的距离

xAxis: x轴组件
yAxis: y轴组件
	show: 是否显示
	data: X轴列表数据
	type: 坐标轴类型  category:类目轴 / value: 数值轴
	boundaryGap: 坐标轴两边是否留白
	min: 坐标轴刻度最小值
	max: 坐标轴刻度最大值
	axisLine: 坐标轴轴线
		show: 是否显示
	axisTick: 坐标轴刻度
		show: 是否显示
		alignWithLabel: 刻度线与标题对齐是否对齐
	splitLine: 分隔线
		lineStyle: 线的样式
            type:  线的类型  实线: 'solid' / 虚线: 'dotted',
            color: 颜色
	axisLabel: 坐标轴刻度标签
		show: 是否显示

tooltip: 提示框组件
	trigger: 触发方式  item:数据项图形触发 / axis: 坐标轴触发
	formatter: 指定提示的内容  (params) => 要显示的内容

series: 系列组件
	type: 图表类型  line: 折线图 / bar: 柱状图 / pie: 饼状图
    name: 系列名称
    data: 列表数据
    label: 图形上的文本标签
    	show: 是否显示 默认不显示
    	color: 字体颜色
    	position: 位置  top:上面 / right:右侧 / outside: 外部
    	formatter: 指定要显示的自定义内容
    	distance: 距离
	lineStyle: 线条样式
	itemStyle: 折线拐点标志的样式
	areaStyle: 区域填充样式
		opacity: 透明度
		color: 颜色
	smooth: 是否平滑曲线显示
	barWidth: 柱条的宽度
	showBackground: 是否显示柱条的背景色
	backgroundStyle: 柱条的背景样式
	
	center: 饼图的中心（圆心）坐标
	radius: 饼图的半径  如果是[value1, value2]就形成圆环图
	avoidLabelOverlap: 是否启用防止标签重叠, 圆环图都不开启
	itemStyle 图形样式
		borderColor: 描边颜色
        borderWidth: 描边线宽
    labelLine 标签的视觉引导线
    	length: 引导线第一段的长度
    	length2: 引导线第二段的长度
    	smooth: 是否平滑视觉引导线
    
color: 图例颜色列表
```