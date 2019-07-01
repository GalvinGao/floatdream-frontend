import service from '@/utils/service'
import encryptor from "@/utils/encryptor";
import qs from 'qs';

export default {
  placeOrder (order) {
    return service.post('/sponsor/order', qs.stringify({
      payload: encryptor.encrypt(order)
    }))
  },
  checkOrder (orderId) {
    return service.get(`/sponsor/order/${orderId}/status`)
  }
}
