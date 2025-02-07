import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      try {
        await authStore.refreshAccessToken()
        const originalRequest = error.config
        return axiosInstance(originalRequest)
      } catch (e) {
        authStore.logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance