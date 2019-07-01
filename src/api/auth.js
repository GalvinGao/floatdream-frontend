import service from '@/utils/service'
import qs from 'qs';

export default {
  login(body) {
    return service.post('/user/login', qs.stringify({
      payload: body
    }))
  },
  logout() {
    return service.get('/user/logout')
  }
}
