import service from '@/utils/service'

export default {
  getParams() {
    return service.get('/auth/params')
  },
  postCredentials(body) {
    return service.post('/auth/validate', {
      payload: body
    })
  }
}
