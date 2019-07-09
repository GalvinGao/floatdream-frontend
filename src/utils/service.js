import axios from 'axios'
import MockAdapter from "axios-mock-adapter";
import mocker from "./mocking";
import router from '@/router';
import store from '@/store';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8085/api' : '/api'
});

if (process.env.NODE_ENV === 'development') {
  // mocker(new MockAdapter(service, {
  //   delayResponse: 3000
  // }));
}

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (store.state.auth.token) {
    config.headers = {
      Authorization: store.getters.authorizationHeaders
    };
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

service.interceptors.response.use(response => {
  // I want to do nothing with the response data
  return response;
}, function (error) {
  if (error.response && error.response.status === 426) {
    store.commit('auth_logout');
    return router.push({name: 'Login', query: {reason: 'sessionExpired'}})
  } else if(error.response && error.response.status === 401) {
    store.commit('auth_logout');
    return router.push({name: 'Login', query: {reason: 'authorizationFailed'}})
  }
  error.responseMessage = error.response.data.message || `${error.message} (http-${error.statusCode})`;
  // Do something with response error
  return Promise.reject(error);
});

export default service
