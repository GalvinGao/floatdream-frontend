import service from '@/utils/service'

export default {
  get() {
    return service.get('/status')
  }
}
