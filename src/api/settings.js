import service from '@/utils/service'
import qs from 'qs';
import encryptor from "@/utils/encryptor";

export default {
  updateNickname(bodyObject) {
    let encrypted = encryptor.encrypt(bodyObject);
    return service.post('/settings/nickname', qs.stringify({
      payload: encrypted
    }))
  }
}
