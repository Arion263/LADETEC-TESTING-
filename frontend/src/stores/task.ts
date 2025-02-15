import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useAuthStore } from './auth'

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

type NewTask = Omit<Task, 'id' | 'created_at'> & {
  user: string | null;
}

interface TaskFilters {
  status?: string;
  priority?: number;
  user?: string | null;
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    pendingTasks: (state) => state.tasks.filter(task => task.status === 'PENDING'),
    completedTasks: (state) => state.tasks.filter(task => task.status === 'COMPLETED'),
    taskStats: (state) => ({
      pending: state.tasks.filter(task => task.status === 'PENDING').length,
      completed: state.tasks.filter(task => task.status === 'COMPLETED').length,
    }),
    sortedTasks: (state) => {
      const statusOrder = {
        'IN_PROGRESS': 0,
        'PENDING': 1,
        'COMPLETED': 2,
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
        const authStore = useAuthStore()
        this.tasks = response.data.map((task: Task) => ({
          ...task,
          user: authStore.userEmail || task.user
        }))
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async addTask(task: NewTask) {
      const authStore = useAuthStore()
      try {
        const response = await axios.post('http://localhost:8000/pending-tasks/', task, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        this.tasks.push(response.data)
      } catch (error: any) {
        this.error = error.message
      }
    },
    
    async updateTask(id: number, updates: Partial<Task>) {
      try {
        const response = await axios.put(`http://localhost:8000/pending-tasks/${id}/`, updates, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
      } catch (error: any) {
        this.error = error.message
      }
    },
    
    async deleteTask(id: number) {
      try {
        await axios.delete(`http://localhost:8000/pending-tasks/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error: any) {
        this.error = error.message
      }
    },

    async fetchTasksByStatus(status: string) {
      try {
        const response = await axios.get(`/pending-tasks/by_status/?status=${status}`)
        return response.data
      } catch (error: any) {
        this.error = error.message
      }
    },

    async fetchTasksByPriority(priority: string) {
      try {
        const response = await axios.get(`/pending-tasks/by_priority/?priority=${priority}`)
        return response.data
      } catch (error: any) {
        this.error = error.message
      }
    },

    async fetchTasksWithFilters(filters: TaskFilters) {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      try {
        const response = await axios.get(`/pending-tasks/?${params.toString()}`)
        this.tasks = response.data
      } catch (error: any) {
        this.error = error.message
      }
    }
  }
})  