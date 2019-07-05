import service from '@/utils/service'
import encryptor from "@/utils/encryptor";
import qs from 'qs';

export default {
  getItem () {
    return service.get('/topup/item')
  },
  placeOrder (order) {
    return service.post('/topup/order', qs.stringify({
      payload: encryptor.encrypt(order)
    }))
  },
  checkOrder (orderId) {
    return service.get(`/topup/order/${orderId}/status`)
  }
}
