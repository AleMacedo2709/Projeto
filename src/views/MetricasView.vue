<script setup lang="ts">
import { ref } from 'vue';
import MetricasGerais from '../components/dashboard/MetricasGerais.vue';
import MetricasPrograma from '../components/dashboard/MetricasPrograma.vue';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import { mockData } from '../mocks/cadastros';

const programas = ref(mockData.programas);
const programaSelecionado = ref<number | null>(null);
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <TheSidebar class="flex-shrink-0" />

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <TheHeader />

      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div class="flex justify-between items-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Métricas e KPIs
              </h1>
            </div>

            <div class="space-y-8">
              <MetricasGerais />
              
              <!-- Métricas por Programa -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Métricas por Programa
                  </h2>
                  <select
                    v-model="programaSelecionado"
                    class="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  >
                    <option :value="null">Selecione um programa</option>
                    <option
                      v-for="programa in programas"
                      :key="programa.id"
                      :value="programa.id"
                    >
                      {{ programa.nome_programa }}
                    </option>
                  </select>
                </div>

                <MetricasPrograma
                  v-if="programaSelecionado"
                  :programa-id="programaSelecionado"
                />

                <p
                  v-else
                  class="text-gray-500 dark:text-gray-400 text-center py-8"
                >
                  Selecione um programa para visualizar suas métricas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>