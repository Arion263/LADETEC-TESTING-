import { defineStore } from 'pinia'
import axios from 'axios'

interface Task {
  id: number
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 1 | 2 | 3 | 4
  created_at?: string
  due_date: string | null
  user: string | null
}

interface TaskStats {
  pending: number
  completed: number
}

interface TaskFilters {
  status?: string
  priority?: number
  user?: string | null
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    taskStats: {
      pending: 0,
      completed: 0
    } as TaskStats
  }),

  getters: {
    sortedTasks: (state) => {
      const statusOrder = {
        'IN_PROGRESS': 0,
        'PENDING': 1,
        'COMPLETED': 2,
        'CANCELLED': 3
      }
      
      return [...state.tasks].sort((a, b) => 
        statusOrder[a.status as keyof typeof statusOrder] - 
        statusOrder[b.status as keyof typeof statusOrder]
      )
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        const response = await axios.get('/pending-tasks/')
        this.tasks = response.data
        this.updateTaskStats()
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchTasksWithFilters(filters: TaskFilters) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        const response = await axios.get(`/pending-tasks/?${params.toString()}`)
        this.tasks = response.data
        this.updateTaskStats()
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addTask(task: Omit<Task, 'id' | 'created_at'>) {
      this.loading = true
      try {
        const response = await axios.post('/pending-tasks/', task)
        await this.fetchTasks()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(id: number, task: Partial<Task>) {
      this.loading = true
      try {
        const response = await axios.put(`/pending-tasks/${id}/`, task)
        await this.fetchTasks()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id: number) {
      this.loading = true
      try {
        await axios.delete(`/pending-tasks/${id}/`)
        await this.fetchTasks()
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    updateTaskStats() {
      this.taskStats = {
        pending: this.tasks.filter(t => t.status === 'PENDING').length,
        completed: this.tasks.filter(t => t.status === 'COMPLETED').length
      }
    }
  }
}) 