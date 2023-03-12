import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
// import type { UserInfoState } from './interface';
import {arrowMiddleware, ElMessage} from 'element-plus'
import { staticRoutes, asyncRoutes, anyRoute } from '@/router/routes'
// 类型单独引入的时候type在大括号外面
// 类型和其他内容一起引入的时候,type在大括号内
import userInfoApi, { type UserInfoModel } from '@/api/userInfo';
import type { RouteRecordRaw } from "vue-router";
import router from '@/router' // 引入路由器
import { cloneDeep } from 'lodash'

// 动态注册路由
const arrRoutes = (allRoutes: RouteRecordRaw[]) => {
  allRoutes.forEach(route => { // route 参数是每一个路由
    router.addRoute(route) // 动态注册路由, 这个方法是vue-router提供的,只能动态添加一个路由
  })
}


// 侧边菜单栏的展示
// 功能: 过滤路由
// 参数一: 所有的动态路由,需要进行过滤
// 参数二: 用户返回的个人信息携带的当前用户可访问的菜单,是一个数组,数组中放的字符串
const filterRoutesHandler = (asyncRoutes: RouteRecordRaw[], routesNames: string[]) => {
  let filterRoutes =  asyncRoutes.filter(route => {
    // 判断当前遍历的路由,是不是在后端返回的个人信息权限数据里

    // 对子路由进行处理
    if (route.children && route.children.length) {
      route.children = filterRoutesHandler(route.children, routesNames)
    }

    return routesNames.includes(route.name as string)
  })
  return filterRoutes
}


// interface UserInfoModel {
//   avatar: string,
//   buttons: string[],
//   name: string,
//   roles: string[],
//   routes: string[]
// }
interface UserInfoState {
  token: string;
  userInfo: UserInfoModel,
  menuRoutes: RouteRecordRaw[] // 用于生成导航菜单的路由列表
}

// 用于初始化个人信息
const initUserInfo = () => ({
  avatar: '',
  buttons: [],
  name: '',
  roles: [],
  routes: []
})

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    userInfo: initUserInfo(),
    menuRoutes: []
  }),

	actions: {
    async login (username: string, password: string) {
      try {
        let result = await userInfoApi.login({username, password});
        setToken(result.token)
        this.token = result.token;
      } catch (error) {
        ElMessage.error('登陆失败,请重试')
        return Promise.reject(error) // 在于让外部调用login这个方法的时候可以接收到错误
      }
    },

    async getInfo () {
      try {
        let result = await userInfoApi.getInfo();
        this.userInfo = result; // 存储个人信息(包括个人的基本信息和权限信息)
        
        // 接口返回的数据
        // buttons  -- 按钮权限 - 按下不表(最后说)  
        // roles    -- 角色(当前账号拥有的角色)     
        // routes   -- 菜单权限(当前用户可以看到的菜单)
        // name     -- 用户名
        // avatar   -- 头像

        
        // console.log(result)
        // 需求:侧边菜单栏的展示
        // 1. 侧边菜单栏展示的数据是 staticRoutes ,是路由
        //    在所有的路由中,并不是每个路由都需要权限(不需要权限的路由有 logon、404...)
        //    将路由拆分开,拆分成三块内容
        //    staticRoutes - 静态路由,代表不需要进行权限校验的就能访问的路由(logon、404)
        //    asyncRoutes  - 动态路由,代表需要进行权限校验的路由(品牌管理、平台属性管、spu、sku)
        //    anyRoute     - 任意路由,匹配我们没有的路径,必须放在最后,重定向到404
        // 2. 在获取个人信息的位置,拿到后端返回的菜单权限数据,对需要进行过滤的路由进行过滤(asyncRoutes)
        // 问题:此时发生了问题,当点击侧边菜单栏的时候,发生了白板
        // 原因:创建router实例的时候,需要注册一个配置项,配置项中有 routes
        //      这个routes之前写的就是 staticRoutes,没有拆分之前它里面是所有的路由
        //      相当于之前把所有的路由都注册了
        //      现在拆分之后,staticRoutes里面只有 login 404 首页
        //      所有router实例化的时候只注册了这三个路由
        // 注意: 路由注册和侧边栏的展示是两码事
        // 解决:
        // 动态注册路由
        //      将过滤之后有权限的,所有的路由再次注册一遍即可
        //      目的: 为了就是让没有权限的菜单,输入url访问不到
        // ------------------------------------------------------------------
        // bug: 过滤的时候会修改了原始数据中的成员对象中的属性(children)
        // 解决: 把对局深拷贝一下,不修改原始数据即可

        // filterRoutes 过滤之后的路由,代表已经进行筛选(校验)过了
        const filterRoutes = filterRoutesHandler( cloneDeep(asyncRoutes) , result.routes)
        // 拼接好所有的路由
        const allRoutes = staticRoutes.concat(filterRoutes, anyRoute)
        
        this.menuRoutes = allRoutes

        // 动态注册路由
        arrRoutes(allRoutes)

        
        // 获取个人用户信息的时候,除了用户的基本信息以外还有权限信息
        // 根据用户的权限信息来展示侧边栏(权限相关的会最后说,这里先写死)
        // this.menuRoutes = staticRoutes
      } catch (error) {
        ElMessage.error('获取个人信息失败,请重试')
        return Promise.reject(error)
      }
    },

    async reset () {
      try {
        await userInfoApi.logout()
        // 删除local中保存的token
        removeToken()
        // 提交重置用户信息的mutation
        this.token = ''
        this.userInfo = initUserInfo();
      } catch (error) {
        ElMessage.error('退出登陆失败,请重试')
        return Promise.reject(error);
      }
    },
    
    
    // login (username: string, password: string) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       if (username==='admin' && password==='111111') {
    //         const token = 'token-atguigu'
    //         setToken(token)
    //         this.token = token
    //         resolve(token)
    //       } else {
    //         reject(new Error('用户名或密码错误!'))
    //         ElMessage.error('用户名或密码错误!')
    //       }
    //     }, 1000)
    //   })
    // },

    // getInfo () {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.name = 'admin'
    //       this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    //       // 获取个人用户信息的时候,除了用户的基本信息以外还有权限信息
    //       // 根据用户的权限信息来展示侧边栏(权限相关的会最后说,这里先写死)
    //       this.menuRoutes = staticRoutes
    //       resolve({name: this.name, avatar: this.avatar, token: this.token})
    //     }, 1000)
    //   })
    // },

    // reset () {
    //   // 删除local中保存的token
    //   removeToken()
    //   // 提交重置用户信息的mutation
    //   this.token = ''
    //   this.name = ''
    //   this.avatar = ''
    // },
	},
});
