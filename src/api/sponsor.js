import service from '@/utils/service'

export default {
  postSponsorData () {
    return service.post('/sponsor/')
  }
}
