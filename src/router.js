import Vue from 'vue'
import Router from 'vue-router'
// Components, Views and Layouts
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Download from '@/views/Download.vue'
import PublicLayout from '@/layouts/Public'
import Login from '@/views/Login'
import NotFound from '@/views/404'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'Home',
          components: {
            public: Home
          }
        },
        {
          path: '/about',
          name: 'About',
          components: {
            public: About
          }
        },
        {
          path: '/download',
          name: 'Download',
          components: {
            public: Download
          }
        },
        {
          path: '/login',
          name: 'Login',
          components: {
            public: Login
          },
          meta: {
            authorizedRedirect: true
          }
        },
        {
          path: '/forum',
          name: 'Forum',
          beforeEnter: () => {
            window.open('https://bbs.floatdream.cn', '_blank')
          }
        }
      ]
    },
    {
      path: '/dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */'@/layouts/Dashboard.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          components: {
            dashboard: () => import(/* webpackChunkName: "dashboard" */'@/views/Dashboard/Home.vue')
          },
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'sponsor',
          name: 'DashboardSponsor',
          components: {
            dashboard: () => import(/* webpackChunkName: "dashboard" */'@/views/Dashboard/Sponsor/Home.vue')
          },
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'skin',
          name: 'DashboardSkinFactory',
          components: {
            dashboard: () => import(/* webpackChunkName: "dashboard" */'@/views/Dashboard/SkinFactory/Home.vue')
          },
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'settings',
          components: {
            dashboard: () => import(/* webpackChunkName: "dashboard" */'@/layouts/Settings.vue')
          },
          children: [{
            path: 'nickname',
            name: 'SettingsNickname',
            components: {
              settings: () => import(/* webpackChunkName: "dashboard" */'@/views/Dashboard/Settings/Nickname.vue')
            },
            meta: {
              requiresAuth: true
            }
          }],
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '*',
      name: '404 Not Found',
      component: NotFound
    }
  ]
});

export default router
