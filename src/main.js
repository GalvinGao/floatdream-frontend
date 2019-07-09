import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import mocker from './utils/mocking'
import router from './router'
import store from './store'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import HelperOffset from '@/components/Offset'
import Card from '@/components/Card'
import StatsCard from '@/components/StatsCard'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: 'https://4958c96c26804f52bf7d9693e94a85a6@sentry.io/1499984',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});

Vue.component('helper-offset', HelperOffset);
Vue.component('card', Card);
Vue.component('stats-card', StatsCard);
Vue.component(VueQrcode.name, VueQrcode);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires user, check if logged in
    // if not, redirect to login page.
    if (store.state.auth.state !== 'success') {
      next({
        path: '/login',
        // path: {name: 'Login'},
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.authorizedRedirect)) {
    // this route is the login route. if the user has already logged in then
    // they obviously don't need to do it again.
    if (store.getters.isLoggedIn) {
      // reject the request by sending the user to the same path
      next({
        path: from.fullPath
      })
    } else {
      // they might need to - let they go
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
