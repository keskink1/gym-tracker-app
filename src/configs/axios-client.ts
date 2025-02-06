import axios from 'axios'
import { API_BASE_URL } from './app-config'

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-auth-token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
