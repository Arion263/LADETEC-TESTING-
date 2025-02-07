import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('userEmail')
    
    return {
      user: userEmail ? { email: userEmail, first_name: '', last_name: '' } : null,
      token,
      loading: false,
      error: null as string | null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const response = await axios.post('http://localhost:8000/api/token/', { email, password })
        this.token = response.data.access
        localStorage.setItem('token', response.data.access)
        localStorage.setItem('userEmail', email)
        this.user = { email, first_name: '', last_name: '' }
      } catch (error: any) {
        this.error = error.response?.data?.detail || 'Error al iniciar sesión'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
    },

    async refreshAccessToken() {
      try {
        const response = await axios.post('http://localhost:8000/api/token/refresh/')
        this.token = response.data.access
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
}) 