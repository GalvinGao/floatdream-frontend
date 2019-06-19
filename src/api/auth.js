import service from '@/utils/service'
import qs from 'qs';

export default {
  postCredentials(body) {
    return service.post('/auth/validate', qs.stringify({
      payload: body
    }))
  }
}
