import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTokenStore } from '@/stores/mytoken'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/LoginView.vue')
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true, title: '首页' }, //用于控制路由跳转时是否允许跳转进行判断,结合路由前置守卫使用并判断
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/IndexView.vue'),
          meta: { title: '默认页' }
        },
        {
          path: '/menus',
          name: 'menus',
          component: () => import('@/views/menu/MenuIndex.vue'),
          meta: { title: '菜单列表' }
        },
        {
          path: '/menus/create',
          name: 'menu-create',
          component: () => import('@/views/menu/CreateOrEdit.vue'),
          meta: { title: '创建列表' }
        },
        {
          path: '/menus/:id/edit',
          name: 'menu-edit',
          component: () => import('@/views/menu/CreateOrEdit.vue'),
          meta: { title: '编辑菜单' }
        },
        {
          path: '/resource-category',
          name: 'resource-category',
          component: () => import('@/views/resource-category/ResourceCategoryIndex.vue'),
          meta: { title: '资源分类' }
        },
        {
          path: '/resources',
          name: 'resources',
          component: () => import('@/views/resource/ResourcesIndex.vue'),
          meta: { title: '资源列表' }
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('@/views/roles/RolesIndex.vue'),
          meta: { title: '角色列表' }
        },
        {
          path: '/roles/:roleId/alloc-menus',
          name: 'alloc-menus',
          component: () => import('@/views/roles/AllocMenus.vue'),
          props: true, //这里的参数是指携带的参数可以被子组件接收到
          meta: { title: '分配菜单' }
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/users/UsersIndex.vue'),
          meta: { title: '用户列表' }
        },
        {
          path: '/courses',
          name: 'courses',
          component: () => import('@/views/courses/CoursesIndex.vue'),
          meta: { title: '用户列表' }
        },
        {
          path: '/course/create',
          name: 'course-create',
          component: () => import('@/views/courses/CreateOrEdit.vue'),
          meta: { title: '创建课程' }
        },
        {
          path: '/course/:courseId/edit',
          name: 'course-edit',
          component: () => import('@/views/courses/CreateOrEdit.vue'),
          props: true, //路由传递的参数Id当作属性接收
          meta: { title: '编辑课程' }
        },
        {
          path: '/:xxx(.*)*',
          name: 'ErrorPage',
          component: () => import('@/components/layout/ErrorPage.vue')
        }
      ]
    }
  ]
})

// 路由前置守卫
/**
 * to.matched 是一个数组,每一项都是路由的单个路径
 */
router.beforeEach((to, from, next) => {
  if (
    to.matched.some((item) => {
      return item.meta?.requiresAuth
    })
  ) {
    const store = useTokenStore()
    if (!store.token.access_token) {
      next({ name: 'Login', query: { redirect: to.fullPath } }) //传递当前要跳转的路由信息
      return //防止继续向下执行
    }
  }
  next()
})

export default router
