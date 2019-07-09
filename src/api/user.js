import service from '@/utils/service'

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
