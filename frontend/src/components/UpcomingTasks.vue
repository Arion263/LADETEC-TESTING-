<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-clock-alert" class="me-2"/>
      Tareas Próximas a Vencer
    </v-card-title>

    <v-card-text>
      <v-list v-if="upcomingTasks.length">
        <v-list-item
          v-for="task in upcomingTasks"
          :key="task.id"
          :class="getUrgencyClass(task.due_date)"
        >
          <template v-slot:prepend>
            <v-icon :color="getUrgencyColor(task.due_date)">
              mdi-clock-alert-outline
            </v-icon>
          </template>

          <v-list-item-title>{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>
            Vence: {{ formatDueDate(task.due_date) }}
            <v-chip
              :color="getStatusColor(task.status)"
              size="x-small"
              class="ml-2"
            >
              {{ getStatusText(task.status) }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-alert v-else type="info" variant="tonal">
        No hay tareas próximas a vencer
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '@/stores/task'

const store = useTaskStore()

const upcomingTasks = computed(() => {
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  return store.tasks
    .filter(task => {
      if (!task.due_date || task.status === 'COMPLETED') return false
      const dueDate = new Date(task.due_date)
      return dueDate >= today && dueDate <= nextWeek
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
})

const formatDueDate = (date: string | null) => {
  if (!date) return ''
  const dueDate = new Date(date)
  const today = new Date()
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Mañana'
  return `En ${diffDays} días`
}

const getUrgencyColor = (date: string | null) => {
  if (!date) return 'grey'
  const diffDays = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 1) return 'error'
  if (diffDays <= 3) return 'warning'
  return 'info'
}

const getUrgencyClass = (date: string | null) => {
  if (!date) return ''
  const diffDays = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 1) return 'urgent-task'
  if (diffDays <= 3) return 'warning-task'
  return ''
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'IN_PROGRESS': return 'info'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'grey'
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.urgent-task {
  background-color: rgba(var(--v-theme-error), 0.1);
}

.warning-task {
  background-color: rgba(var(--v-theme-warning), 0.1);
}

.v-list-item {
  margin-bottom: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  transform: translateX(4px);
}
</style> 