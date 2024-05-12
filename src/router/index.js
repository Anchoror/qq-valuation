import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import Phone from '../views/Phone/Phone.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    // path: '/qq-valuation/',
    name: 'home',
    component: Phone,
    meta: {
      title: '首页'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
  document.title = `${import.meta.env.VITE_TITLE}-${to.meta.title}` // 将文档标题设置为包括当前路由的元标题
  // const { token } = storeToRefs(useUserStore())
  // if (!token.value) {
  //   if (to.name === 'login') {
  //     next()
  //     return
  //   }
  //   next('/login')
  //   return
  // } else {
  //   if (to.name === 'login') {
  //     next('/')
  //     return
  //   }
  //   next()
  // }
  console.log(from)
  next()
})

export default router
