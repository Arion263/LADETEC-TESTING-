<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <div class="d-flex align-center" @click="toggleFilters" style="cursor: pointer">
              <v-icon start class="mr-2">mdi-filter</v-icon>
              Tareas Pendientes
              <v-icon :icon="showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="ml-2"/>
            </div>
            <v-spacer />
            <v-btn color="primary" @click="openDialog">
              Nueva Tarea
            </v-btn>
          </v-card-title>

          <v-expand-transition>
            <div v-show="showFilters">
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="filters.status"
                      :items="statusOptions"
                      label="Estado"
                      clearable
                      density="compact"
                      @update:model-value="handleFilterChange"
                    />
                  </v-col>
                  
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="filters.priority"
                      :items="priorityOptions"
                      label="Prioridad"
                      clearable
                      density="compact"
                      @update:model-value="handleFilterChange"
                    />
                  </v-col>
                </v-row>
                <div class="d-flex justify-end">
                  <v-btn 
                    color="primary" 
                    variant="text" 
                    @click="applyFilters" 
                    size="small"
                    class="mr-2"
                    :loading="loading"
                  >
                    <v-icon start>mdi-filter-check</v-icon>
                    Aplicar Filtros
                  </v-btn>
                  <v-btn 
                    color="error" 
                    variant="text" 
                    @click.stop="resetFilters" 
                    size="small"
                  >
                    <v-icon start>mdi-filter-remove</v-icon>
                    Limpiar Filtros
                  </v-btn>
                </div>
              </v-card-text>
              <v-divider></v-divider>
            </div>
          </v-expand-transition>
          
          <v-card-text>
            <v-list v-if="tasks.length">
              <v-list-item v-for="task in tasks" :key="task.id">
                <v-list-item-title class="text-h5">{{ task.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex align-center">
                    <div class="text-body-1 mr-4">{{ task.description }}</div>
                    <v-chip label small class="mr-2">Prioridad: {{ getPriorityText(task.priority) }}</v-chip>
                    <v-chip label small class="mr-2" v-if="task.due_date">Fecha límite: {{ formatDate(task.due_date) }}</v-chip>
                    <v-chip label small class="mr-2">Creado: {{ formatDate(task.created_at) }}</v-chip>
                    <v-chip 
                      label 
                      small
                      color="primary"
                      class="text-capitalize"
                    >
                      <v-icon start size="small">mdi-account</v-icon>
                      {{ task.user }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-chip
                    :color="getStatusColor(task.status)"
                    class="mr-2"
                    size="small"
                  >
                    {{ getStatusText(task.status) }}
                  </v-chip>
                  <v-btn icon class="mr-2" @click="openEditDialog(task)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="handleDeleteTask(task.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info" class="mt-3">
              No hay tareas pendientes
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <TaskChart class="mb-4"/>
        <UpcomingTasks />
      </v-col>
    </v-row>

    <v-dialog v-model="dialogOpen" max-width="500px">
      <v-card>
        <v-card-title>Nueva Tarea</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="newTask.title"
              label="Título"
              required
              :rules="[(v: string) => !!v || 'El título es requerido']"
            />
            
            <v-textarea
              v-model="newTask.description"
              label="Descripción"
            />

            <v-select
              v-model="newTask.priority"
              :items="priorityOptions"
              label="Prioridad"
              required
            />

            <v-select
              v-model="newTask.status"
              :items="statusOptions"
              label="Estado"
              required
            />

            <v-text-field
              v-model="newTask.due_date"
              label="Fecha límite"
              type="date"
            />
            
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" type="submit" :loading="loading">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>Editar Tarea</v-card-title>
        <v-card-text>
          <v-form ref="editForm" @submit.prevent="handleEditSubmit">
            <v-text-field
              v-model="editingTask.title"
              label="Título"
              required
              :rules="[(v: string) => !!v || 'El título es requerido']"
            />
            
            <v-textarea
              v-model="editingTask.description"
              label="Descripción"
            />

            <v-select
              v-model="editingTask.priority"
              :items="priorityOptions"
              label="Prioridad"
              required
            />

            <v-select
              v-model="editingTask.status"
              :items="statusOptions"
              label="Estado"
              required
            />

            <v-text-field
              v-model="editingTask.due_date"
              label="Fecha límite"
              type="date"
            />
            
            <v-card-actions>
              <v-spacer />
              <v-btn color="error" @click="editDialogOpen = false">
                Cancelar
              </v-btn>
              <v-btn color="primary" type="submit" :loading="loading">
                Guardar cambios
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="confirmDeleteTask"
            :loading="loading"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'
import TaskChart from './TaskChart.vue'
import UpcomingTasks from './UpcomingTasks.vue'

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

interface TaskFilters {
  status?: string;
  priority?: number;
  user?: string | null;
}

const store = useTaskStore()
const authStore = useAuthStore()
const tasks = computed(() => store.sortedTasks)
const dialogOpen = ref(false)
const loading = ref(false)
const form = ref<any>(null)

const newTask = ref<Task>({
  id: 0,
  title: '',
  description: '',
  status: 'PENDING' as const,
  priority: 1 as 1 | 2 | 3 | 4,
  due_date: null,
  user: authStore.userEmail || ''
})

const priorityOptions = [
  { title: 'Alta', value: 1 },
  { title: 'Media', value: 2 },
  { title: 'Baja', value: 3 },
  { title: 'Urgente', value: 4 }
]

const statusOptions = [
  { title: 'Pendiente', value: 'PENDING' },
  { title: 'En progreso', value: 'IN_PROGRESS' },
  { title: 'Completada', value: 'COMPLETED' },
]

const getPriorityText = (priority: number) => {
  return priorityOptions.find(opt => opt.value === priority)?.title || 'Desconocida'
}

const getStatusText = (status: string) => {
  return statusOptions.find(opt => opt.value === status)?.title || 'Desconocido'
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

const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const resetForm = () => {
  newTask.value = {
    id: 0,
    title: '',
    description: '',
    status: 'PENDING' as const,
    priority: 4 as 1 | 2 | 3 | 4,
    due_date: null,
    user: authStore.userEmail || ''
  }
}

const openDialog = () => {
  resetForm()
  dialogOpen.value = true
}

const handleSubmit = async () => {
  if (!newTask.value.title) return
  
  loading.value = true
  try {
    await store.addTask(newTask.value)
    dialogOpen.value = false
    resetForm()
  } finally {
    loading.value = false
  }
}

const deleteDialog = ref(false)
const taskToDelete = ref<number | null>(null)

const handleDeleteTask = (id: number) => {
  taskToDelete.value = id
  deleteDialog.value = true
}

const confirmDeleteTask = async () => {
  if (!taskToDelete.value) return
  
  loading.value = true
  try {
    await store.deleteTask(taskToDelete.value)
    deleteDialog.value = false
  } finally {
    loading.value = false
    taskToDelete.value = null
  }
}

const editDialogOpen = ref(false)
const editingTask = ref<Task>({
  id: 0,
  title: '',
  description: '',
  status: 'PENDING',
  priority: 1,
  due_date: null,
  user: authStore.userEmail || ''
})
const editForm = ref<any>(null)

const openEditDialog = (task: Task) => {
  editingTask.value = { ...task }
  editDialogOpen.value = true
}

const handleEditSubmit = async () => {
  if (!editingTask.value.title) return
  
  loading.value = true
  try {
    const taskToUpdate = {
      ...editingTask.value,
      user: authStore.userEmail || editingTask.value.user || ''
    }
    await store.updateTask(editingTask.value.id, taskToUpdate)
    editDialogOpen.value = false
  } finally {
    loading.value = false
  }
}

const filters = ref<TaskFilters>({
  status: '',
  priority: undefined,
  user: authStore.userEmail || undefined
})

const showFilters = ref(false)

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const handleFilterChange = async () => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, value]) => value !== '' && value !== undefined)
  )
  
  
  activeFilters.user = authStore.userEmail || null

  loading.value = true
  try {
    await store.fetchTasksWithFilters(activeFilters)
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  loading.value = true
  try {
    await store.fetchTasksWithFilters(filters.value)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    status: '',
    priority: undefined,
    user: authStore.userEmail || undefined
  }
  handleFilterChange()
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchTasksWithFilters({ user: authStore.userEmail })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-select,
.v-text-field {
  transition: all 0.3s ease;
}

.v-select:hover,
.v-text-field:hover {
  transform: translateY(-2px);
}


.v-card-title {
  user-select: none;
}

.v-icon {
  transition: transform 0.3s ease;
}

.v-card-title:hover .v-icon {
  transform: scale(1.2);
}
</style> 