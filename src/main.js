import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import mocker from './utils/mocking'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
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
