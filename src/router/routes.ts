import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { 
          title: '首页', 
          icon: 'ele-HomeFilled', 
        }
      }
    ]
  },
  // 订单管理
  {
    path: '/ordermanagement',
    name: 'Ordermanagement',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '订单管理',
      icon: 'ele-HomeFilled'
    },
    children: [
      {
        path: 'manage',
        name: 'Manage',
        component: () => import('@/views/orderManageMent/manage/index.vue'),
        meta: {
          title: '订单管理'
        }
      }
    ]
  }
];

/**
 * 动态路由
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/acl",
    name: "Acl",
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "ele-Setting",
    },
    children: [
      {
        name: "User",
        path: "/acl/user/list",
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "/acl/role/list",
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "/acl/role/auth",
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: "角色管理",
          hidden: true,
          activeMenu: "/acl/role/list",
        },
      },
      {
        name: "Permission",
        path: "/acl/permission/list",
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },

  {
    path: '/product',
    name: "Product", // 1. 所有的name属性,这个值必须和我写的一样,为什么?按下不表,后续再说(解决了)
    component: () => import('@/layout/index.vue'),
    meta: { 
      title: '商品管理', 
      icon: 'ele-GoodsFilled', 
    },
    children: [
      {
        path: 'trademark',
        name: 'Trademark', // 2. 这个name作用,用于和个人信息可访问的菜单数据进行筛选用的,如何知道这个值应该写什么? - 按下不表
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理' 
        }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: { 
          title: '平台属性管理' 
        }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: { 
          title: 'SPU管理' 
        }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: { 
          title: 'SKU管理' 
        }
      },
      {
        path: 'recursion',
        component: () => import('@/views/product/recursion/index.vue'),
        meta: { 
          title: 'Recursion'
        }
      },
      {
        path: 'test',
        component: () => import('@/views/product/test/index.vue'),
        meta: { 
          title: 'Test'
        }
      },
    ]
  },

  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/layout/index.vue'),
    meta: { 
      title: '财务管理', 
      icon: 'ele-GoodsFilled', 
    },
    children: [
      {
        path: 'salary',
        name: 'Salary',
        component: () => import('@/views/finance/salary/index.vue'),
        meta: {
          title: '薪资管理' 
        }
      },
      {
        path: 'tax',
        name: 'Tax',
        component: () => import('@/views/finance/tax/index.vue'),
        meta: {
          title: '税务管理' 
        }
      }
    ]
  }

]

/* 匹配任意的路由 必须最后注册 */
export const anyRoute: RouteRecordRaw = { 
  path: '/:pathMatch(.*)', 
  name: 'Any',
  redirect: '/404', 
  meta: {
    hidden: true 
  }
}

/**
 * 定义动态路由
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [];
