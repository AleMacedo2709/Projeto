<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { MetricasUnidade, Tendencia } from '@/services/metricas';
import { calcularMetricasUnidade, calcularTendencia } from '@/services/metricas';
import { useIniciativasStore } from '@/stores/iniciativas';

const iniciativasStore = useIniciativasStore();

const metricasUnidade = ref<MetricasUnidade>({
  total_iniciativas: 0,
  percentual_conclusao_medio: 0,
  economia_total: 0,
  nivel_risco_medio: 0,
  iniciativas_atrasadas: 0,
  desempenho_geral: 0
});

const tendenciaDesempenho = ref<Tendencia>({
  valor_atual: 0,
  valor_projetado: 0,
  variacao_percentual: 0,
  tendencia: 'estavel'
});

const historicoConclusao = ref<number[]>([]);

const atualizarMetricas = () => {
  if (iniciativasStore.iniciativas.length > 0) {
    metricasUnidade.value = calcularMetricasUnidade(iniciativasStore.iniciativas);
    historicoConclusao.value = [65, 70, 75, 78, metricasUnidade.value.percentual_conclusao_medio];
    tendenciaDesempenho.value = calcularTendencia(historicoConclusao.value);
  }
};

onMounted(async () => {
  await iniciativasStore.fetchIniciativas();
  atualizarMetricas();
});

const corTendencia = computed(() => {
  switch(tendenciaDesempenho.value.tendencia) {
    case 'crescente': return 'text-green-500';
    case 'decrescente': return 'text-red-500';
    default: return 'text-yellow-500';
  }
});

const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  }).format(valor);
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
      Métricas Gerais
    </h2>

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
        <p data-testid="total-iniciativas" class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ metricasUnidade.total_iniciativas }}
        </p>
      </div>

      <!-- Percentual Médio de Conclusão -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Conclusão Média
        </h3>
        <p data-testid="percentual-medio" class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ formatarNumero(metricasUnidade.percentual_conclusao_medio) }}%
        </p>
        <p class="mt-2 text-sm" :class="corTendencia">
          <span v-if="tendenciaDesempenho.tendencia === 'crescente'">↑</span>
          <span v-else-if="tendenciaDesempenho.tendencia === 'decrescente'">↓</span>
          <span v-else>→</span>
          {{ formatarNumero(tendenciaDesempenho.variacao_percentual) }}% 
          (projeção {{ formatarNumero(tendenciaDesempenho.valor_projetado) }}%)
        </p>
      </div>

      <!-- Iniciativas Atrasadas -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Iniciativas Atrasadas
        </h3>
        <p data-testid="iniciativas-atrasadas" class="mt-2 text-3xl font-semibold" 
           :class="metricasUnidade.iniciativas_atrasadas > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
          {{ metricasUnidade.iniciativas_atrasadas }}
        </p>
      </div>

      <!-- Desempenho Geral -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Desempenho Geral
        </h3>
        <p data-testid="desempenho-geral" class="mt-2 text-3xl font-semibold"
           :class="[
             metricasUnidade.desempenho_geral >= 80 ? 'text-green-600 dark:text-green-400' :
             metricasUnidade.desempenho_geral >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
             'text-red-600 dark:text-red-400'
           ]">
          {{ formatarNumero(metricasUnidade.desempenho_geral) }}
        </p>
      </div>

      <!-- Nível de Risco Médio -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Nível de Risco Médio
        </h3>
        <p data-testid="nivel-risco" class="mt-2 text-3xl font-semibold"
           :class="[
             metricasUnidade.nivel_risco_medio <= 2 ? 'text-green-600 dark:text-green-400' :
             metricasUnidade.nivel_risco_medio <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
             'text-red-600 dark:text-red-400'
           ]">
          {{ formatarNumero(metricasUnidade.nivel_risco_medio) }}
        </p>
      </div>

      <!-- Economia Total -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Economia Total
        </h3>
        <p data-testid="economia-total" class="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
          R$ {{ new Intl.NumberFormat('pt-BR').format(metricasUnidade.economia_total) }}
        </p>
      </div>
    </div>
  </div>
</template>