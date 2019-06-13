import axios from 'axios'
import MockAdapter from "axios-mock-adapter";
import mocker from "./mocking";

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8090' : '',
  withCredentials: true
});

if (process.env.NODE_ENV === 'development') {
  mocker(new MockAdapter(service, { delayResponse: Math.floor(Math.random() * 500) + 500 }));
}

export default service
