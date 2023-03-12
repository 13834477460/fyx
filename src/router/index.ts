import { createRouter, createWebHistory } from 'vue-router';
import { staticRoutes, asyncRoutes, anyRoute } from '@/router/routes';

const router = createRouter({
	history: createWebHistory(),
  // 不能这没写,原因:这么写把所有的路由都注册了,虽然侧边栏看不到没有权限的菜单了
  //                但是可以通过url直接访问没有权限的菜单了,所以需要动态注册路由,注册当前用户有权限的路由
	// routes: staticRoutes.concat(asyncRoutes, anyRoute),
	routes: staticRoutes,
  scrollBehavior() {
    return { top: 0, left: 0}
  },
})

// 导出路由
export default router;