import router from './router'
import store from './store'
// import { Message } from "element-ui";
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // get token from cookie
import Layout from '@/views/layout'
import BaseRouter from './views/layout/baseRouter'
// import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }) // 进度条配置
const whiteList = ['/login', '/auth-redirect'] // 无重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start() // 启动进度条
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/index' })
      NProgress.done() // hack: https://github.com/PanJiaChen/pull/2939
    } else {
      if (store.getters.name) { // 如果已经调用getuserInfo 在vuex里存入了用户id/用户名就跳转页面
        next()
      } else { // 否则调用getuserInfo
        // eslint-disable-next-line require-atomic-updates
        try {
          await store.dispatch('user/getUserInfo')
          console.log(store.getters.menus)
          const menus = []
          filterAsyncRouter(menus, store.getters.menus, 0) // 1.过滤路由
          router.addRoutes(menus) // 2.动态添加路由
          global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
          next({ ...to, replace: true })
        } catch (error) {
          // eslint-disable-next-line require-atomic-updates
          await store.dispatch('user/resetToken')
          // Message.error("获取用户信息失败,请重新登录.");
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // const menus = [];
  // filterAsyncRouter(menus, store.getters.menus, 0); // 1.过滤路由
  // finish progress bar
  NProgress.done()
})
function filterAsyncRouter(routes, asyncRouterMap, i) {
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      const menu = {
        path: item.route,
        name: item.routeName,
        meta: {
          title: item.menuName,
          icon: item.menuIcon
        },
        hidden: item.routeType === 1, // menuType 判断路由类型   0.路由 1.按钮
        children: []
      }
      if (i !== 0) {
        if (item.children.length > 0) {
          menu.component = BaseRouter
        } else {
          // // 后端返回按钮数据处理成可直接使用数据
          if (item.buttonList) {
            const oldtablebtn = item.buttonList.filter((item) => item.type === 1)
            const operationbtn = item.buttonList.filter((item) => item.type !== 1)
            const Obj = oldtablebtn.reduce((pre, cur, index) => {
            // debugger
              if (!pre[cur.label]) { // 判断是否存在当前表头
              // 如果没有
                pre[cur['label']] = { pram: cur['name'], label: cur['label'], btn: true, btnType: cur['operatorProperties'], auth: cur['auth'] }
              } else {
                if (pre[cur.label]['pram'] instanceof Array) { // 判断是否是多个按钮
                  pre[cur.label]['pram'].push({ btnlable: cur['name'], btnType: cur['operatorProperties'], auth: cur['auth'], isIcon: cur['way'] })
                } else {
                  pre[cur.label] = { pram: [{ btnlable: pre[cur.label]['pram'], btnType: pre[cur.label]['btnType'], auth: pre[cur.label]['auth'], isIcon: pre[cur.label]['way'] }], label: cur['label'], btn: true }
                  pre[cur.label]['pram'].push({ btnlable: cur['name'], auth: cur['auth'], btnType: cur['operatorProperties'], isIcon: cur['way'] })
                }
              }
              return pre
            }, {})
            const newtablebtn = Object.keys(Obj).map((item) => {
              return Obj[item]
            })
            menu.meta = { ...menu.meta, tablebtn: newtablebtn, operationbtn: operationbtn }
          }
          menu.component = resolve =>
            require([`@/views${item.route}`], resolve) // import('./views' + item.route)
        }
        menu.name = item.routeName
        menu.meta.activeMenu = item.route.substr(
          0,
          item.route.lastIndexOf('/')
        )
      } else {
        if (item.children.length > 0) {
          menu.component = Layout
          menu.name = item.routeName
        } else {
          menu.path = item.route.substr(0, item.route.indexOf('/'))
          menu.component = Layout
          menu.name = item.routeName
          menu.children = [
            {
              path: item.route.substr(item.route.indexOf('/') + 1),
              name: item.routeName,
              component: resolve => require([`@/views${item.route}`], resolve),
              xxxis: './views',
              meta: {
                title: item.menuName,
                icon: item.menuIcon,
                noCache: item.menuType === 1,
                activeMenu: item.route.substr(0, item.route.lastIndexOf('/'))
              }
            }
          ]
        }
      }
      if (item.children.length > 0) {
        filterAsyncRouter(menu.children, item.children, 1)
      }
      routes.push(menu)
    })
  }
}
