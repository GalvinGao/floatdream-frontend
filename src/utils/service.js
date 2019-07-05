import axios from 'axios'
import MockAdapter from "axios-mock-adapter";
import mocker from "./mocking";
import router from '@/router';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/api' : '',
});

if (process.env.NODE_ENV === 'development') {
  mocker(new MockAdapter(service, {
    delayResponse: 3000
  }));
}

service.interceptors.response.use(response => {
  // I want to do nothing with the response data
  return response;
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 444) {
    return router.push({name: 'Login', query: {reason: 'sessionExpired'}})
  }
  // Do something with response error
  return Promise.reject(error);
});

export default service
