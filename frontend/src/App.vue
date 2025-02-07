<template>
  <v-app>
    <v-app-bar v-if="authStore.isAuthenticated">
      <v-app-bar-title>Task Manager</v-app-bar-title>
      <v-spacer />
      <v-btn
        color="error"
        prepend-icon="mdi-logout"
        @click="handleLogout"
        :loading="loading"
        variant="tonal"
      >
        Cerrar Sesión
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  try {
    authStore.logout()
    router.push('/login')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      authStore.user = { 
        email: userEmail,
        first_name: '',
        last_name: ''
      }
    }
  }
})
</script>

<style>
.v-application {
  background-color: #121212 !important;
}

.v-card {
  background-color: #1E1E1E !important;
}

.v-btn {
  transition: transform 0.2s;
}

.v-btn:hover {
  transform: translateY(-2px);
}
</style> 