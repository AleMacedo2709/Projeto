<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Atividades Recentes</h2>
    </div>
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="atividade in atividades" :key="atividade.id" class="p-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div 
                class="h-8 w-8 rounded-full flex items-center justify-center"
                :class="atividadeIconClass(atividade.tipo)"
              >
                <component 
                  :is="atividadeIcon(atividade.tipo)" 
                  class="h-5 w-5"
                  :class="atividadeIconColorClass(atividade.tipo)"
                />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ atividade.descricao }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ atividade.usuario }}
              </p>
            </div>
            <div class="flex-shrink-0 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatarData(atividade.data) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  DocumentCheckIcon,
  DocumentIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';

interface Atividade {
  id: number;
  tipo: string;
  descricao: string;
  usuario: string;
  data: string;
}

const props = defineProps<{
  atividades: Atividade[];
}>();

const atividadeIcon = (tipo: string) => {
  switch (tipo) {
    case 'aprovacao':
      return DocumentCheckIcon;
    case 'documento':
      return DocumentIcon;
    case 'comentario':
      return ChatBubbleLeftIcon;
    case 'cronograma':
      return ClockIcon;
    case 'risco':
      return ExclamationTriangleIcon;
    case 'equipe':
      return UserGroupIcon;
    case 'financeiro':
      return CurrencyDollarIcon;
    default:
      return ChartBarIcon;
  }
};

const atividadeIconClass = (tipo: string) => {
  switch (tipo) {
    case 'aprovacao':
      return 'bg-green-100 dark:bg-green-900';
    case 'documento':
      return 'bg-blue-100 dark:bg-blue-900';
    case 'comentario':
      return 'bg-purple-100 dark:bg-purple-900';
    case 'cronograma':
      return 'bg-yellow-100 dark:bg-yellow-900';
    case 'risco':
      return 'bg-red-100 dark:bg-red-900';
    case 'equipe':
      return 'bg-indigo-100 dark:bg-indigo-900';
    case 'financeiro':
      return 'bg-emerald-100 dark:bg-emerald-900';
    default:
      return 'bg-gray-100 dark:bg-gray-900';
  }
};

const atividadeIconColorClass = (tipo: string) => {
  switch (tipo) {
    case 'aprovacao':
      return 'text-green-600 dark:text-green-400';
    case 'documento':
      return 'text-blue-600 dark:text-blue-400';
    case 'comentario':
      return 'text-purple-600 dark:text-purple-400';
    case 'cronograma':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'risco':
      return 'text-red-600 dark:text-red-400';
    case 'equipe':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'financeiro':
      return 'text-emerald-600 dark:text-emerald-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const formatarData = (data: string) => {
  const date = new Date(data);
  const agora = new Date();
  const diff = agora.getTime() - date.getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dias === 0) {
    return 'Hoje';
  } else if (dias === 1) {
    return 'Ontem';
  } else if (dias < 7) {
    return `${dias} dias atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};
</script> 