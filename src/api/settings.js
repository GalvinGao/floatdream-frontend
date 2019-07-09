import service from '@/utils/service'

export default {
  updateNickname(body) {
    return service.patch('/user/nickname', body)
  }
}
