import ApiService from '/src/services/api/ApiService'

class ComplaintService {
  async submit(location, description, urgency = undefined) {
    return ApiService.post('/api/submit_complaint', {
      location: location,
      description: description,
      urgency: urgency,
    })
  }
}

const complaintService = new ComplaintService()
export default complaintService
