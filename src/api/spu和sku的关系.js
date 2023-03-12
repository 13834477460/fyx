// spu: 理解为一个品类
// sku: 某个品类下的具体商品


// spu的列表 - 模拟数据,讲spu和sku的关系用的
[
  { // 每一个对象都是一个spu
    id: 1001,
    spuName: 'Apple iPhone 12',
    desc: 'Apple iPhone 12, 是一个品类'
  },
  { // 每一个对象都是一个spu
    id: 1002,
    spuName: 'Redmi 10X',
    desc: 'Redmi 10X, 是一个品类'
  },
  { // 每次新增spu都是给spu这个列表添加了一条数据
    id: 1003,
    spuName: 'iphone 16',
    desc: 'iphone 16, 是一个品类',
    goods: [ // 这个数组放当前品类下的所有商品
      {
        id: '70001',
        skuName: 'iphone 16 mini',
        price: 3666,
        ......,
        spuId: 1003
      }
    ]
  }
  .....
]

