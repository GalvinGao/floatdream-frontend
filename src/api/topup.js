import service from '@/utils/service'

export default {
  getItem () {
    return service.get('/topup/item')
  },
  placeOrder (order) {
    return service.post('/topup/order', order)
  },
  checkOrder (orderId) {
    return service.get(`/topup/order/${orderId}/status`)
  }
}
