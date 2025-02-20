<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Percentual de Conclusão -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Conclusão</h3>
          <div 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            {{ indicadores.status === 'em_dia' ? 'Em dia' : indicadores.status === 'atrasado' ? 'Atrasado' : 'Crítico' }}
          </div>
        </div>
        <div class="mt-2 flex items-center">
          <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {{ indicadores.percentualConclusao }}%
          </div>
          <div class="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <template v-if="indicadores.diasAtraso > 0">
              {{ indicadores.diasAtraso }} dias de atraso
            </template>
            <template v-else>
              No prazo
            </template>
          </div>
        </div>
        <div class="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full"
            :class="progressClass"
            :style="{ width: `${indicadores.percentualConclusao}%` }"
          ></div>
        </div>
      </div>

      <!-- Economia -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Economia</h3>
        <div class="mt-2 flex items-baseline">
          <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {{ formatarMoeda(indicadores.economia) }}
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {{ indicadores.economia > 0 ? 'Economia realizada' : 'Acima do orçamento' }}
        </div>
      </div>

      <!-- Nível de Risco -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Nível de Risco</h3>
        <div class="mt-2 flex items-center">
          <div 
            class="text-2xl font-semibold capitalize"
            :class="riskColorClass"
          >
            {{ indicadores.nivelRisco.nivel }}
          </div>
          <div class="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({{ indicadores.nivelRisco.pontuacao.toFixed(1) }})
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <div 
            v-for="nivel in ['baixo', 'medio', 'alto', 'critico']" 
            :key="nivel"
            class="h-2 flex-1 rounded"
            :class="[
              nivel === indicadores.nivelRisco.nivel ? riskBackgroundClass : 'bg-gray-200 dark:bg-gray-700'
            ]"
          ></div>
        </div>
      </div>

      <!-- Status Geral -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Status Geral</h3>
        <div class="mt-2">
          <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {{ iniciativa.status_atual }}
          </div>
          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Última atualização: {{ formatarData(iniciativa.data_ultima_atualizacao) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Iniciativa } from '../../types/iniciativas';
import type { IndicadoresIniciativa } from '../../services/calculosIniciativa';

const props = defineProps<{
  iniciativa: Iniciativa;
  indicadores: IndicadoresIniciativa;
}>();

const statusClass = computed(() => {
  switch (props.indicadores.status) {
    case 'em_dia':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'atrasado':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'critico':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
});

const progressClass = computed(() => {
  if (props.indicadores.status === 'critico') return 'bg-red-600 dark:bg-red-500';
  if (props.indicadores.status === 'atrasado') return 'bg-yellow-600 dark:bg-yellow-500';
  return 'bg-green-600 dark:bg-green-500';
});

const riskColorClass = computed(() => {
  switch (props.indicadores.nivelRisco.nivel) {
    case 'baixo':
      return 'text-green-600 dark:text-green-400';
    case 'medio':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'alto':
      return 'text-orange-600 dark:text-orange-400';
    case 'critico':
      return 'text-red-600 dark:text-red-400';
  }
});

const riskBackgroundClass = computed(() => {
  switch (props.indicadores.nivelRisco.nivel) {
    case 'baixo':
      return 'bg-green-600 dark:bg-green-500';
    case 'medio':
      return 'bg-yellow-600 dark:bg-yellow-500';
    case 'alto':
      return 'bg-orange-600 dark:bg-orange-500';
    case 'critico':
      return 'bg-red-600 dark:bg-red-500';
  }
});

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

const formatarData = (data: string | undefined) => {
  if (!data) return 'N/A';
  return new Date(data).toLocaleDateString('pt-BR');
};
</script> 