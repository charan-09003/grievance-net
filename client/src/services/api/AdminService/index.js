import _ from 'lodash'
import ApiService from '/src/services/api/ApiService'

class AdminService {
  async getAllComplaints(page = 1) {
    if (!_.isNumber(page)) {
      page = 1
    }
    return ApiService.get('/api/admin/complaints', {
      page: Math.max(1, page),
    })
  }

  async setComplaintStatus(complaintId, status) {
    return ApiService.patch(`/api/admin/complaints/${complaintId}`, {
      status: status,
    })
  }
}

const adminService = new AdminService()
export default adminService
