// 1. 安装
// npm i mockjs
// 2. 引入使用
import Mock from 'mockjs'
import data from './data.json'

// 3. 使用 - 模拟接口
Mock.mock('/mock/getEchartData', () => {
  return {
    code: 200,
    data, //粘进来的数据
    message: 'success'
  }
})
// 4. 在main.ts中引入当前文件,此时mock才会起效果
