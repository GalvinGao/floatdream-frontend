import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/api/user'
import encryptor from '@/utils/encryptor'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const initialAuthState = {
  state: null,
  username: null,
  token: null,
};

export default new Vuex.Store({
  state: {
    auth: {...initialAuthState},
    account: {
      nickname: null
    }
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    auth_begin (state) {
      state.auth.state = 'loading'
    },
    auth_success (state, {username, token, nickname}) {
      state.auth.state = 'success';
      state.auth.username = username;
      state.auth.token = token;
      state.account.nickname = nickname
    },
    auth_error (state) {
      state.auth.state = 'error'
    },
    auth_logout (state) {
      state.auth = {...initialAuthState}
    },
    nickname_changed (state, newNickname) {
      state.account.nickname = newNickname
    }
  },
  actions: {
    login ({commit}, credentials) {
      return new Promise((resolve, reject) => {
        commit('auth_begin');
        console.log("credentials", credentials);

        user.login(credentials)
          .then(({data}) => {
            console.log('credentials succeeded!', data);
            commit('auth_success', data);
            resolve(data)
          })
          .catch(err => {
            commit('auth_error');
            reject(err)
          })
      })
    },
    logout ({commit}) {
      commit('auth_logout');
      return user.logout()
    }
  },
  getters: {
  //   isLoggedIn: state => state.user.status === 'success',
  //   authStatus: state => state.user.status,
  //   authedUsername: state => state.user.username
    authorizationHeaders : state => `Bearer ${state.auth.token}`
  }
})
