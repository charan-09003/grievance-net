import ApiService from '/src/services/api/ApiService'

class AuthService {
  async login(email, password) {
    return ApiService.post('/api/user/login', {
      email: email,
      password: password,
    })
  }

  async register(name, email, password) {
    return ApiService.post('/api/user/register', {
      name: name,
      email: email,
      password: password,
    })
  }

  async checkLogin() {
    return ApiService.get('/api/user/check-login')
  }
}

const authService = new AuthService()
export default authService
