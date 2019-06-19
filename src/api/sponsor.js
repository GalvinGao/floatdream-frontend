import service from '@/utils/service'

export default {
  newOrder (order) {
    return service.post('/sponsor/order')
  }
}
