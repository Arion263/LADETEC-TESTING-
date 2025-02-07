<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 text-center py-4">
            <v-icon large color="primary" class="mr-2">mdi-login</v-icon>
            Iniciar Sesión
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                :rules="[
                  v => !!v || 'El email es requerido',
                  v => /.+@.+\..+/.test(v) || 'Email debe ser válido'
                ]"
                required
              />

              <v-text-field
                v-model="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[v => !!v || 'La contraseña es requerida']"
                required
              />

              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
                closable
              >
                {{ error }}
              </v-alert>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  block
                >
                  Iniciar Sesión
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
  if (!email.value || !password.value) return
  
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.detail || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-4px);
}

.v-text-field {
  transition: all 0.3s ease;
}

.v-text-field:focus-within {
  transform: translateY(-2px);
}
</style> 