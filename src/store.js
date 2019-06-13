import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/api/auth'
import cryptico from 'cryptico'

Vue.use(Vuex);

const initialAuthState = {
  state: null,
  username: null,
  token: null,
};

export default new Vuex.Store({
  state: {
    auth: initialAuthState
  },
  mutations: {
    auth_begin (state) {
      state.auth.state = 'loading'
    },
    auth_success (state, username, token) {
      state.auth.state = 'success';
      state.auth.username = username;
      state.auth.token = token;
    },
    auth_error (state) {
      state.auth.state = 'error'
    },
    auth_logout (state) {
      state.auth = {...initialAuthState}
    },
  },
  actions: {
    login ({commit}, credentials) {
      return new Promise((resolve, reject) => {
        commit('auth_begin');
        auth.getParams()
          .then(({data}) => {
            console.log('got params!', data);
            let publicKey = data.publicKey;
            let dataString = JSON.stringify(credentials);
            console.log('encrypting data', dataString, 'with key', publicKey);
            let encryptedPayload;
            try {
              encryptedPayload = cryptico.encrypt(dataString, publicKey);
            } catch (e) {
              console.error('encrypt error', e)
            }
            console.log('encrypted payload', encryptedPayload);

            auth.postCredentials(encryptedPayload.cipher)
              .then(({data}) => {
                console.log('credentials succeeded!', data);
                let username = data.username;
                let token = data.token;

                commit('auth_success', username, token);
                resolve()
              })
              .catch(err => {
                console.error('credentials failed!', err);
                commit('auth_error');
                reject('get params error', err)
              })
          })
          .catch(err => {
            commit('auth_error');
            reject('validate error', err)
          });
      })
    },
    logout ({commit}) {
      commit('auth_logout')
    }
  },
  // getters: {
  //   isLoggedIn: state => state.auth.status === 'success',
  //   authStatus: state => state.auth.status,
  //   authedUsername: state => state.auth.username
  // }
})
