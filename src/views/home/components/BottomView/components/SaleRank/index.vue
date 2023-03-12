<template>
  <el-card>
    <template #header>
      <div class="header">
        <div>分类销售排行</div>
        <el-radio-group v-model="radio" size="small">
          <el-radio-button label="品类" />
          <el-radio-button label="商品" />
        </el-radio-group>
      </div>
    </template>
    <v-chart :option="setOption()" aoturesize style="height: 400px"></v-chart>
  </el-card>
</template>

<script setup lang="ts">
import useEchartStore from '@/stores/echart';
import { ref, computed } from 'vue'
const echartStore = useEchartStore();

const radio = ref('品类')

const saleRank = computed(() => {
  return echartStore.echartData.saleRank
})

const useData = computed(() => {
  // category和goods是解构的第一层
  // category: { axisX: axisX1, data1: data1 } category 跟冒号后面大括号在解构第二层数据
  // { axisX: axisX1, data1: data1 } 解构第二层数据中,给axisX起别名叫axisX1,给data1起别名叫data1
  const { category: { axisX: axisX1, data1: data1 }, goods: { axisX: axisX2, data1: data2 } } = saleRank.value
  
  // 注意: 解构的时候,只能拿到最终解构的数据,中间不管解构了几层,都拿不到(相当于中间解构层级的值,不存在)
  // console.log(category) // 打印不出来

  // 品类数据求和
  const categoryCount = data1.reduce((prev, item) => prev + item, 0)
  // 商品数据求个
  const goodsCount = data2.reduce((prev, item) => prev + item, 0)

  // 组装品类饼图数据
  const categoryData = axisX1.map((text, index) => {
    return {
      value: data1[index],
      // name值最后过来需要拼接,拼接成带有百分比的样式
      name: `${text} | ${ (data1[index] / categoryCount * 100).toFixed(2) + '%' }`
    }
  })
  // 组装商品饼图数据
  const goodsData = axisX2.map((text, index) => {
    return {
      value: data2[index],
      name: `${text} | ${ (data2[index] / goodsCount * 100).toFixed(2) + '%' }`
    }
  })

  return {
    categoryCount,
    goodsCount,
    categoryData,
    goodsData,
  }
})


const setOption = () => ({
  title: [ // 数组的形式可以写多个title
    {
      text: radio.value == '品类' ? '品类分布' : '商品分布',
      textStyle: {
        // color: 'red'
        fontSize: '14px'
      },
      left: '5%',
      top: '5%'
    },
    {
      text: '用户数量', // 主标题 --- 不变
      left: '39%',
      top: '44%',
      textStyle: {
        fontSize: '30px'
      },
      // subtext: 406, // 有数据之后要写数据 
      subtext: radio.value == '品类' ? useData.value.categoryCount : useData.value.goodsCount, // 副标题 --- 一会根据数据要改变
      subtextStyle: {
        fontSize: '16',
      },
      textAlign: 'center'
    }
  ],
  tooltip: { // 弹框提示
    trigger: 'item'
  },
  legend: { // 图例
    orient: 'vertical', // 排列方式,默认水平'horizontal'  vertical是垂直
    top: 'center',
    right: '3%'
  },
  series: [
    {
      name: 'Access From', // tooltip弹框的提示内容,有name属性
      type: 'pie', // 图表类型 'bar' 'line' 'pie'
      radius: ['50%', '70%'], // [内圆半径, 外圆半径]
      center: ['40%', '50%'], // 设置圆心位置,默认值是 ['50%', '50%']
      // left: '50%', // 设置整张图的位置
      // top: '50%', // 设置整张图的位置
      // avoidLabelOverlap: false, // 是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。
      itemStyle: { // 每一项的样式
        borderRadius: 10, // 每一项的圆角
        borderColor: '#fff', // 每一项边框颜色
        borderWidth: 2 // 每一项边框宽度
      },
      label: { // 每一项展示的文本(标签)
        show: true, // 是否展示文本
        // position: 'center' // 展示文本的位置, center是居中
        formatter(params: any) {
          let text = params.name.split(" | ")[0]
          return text
        }
      },
      // emphasis: { // 高亮状态的扇区和标签样式。
      //   label: { // 标签样式
      //     show: true,
      //     fontSize: 20,
      //     fontWeight: 'bold'
      //   }
      // },
      labelLine: { // 引导线,项和标签之间的引导线
        show: true,
        length: 10, // 引导线的第一段长度
        length2: 20 // 引导线的第二段长度
      },
      data: radio.value == '品类' ? useData.value.categoryData : useData.value.goodsData
      // data: [
      //   { value: 1048, name: 'Search Engine111 | 50%' },
      //   { value: 735, name: 'Direct' },
      //   { value: 580, name: 'Email' },
      //   { value: 484, name: 'Union Ads' },
      //   { value: 300, name: 'Video Ads' }
      // ]
    }
  ]
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>