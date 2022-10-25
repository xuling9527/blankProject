import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
// import Layout from "@/layout";
// import Layout from "@/layout";
import Layout from "@/views/layout/index";

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
export const constantRoutes = [
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)",
  //       component: () => import("@/views/redirect/index"),
  //     },
  //   ],
  // },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  // {
  //   path: "/auth-redirect",
  //   component: () => import("@/views/login/auth-redirect"),
  //   hidden: true,
  // },
  // {
  //   path: "/404",
  //   component: () => import("@/views/error-page/404"),
  //   hidden: true,
  // },
  // {
  //   path: "/401",
  //   component: () => import("@/views/error-page/401"),
  //   hidden: true,
  // },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       component: () => import("@/views/dashboard/index"),
  //       name: "Dashboard",
  //       meta: { title: "dashboard", icon: "dashboard", affix: true },
  //     },
  //   ],
  // },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    name: 'Index',
    meta: { title: "工作台", icon: "index" }, // 图标
    children: [
      {
        path: "/index",
        component: () => import("@/views/index/index"),
        name: "Index",
        meta: { title: "工作台", icon: "index", }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/guide",
  //   component: Layout,
  //   redirect: "/guide/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/guide/index"),
  //       name: "Guide",
  //       meta: { title: "guide", icon: "guide", noCache: true },
  //     },
  //   ],
  // },
  // {
  //   path: "/profile",
  //   component: Layout,
  //   redirect: "/profile/index",
  //   hidden: true,
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/profile/index"),
  //       name: "Profile",
  //       meta: { title: "profile", icon: "user", noCache: true },
  //     },
  //   ],
  // },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
