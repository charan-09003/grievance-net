import _ from 'lodash'
import ApiService from '/src/services/api/ApiService'

class UserService {
  async getComplaints(page = 1) {
    if (!_.isNumber(page)) {
      page = 1
    }
    return ApiService.get('/api/user/complaints', {
      page: Math.max(1, page),
    })
  }
}

const userService = new UserService()
export default userService
