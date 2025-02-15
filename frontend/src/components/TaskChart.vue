<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-chart-donut" class="me-2"/>
      Estado de Tareas
    </v-card-title>

    <v-card-text>
      <v-fade-transition>
        <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px">
          <v-progress-circular indeterminate color="primary"/>
        </div>
        <div v-else class="chart-container">
          <Doughnut
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </v-fade-transition>

      <!-- Resumen de estadísticas -->
      <v-row class="mt-4">
        <v-col cols="6">
          <v-card variant="outlined" class="pa-2">
            <div class="text-caption">Pendientes</div>
            <div class="text-h6 primary--text">{{ store.taskStats.pending }}</div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card variant="outlined" class="pa-2">
            <div class="text-caption">Completadas</div>
            <div class="text-h6 success--text">{{ store.taskStats.completed }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTaskStore } from '@/stores/task'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useTaskStore()
const loading = ref(false)

const chartData = computed(() => ({
  labels: ['Pendientes', 'Completadas'],
  datasets: [{
    data: [store.taskStats.pending, store.taskStats.completed],
    backgroundColor: ['#FF6384', '#36A2EB'],
    hoverBackgroundColor: ['#FF6384DD', '#36A2EBDD'],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        font: {
          size: 14
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((context.raw / total) * 100)
          return `${context.label}: ${context.raw} (${percentage}%)`
        }
      }
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutCubic' as const
  }
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
  transition: all 0.3s ease;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style> 