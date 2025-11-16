import axios from 'axios'

import config from '/src/constants/config'

class ApiService {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setHeaders(config) {
    const token = localStorage.getItem('access_token')
    const headers = {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
    config.headers = headers
  }

  get(endpoint, params = {}, config = {}) {
    this.setHeaders(config)
    return this.client.get(endpoint, { ...config, params })
  }

  post(endpoint, data, config = {}) {
    this.setHeaders(config)
    return this.client.post(endpoint, data, config)
  }

  patch(endpoint, data, config = {}) {
    this.setHeaders(config)
    return this.client.patch(endpoint, data, config)
  }

  delete(endpoint, config = {}) {
    this.setHeaders(config)
    return this.client.delete(endpoint, config)
  }
}

const api = new ApiService(config.apiUrl)
export default api
