import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/styles/nprogress.css'
import MainLayout from '@/components/layout/MainLayout.vue'
import IndexView from '@/views/IndexView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogContent from '@/components/blog/BlogContent.vue'
import DairyView from '@/views/DairyView.vue'
import GamesView from '@/views/GamesView.vue'
import MusicView from '@/views/MusicView.vue'
import TicTacToeView from '@/views/games/TicTacToeView.vue'

// 配置 NProgress
NProgress.configure({
  easing: 'easeInOutCubic',
  speed: 300,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: IndexView,
    meta: {
      mouseTrail: true,
    }
  },
  {
    path: '/',
    component: MainLayout,  // 使用布局
    children: [
      {
        path: 'blog',
        name: 'Blog',
        component: BlogView,
        meta: { sidebar: 'blog', mouseTrail: false, }  // 指定侧边栏类型
      },
      {
        path: 'blog/:id',
        name: 'BlogPost',
        component: BlogContent,
        meta: {
          sidebar: 'blog',  // 文章详情页也使用博客侧边栏
          transition: 'fade',  // 使用淡入淡出效果
          mouseTrail: false,
        }
      },
      {
        path: 'dairy',
        name: 'dairy',
        component: DairyView,
        meta: { sidebar: 'dairy', mouseTrail: false, }  // 指定侧边栏类型
      },
      {
        path: 'games',
        name: 'Games',
        component: GamesView,
        meta: { sidebar: 'games', mouseTrail: false, }  // 指定侧边栏类型
      },
      {
        path: 'music',
        name: 'Music',
        component: MusicView,
        meta: { sidebar: 'music', mouseTrail: false, }  // 指定侧边栏类型
      },
      {
        path: 'games/tic-tac-toe',
        name: 'TicTacToe',
        component: TicTacToeView,
        meta: {
          sidebar: 'games',    // 保持游戏侧边栏
          transition: 'fade', mouseTrail: false,   // 淡入淡出效果
        }
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），使用保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0, behavior: 'smooth' }
  }
})

// 路由前置守卫：开始进度条
router.beforeEach((_to, _from, next) => {
  NProgress.start()
  next()
})

// 路由后置钩子：结束进度条
router.afterEach(() => {
  NProgress.done()
})

export default router
