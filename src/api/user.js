import service from '@/utils/service'
import qs from 'qs';

export default {
  login(body) {
    return service.post('/user/login', body)
  },
  logout() {
    return service.post('/user/logout')
  },
  inspect() {
    return service.get('/user/info')
  }
}
