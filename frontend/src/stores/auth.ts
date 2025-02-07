import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  email: string
  first_name: string
  last_name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const response = await axios.post('/api/token/', { email, password })
        this.token = response.data.access
        localStorage.setItem('token', response.data.access)
        await this.fetchUser()
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      this.loading = true
      try {
        const response = await axios.get('/api/user/')
        this.user = response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
}) 