<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { MetricasPrograma as MetricasProgramaType } from '@/services/metricas';
import { calcularMetricasPrograma } from '@/services/metricas';
import { useIniciativasStore } from '@/stores/iniciativas';

const props = defineProps<{
  programaId: number;
}>();

const iniciativasStore = useIniciativasStore();

const metricas = ref<MetricasProgramaType>({
  total_iniciativas: 0,
  percentual_conclusao_medio: 0,
  orcamento_total: 0,
  economia_total: 0,
  nivel_risco_medio: 0,
  desempenho_geral: 0
});

const iniciativasPrograma = computed(() => {
  return iniciativasStore.iniciativas.filter(i => i.programa_id === props.programaId);
});

const atualizarMetricas = () => {
  if (iniciativasPrograma.value.length > 0) {
    metricas.value = calcularMetricasPrograma(iniciativasPrograma.value);
  }
};

watch(iniciativasPrograma, () => {
  atualizarMetricas();
}, { immediate: true });

onMounted(async () => {
  await iniciativasStore.fetchIniciativas();
  atualizarMetricas();
});

const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  }).format(valor);
};

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
    <!-- Loading State -->
    <div v-if="iniciativasStore.loading" class="flex justify-center items-center py-12">
      <div data-testid="loading-spinner" class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="iniciativasStore.error" class="text-center py-12">
      <p data-testid="error-message" class="text-red-600 dark:text-red-400">{{ iniciativasStore.error }}</p>
      <button 
        @click="iniciativasStore.fetchIniciativas()"
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        Tentar Novamente
      </button>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total de Iniciativas -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total de Iniciativas
        </h3>
        <p data-testid="total-iniciativas-programa" class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ metricas.total_iniciativas }}
        </p>
      </div>

      <!-- Percentual Médio de Conclusão -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Conclusão Média
        </h3>
        <p data-testid="percentual-medio-programa" class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ formatarNumero(metricas.percentual_conclusao_medio) }}%
        </p>
      </div>

      <!-- Orçamento Total -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Orçamento Total
        </h3>
        <p data-testid="orcamento-total-programa" class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ formatarMoeda(metricas.orcamento_total) }}
        </p>
      </div>

      <!-- Economia Total -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Economia Total
        </h3>
        <p data-testid="economia-total-programa" class="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
          {{ formatarMoeda(metricas.economia_total) }}
        </p>
      </div>

      <!-- Nível de Risco Médio -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Nível de Risco Médio
        </h3>
        <p data-testid="nivel-risco-programa" class="mt-2 text-3xl font-semibold"
           :class="[
             metricas.nivel_risco_medio <= 2 ? 'text-green-600 dark:text-green-400' :
             metricas.nivel_risco_medio <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
             'text-red-600 dark:text-red-400'
           ]">
          {{ formatarNumero(metricas.nivel_risco_medio) }}
        </p>
      </div>

      <!-- Desempenho Geral -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Desempenho Geral
        </h3>
        <p data-testid="desempenho-programa" class="mt-2 text-3xl font-semibold"
           :class="[
             metricas.desempenho_geral >= 80 ? 'text-green-600 dark:text-green-400' :
             metricas.desempenho_geral >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
             'text-red-600 dark:text-red-400'
           ]">
          {{ formatarNumero(metricas.desempenho_geral) }}
        </p>
      </div>
    </div>
  </div>
</template> 